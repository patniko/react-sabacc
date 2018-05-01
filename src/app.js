import React, { Component } from 'react';
import Header from './header';
import Deck from './deck';
import Pot from './pot';
import Player from './player';
import AIPlayer from './aiPlayer';
import constants from './constants';
import strings from './strings';
import aiConstants from './aiConstants';
import { getHandWinner, drawCard, clone, isDrawingPhase, drawCardsForEachPlayer, getNewDeck, isBombedOut, isBettingPhase, isMatchingBetPhase, getHandValue, shift } from './utility';
import { gamePhases, handResult } from './enums';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <Header gameState={this.state} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <AIPlayer player={this.state.players[1]} gamePhase={this.state.gamePhase} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Deck deck={this.state.deck} onDrawCard={this.drawCard} onStand={this.stand} gamePhase={this.state.gamePhase} showShiftAlert={this.state.showShiftAlert} />
                    </div>
                    <div className="col">
                        <Pot name="Main pot" amount={this.state.mainPot} />
                    </div>
                    <div className="col">
                        <Pot name="Sabacc pot" amount={this.state.sabaccPot} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Player player={this.state.players[0]} onBet={() => this.bet(0)} onDontBet={this.dontBet} onFold={this.fold} onNextBetChange={e => this.changeNextBet(e, 0)} gameState={this.state} onCallHand={this.callHand} onStartNewHand={this.startNewHand} />
                    </div>
                </div>
            </div>
        );
    }

    /** convenience wrapper around 'setState' method that clones previous state and passes it to updateState callback */
    setNewState = (updateState) => {
        this.setState(prev => {
            const newState = clone(prev);
            updateState(newState);
            return newState;
        });
    };

    bet = (playerId) => {
        this.setNewState(newState => {
            if (isBettingPhase(newState.gamePhase)) {
                const bet = newState.players[playerId].nextBet;
                if (bet <= 0 || bet > newState.players[playerId].balance) {
                    return;
                }
                if (newState.gamePhase === gamePhases.firstPlayerBetting) {
                    this.makeBet(newState, playerId, bet);
                    this.aiMatchBet(newState);
                } else {
                    this.makeBet(newState, playerId, bet);
                    newState.gamePhase = gamePhases.firstPlayerMatchingBet;
                }
            } else if (isMatchingBetPhase(newState.gamePhase)) {
                if (newState.players[playerId].balance > 0) {
                    this.matchBet(newState, playerId);
                    this.aiMakeBet(newState);
                }
            } else {
                return;
            }
        });
    };

    dontBet = () => {
        this.setNewState(newState => {
            if (!isBettingPhase(newState.gamePhase))
                return;

            if (newState.gamePhase === gamePhases.firstPlayerBetting) {
                this.aiMakeBet(newState);
            } else {
                if (newState.handCalled) {
                    this.handleEndRound(newState);
                } else {
                    newState.gamePhase = gamePhases.firstPlayerDraw;
                }
            }
        });
    };

    changeNextBet = (event, playerId) => {
        const value = event.target.value;
        const valid = event.target.validity.valid;

        this.setNewState(newState => {
            if (valid) {
                newState.players[playerId].nextBet = value == '' ? 0 : parseInt(value, 10);
            }
        });
    };

    fold = () => {
        this.setNewState(newState => {
            if (!isMatchingBetPhase(newState.gamePhase)) {
                return;
            }

            if (newState.gamePhase === gamePhases.firstPlayerMatchingBet) {
                newState.players[1].balance += newState.mainPot;
                newState.handResultDescription = strings.handResultSecond;
            } else {
                newState.players[0].balance += newState.mainPot;
                newState.handResultDescription = strings.handResultFirst;
            }

            newState.mainPot = 0;
            newState.gamePhase = gamePhases.handResults;
        });
    };

    drawCard = () => {
        this.setNewState(newState => {
            if (!isDrawingPhase(newState.gamePhase))
                return;

            drawCard(newState, newState.gamePhase === gamePhases.firstPlayerDraw ? 0 : 1);
            this.handlePlayerDoneDrawing(newState);
        });
    };

    stand = () => {
        this.setNewState(newState => {
            if (!isDrawingPhase(newState.gamePhase))
                return;

            this.handlePlayerDoneDrawing(newState);
        });
    };

    callHand = () => {
        this.setNewState(newState => {
            newState.handCalled = true;
        });
    };

    startNewHand = () => {
        this.setNewState(newState => {
            newState.gamePhase = gamePhases.firstPlayerBetting;
            newState.handNum++;
            newState.roundNum = 1;
            newState.shiftCount = 0;
            newState.handCalled = false;

            for (let player of newState.players) {
                this.anteToMainPot(newState, player);
                this.anteToSabaccPot(newState, player);
                player.cards = [];
                player.totalHandBet = 0;
            }

            newState.deck = getNewDeck();
            drawCardsForEachPlayer(newState);
            this.clearRoundBets(newState);
        });
    };

    getInitialState() {
        let state = {
            gamePhase: gamePhases.firstPlayerBetting,
            mainPot: constants.mainPotAnteAmount * constants.playersCount,
            sabaccPot: constants.sabaccPotAnteAmount * constants.playersCount,
            handNum: 1,
            roundNum: 1,
            handResultDescription: "",
            handCalled: false,
            players: [this.createPlayer(0), this.createPlayer(1)],
            deck: getNewDeck(),
            shiftCount: 0,
            showShiftAlert: false
        };
        drawCardsForEachPlayer(state);
        return state;
    }

    createPlayer(id) {
        return {
            id: id,
            cards: [],
            balance: constants.initialPlayerBalance - constants.mainPotAnteAmount - constants.sabaccPotAnteAmount,
            bet: 0,
            totalHandBet: 0,
            nextBet: constants.defaultBetAmount
        };
    }

    handlePlayerDoneDrawing(newState) {
        if (newState.gamePhase === gamePhases.firstPlayerDraw) {
            this.aiDrawCard(newState);
        } else {
            this.handleEndRound(newState);
        }
    }

    handleEndRound(newState) {
        if (!newState.handCalled) {
            this.handleStartNextRound(newState);
            return;
        }

        const result = getHandWinner(newState);
        newState.gamePhase = gamePhases.handResults;
        newState.handResultDescription = result.description;

        for (let player of newState.players) {
            if (isBombedOut(player)) {
                this.anteToSabaccPot(newState, player, newState.mainPot);
            }
        }

        switch (result.winner) {
            case handResult.firstPlayerWon:
            case handResult.secondPlayerWon:
                newState.players[result.winner].balance += newState.mainPot;
                break;
            case handResult.draw:
            case handResult.bothPlayersLost:
                for (let player of newState.players)
                    player.balance += Math.floor(newState.mainPot / newState.players.length);
                break;
        }
        newState.mainPot = 0;

        if (result.wonSabacc) {
            switch (result.winner) {
                case handResult.firstPlayerWon:
                case handResult.secondPlayerWon:
                    newState.players[result.winner].balance += newState.sabaccPot;
                    break;
                case handResult.draw:
                    for (let player of newState.players)
                        player.balance += Math.floor(newState.sabaccPot / newState.players.length);
                    break;
            }
            newState.sabaccPot = 0;
        }
    }

    handleStartNextRound(newState) {
        newState.gamePhase = gamePhases.firstPlayerBetting;
        newState.roundNum++;
        this.clearRoundBets(newState);
        this.makeShift(newState);
    }

    makeShift(newState) {
        if (shift(newState)) {
            this.showShiftAlert(newState);
        }
    }

    showShiftAlert(newState) {
        newState.showShiftAlert = true;

        setTimeout(() => {
            this.setNewState(newState => {
                newState.showShiftAlert = false;
            });
        }, constants.alertVisibilityTimeInMs);
    }

    clearRoundBets(newState) {
        newState.players[0].bet = newState.players[1].bet = 0;
    }

    makeBet(newState, playerNum, bet) {
        newState.players[playerNum].balance -= bet;
        newState.players[playerNum].bet += bet;
        newState.players[playerNum].totalHandBet += bet;
        newState.mainPot += bet;
    }

    matchBet(newState, playerId) {
        const maxBet = newState.players.reduce((acc, player) => player.bet > acc ? player.bet : acc, 0); // get maximum bet
        const toBet = maxBet - newState.players[playerId].bet; // amount of credits to match maximum bet
        const balance = newState.players[playerId].balance;
        const bet = toBet > balance ? balance : toBet;
        this.makeBet(newState, playerId, bet);
    }

    anteToMainPot(newState, player) {
        player.balance -= constants.mainPotAnteAmount;
        newState.mainPot += constants.mainPotAnteAmount;
    }

    anteToSabaccPot(newState, player, amount = constants.sabaccPotAnteAmount) {
        player.balance -= amount;
        newState.sabaccPot += amount;
    }

    aiMakeBet(newState) {
        const aiPlayer = newState.players[1];
        const handValue = getHandValue(aiPlayer.cards);

        if (handValue < 24 && aiPlayer.balance > 0) {
            for (let betThreshold of aiConstants.betThresholds) {
                if (handValue >= betThreshold.handValue && aiPlayer.totalHandBet < betThreshold.betAmount) {
                    const toBet = betThreshold.betAmount - aiPlayer.totalHandBet;
                    const bet = toBet > aiPlayer.balance ? aiPlayer.balance : toBet;
                    this.makeBet(newState, 1, bet);
                    newState.gamePhase = gamePhases.firstPlayerMatchingBet;
                    return;
                }
            }
        }

        if (newState.handCalled) {
            this.handleEndRound(newState);
        } else {
            newState.gamePhase = gamePhases.firstPlayerDraw;
        }
    }

    aiMatchBet(newState) {
        // todo: fold when necessary
        this.matchBet(newState, 1);
        newState.gamePhase = gamePhases.firstPlayerBetting;
    }

    aiDrawCard(newState) {
        const handValue = getHandValue(newState.players[1].cards);
        if (handValue < aiConstants.drawNewCardHandValueThreshold) {
            drawCard(newState, 1);
        }
        this.handleEndRound(newState);
    }
}