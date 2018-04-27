import React, { Component } from 'react';
import Deck from './deck'
import Pot from './pot'
import Player from './player'
import AIOpponent from './aiOpponent'
import constants from './constants'
import aiConstants from './aiConstants'
import { getHandWinner, drawCard, clone, isDrawingPhase, getInitialState, gamePhases, phaseDescriptions, handResult, drawCardsForEachPlayer, getNewDeck, isBombedOut, isBettingPhase, isMatchingBetPhase, isRoundOverPhase, getHandValue } from './utility'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }

    render() {
        let handResult = this.state.gamePhase === gamePhases.handResults ?
            <div><span>{this.state.handResultDescription}</span></div> : null;

        let callHandButton = this.canCallHand(this.state) ?
            <button className="btn btn-outline-dark" onClick={this.callHand}>Call hand</button> : null;

        let startNextHandButton = this.state.gamePhase === gamePhases.handResults ?
            <button className="btn btn-outline-dark" onClick={this.startNewHand}>Start next hand</button> : null;

        let className = "rounded mt-3 mb-3 p-1 " + (isRoundOverPhase(this.state.gamePhase) ? "shadow-active" : "shadow-inactive");

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className={className}>
                            <div>Hand: {this.state.handNum}, round: {this.state.roundNum}, total credits: {this.getTotalCredits(this.state)}, hand called: {this.state.handCalled ? "yes" : "no"}, phase: {phaseDescriptions[this.state.gamePhase]}</div>
                            {handResult}
                            {callHandButton}
                            {startNextHandButton}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <AIOpponent player={this.state.players[1]} gamePhase={this.state.gamePhase} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Deck deck={this.state.deck} onDrawCard={this.drawCard} onStand={this.stand} gamePhase={this.state.gamePhase} />
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
                        <Player player={this.state.players[0]} onBet={() => this.bet(0)} onDontBet={this.dontBet} onFold={this.fold} onNextBetChange={e => this.changeNextBet(e, 0)} gamePhase={this.state.gamePhase} />
                    </div>
                </div>
            </div>
        );
    }

    /** convenience wrapper around 'setState' method that clones previous state and passes it to updateState callback */
    setNewState = (updateState) => {
        this.setState(prev => {
            let newState = clone(prev);
            updateState(newState);
            return newState;
        });
    };

    bet = (playerId) => {
        this.setNewState(newState => {
            if (isBettingPhase(newState.gamePhase)) {
                let bet = newState.players[playerId].nextBet;
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
                    newState.gamePhase = newState.gamePhase === gamePhases.firstPlayerMatchingBet ? gamePhases.secondPlayerBetting : gamePhases.firstPlayerBetting;
                }
            } else return;
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
        let value = event.target.value;
        let valid = event.target.validity.valid;

        this.setNewState(newState => {
            if (valid)
                newState.players[playerId].nextBet = value == '' ? 0 : parseInt(value, 10);
        });
    };

    fold = () => {
        this.setNewState(newState => {
            if (!isMatchingBetPhase(newState.gamePhase))
                return;

            if (newState.gamePhase === gamePhases.firstPlayerMatchingBet) {
                newState.players[1].balance += newState.mainPot;
                newState.handResultDescription = "First player folded, second player won this hand";
            } else {
                newState.players[0].balance += newState.mainPot;
                newState.handResultDescription = "Second player folded, first player won this hand";
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
            newState.handCalled = false;

            for (let player of newState.players) {
                this.anteToMainPot(newState, player);
                this.anteToSabaccPot(newState, player);
                player.cards = [];
            }

            newState.deck = getNewDeck();
            drawCardsForEachPlayer(newState);
            this.clearBets(newState);
        });
    };

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

        let result = getHandWinner(newState);
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
        this.clearBets(newState);
    }

    clearBets(newState) {
        newState.players[0].bet = newState.players[1].bet = 0;
    }

    makeBet(newState, playerNum, bet) {
        newState.players[playerNum].balance -= bet;
        newState.players[playerNum].bet += bet;
        newState.mainPot += bet;
    }

    matchBet(newState, playerId) {
        let maxBet = newState.players.reduce((acc, player) => player.bet > acc ? player.bet : acc, 0); // get maximum bet
        let toBet = maxBet - newState.players[playerId].bet; // amount of credits to match maximum bet
        let balance = newState.players[playerId].balance;
        let bet = toBet > balance ? balance : toBet;
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

    getTotalCredits(state) {
        return state.mainPot + state.sabaccPot + state.players.reduce((acc, player) => acc + player.balance, 0);
    }

    aiMakeBet(newState) {
        // todo: make bet
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
        let handValue = getHandValue(newState.players[1].cards);
        if (handValue < aiConstants.drawNewCardHandValueThreshold) {
            drawCard(newState, 1);
        }
        this.handleEndRound(newState);
    }

    canCallHand(state) {
        return !state.handCalled
            && state.roundNum > constants.numberOfPotBuildingRounds
            && isBettingPhase(state.gamePhase)
            && state.players.every(player => player.bet === 0);
    }
}