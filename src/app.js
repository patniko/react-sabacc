import React, { Component } from 'react';
import Deck from './deck'
import Pot from './pot'
import Player from './player'
import constants from './constants'
import { getHandWinner, drawCard, clone, isDrawingPhase, getInitialState, gamePhases, phaseDescriptions, handResult, drawCardsForEachPlayer, getNewDeck, isBombedOut, isBettingPhase, isMatchingBetPhase } from './utility'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }

    render() {
        let handResult = this.state.gamePhase === gamePhases.handResults ?
            <div><span>{this.state.handResultDescription}</span></div> : null;

        let startNextRoundButton = this.state.gamePhase === gamePhases.roundOver ?
            <button className="btn btn-outline-dark" onClick={this.startNextRound}>Start next round</button> : null;

        let callHandButton = this.state.gamePhase === gamePhases.roundOver && this.state.roundNum >= constants.numberOfPotBuildingRounds ?
            <button className="btn btn-outline-dark" onClick={this.callHand}>Call hand</button> : null;

        let startNextHandButton = this.state.gamePhase === gamePhases.handResults ?
            <button className="btn btn-outline-dark" onClick={this.startNewHand}>Start next hand</button> : null;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className="border border-dark rounded shadow-lg p-3 mb-5 bg-white">
                            <div>Hand: {this.state.handNum}, round: {this.state.roundNum}, total credits: {this.getTotalCredits(this.state)}, hand called: {this.state.handCalled ? "yes" : "no"}, phase: {phaseDescriptions[this.state.gamePhase]}</div>
                            {handResult}
                            {startNextRoundButton}
                            {callHandButton}
                            {startNextHandButton}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Player player={this.state.players[1]} onBet={this.bet} onDontBet={this.dontBet} onFold={this.fold} />
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col">
                        <Deck deck={this.state.deck} onDrawCard={this.drawCard} onStand={this.stand} />
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
                        <Player player={this.state.players[0]} onBet={this.bet} onDontBet={this.dontBet} onFold={this.fold} />
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

    bet = () => {
        this.setNewState(newState => {
            if (isBettingPhase(newState)) {
                if (newState.gamePhase === gamePhases.firstPlayerBetting) {
                    this.makeBet(newState, 0);
                    newState.gamePhase = gamePhases.secondPlayerMatchingBet;
                } else {
                    this.makeBet(newState, 1);
                    newState.gamePhase = gamePhases.firstPlayerMatchingBet;
                }
            } else if (isMatchingBetPhase(newState)) {
                if (newState.gamePhase === gamePhases.firstPlayerMatchingBet) {
                    this.makeBet(newState, 0);
                    newState.gamePhase = gamePhases.secondPlayerBetting;
                } else {
                    this.makeBet(newState, 1);
                    newState.gamePhase = gamePhases.firstPlayerBetting;
                }
            } else return;
        });
    };

    dontBet = () => {
        this.setNewState(newState => {
            if (!isBettingPhase(newState))
                return;

            if (newState.gamePhase === gamePhases.firstPlayerBetting) {
                newState.gamePhase = gamePhases.secondPlayerBetting;
            } else {
                if (newState.handCalled) {
                    this.handleEndRound(newState);
                } else {
                    newState.gamePhase = gamePhases.firstPlayerDraw;
                }
            }
        });
    };

    fold = () => {
        this.setNewState(newState => {
            if (!isMatchingBetPhase(newState))
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
            if (!isDrawingPhase(newState))
                return;

            drawCard(newState, newState.gamePhase === gamePhases.firstPlayerDraw ? 0 : 1);
            this.handlePlayerDoneDrawing(newState);
        });
    };

    stand = () => {
        this.setNewState(newState => {
            if (!isDrawingPhase(newState))
                return;

            this.handlePlayerDoneDrawing(newState);
        });
    };

    callHand = () => {
        this.setNewState(newState => {
            newState.handCalled = true;
            this.handleStartNextRound(newState);
        });
    };

    startNextRound = () => {
        this.setNewState(newState => {
            this.handleStartNextRound(newState);
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
            newState.gamePhase = gamePhases.secondPlayerDraw;
        } else {
            this.handleEndRound(newState);
        }
    }

    handleEndRound(newState) {
        if (!newState.handCalled) {
            newState.gamePhase = gamePhases.roundOver;
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
                    player.balance += newState.mainPot / newState.players.length;
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
                        player.balance += newState.sabaccPot / newState.players.length;
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

    makeBet(newState, playerNum) {
        newState.players[playerNum].balance -= constants.betAmount;
        newState.players[playerNum].bet += constants.betAmount;
        newState.mainPot += constants.betAmount;
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
}