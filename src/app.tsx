import * as  React from 'react';
import Header from './header';
import Deck from './deck';
import Pot from './pot';
import Player from './player';
import AIPlayer from './aiPlayer';
import constants from './constants';
import aiConstants from './aiConstants';
import GameState from './gameState';
import { getHandWinner, drawCard, clone, isDrawingPhase, drawCardsForEachPlayer, getNewDeck, isBombedOut, isBettingPhase, isMatchingBetPhase, getHandValue, shift, getPlayerName } from './utility';
import { HandResult, GamePhases } from './enums';
import PlayerState from './playerState';
import Strings from './strings';
import { AppCenterClient, DeviceInfo } from "./analytics";
import { v1 } from 'uuid';
import AnalyticsFields from './analyticsFields';

export interface AppProps { }

export default class App extends React.Component<AppProps, GameState> {
    private _appCenterClient: AppCenterClient;

    constructor(props: AppProps) {
        super(props);
        this.state = this.getInitialState();
    }

    async componentDidMount() {
        this._appCenterClient = new AppCenterClient('8b36a30a-96c9-4280-9941-b2f076f2827c', v1(), this.getDeviceInfo());
        this._appCenterClient.startService();
        this._appCenterClient.startSession();
        await this._appCenterClient.flush();
    }

    componentWillUnmount() {
        this._appCenterClient.stopService();
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
                        <Deck onDrawCard={this.drawCard} onStand={this.stand} gamePhase={this.state.gamePhase} showShiftAlert={this.state.showShiftAlert} />
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

    bet = (playerId: number) => {
        this.setNewState(newState => {
            if (isBettingPhase(newState.gamePhase)) {
                const bet = newState.players[playerId].nextBet;
                if (bet <= 0 || bet > newState.players[playerId].balance) {
                    return;
                }

                if (newState.gamePhase === GamePhases.FirstPlayerBetting) {
                    this.makeBet(newState, playerId, bet);
                    this.aiMatchBet(newState);
                } else {
                    this.makeBet(newState, playerId, bet);
                    newState.gamePhase = GamePhases.FirstPlayerMatchingBet;
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

            if (newState.gamePhase === GamePhases.FirstPlayerBetting) {
                this.aiMakeBet(newState);
            } else {
                if (newState.handCalled) {
                    this.handleEndRound(newState);
                } else {
                    newState.gamePhase = GamePhases.FirstPlayerDraw;
                }
            }
        });
    };

    changeNextBet = (event: React.ChangeEvent<HTMLInputElement>, playerId: number) => {
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

            this.handleFold(newState, newState.players[1], newState.players[0], Strings.first.fold);
        });
    };

    drawCard = () => {
        this.setNewState(newState => {
            if (!isDrawingPhase(newState.gamePhase)) {
                return;
            }

            const handValueBefore = getHandValue(newState.players[0].cards);
            const card = drawCard(newState, 0);
            this._appCenterClient.trackEvent(AnalyticsFields.draw, {
                card_value: card.value,
                card_total: handValueBefore,
                round: newState.roundNum,
                player: getPlayerName(0)
            });
            this.handlePlayerDoneDrawing(newState);
        });
    };

    stand = () => {
        this.setNewState(newState => {
            if (!isDrawingPhase(newState.gamePhase)) {
                return;
            }

            this._appCenterClient.trackEvent(AnalyticsFields.stand, {
                card_total: getHandValue(newState.players[0].cards),
                round: newState.roundNum,
                player: getPlayerName(0)
            });
            this.handlePlayerDoneDrawing(newState);
        });
    };

    callHand = () => {
        this.setNewState(newState => {
            newState.handCalled = true;
            this._appCenterClient.trackEvent(AnalyticsFields.call, {
                card_total: getHandValue(newState.players[0].cards),
                round: newState.roundNum,
                player: getPlayerName(0)
            });
        });
    };

    startNewHand = () => {
        this.setNewState(newState => {
            newState.gamePhase = GamePhases.FirstPlayerBetting;
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
            this.trackRoundStart(newState);
        });
    };

    /** convenience wrapper around 'setState' method that clones previous state and passes it to updateState callback */
    setNewState(updateState: (newstate: GameState) => void) {
        this.setState(prev => {
            const newState = clone(prev);
            updateState(newState);
            return newState;
        });
    };

    getInitialState(): GameState {
        let state = new GameState();
        state.gamePhase = GamePhases.FirstPlayerBetting;
        state.mainPot = constants.mainPotAnteAmount * constants.playersCount;
        state.sabaccPot = constants.sabaccPotAnteAmount * constants.playersCount;
        state.handNum = 1;
        state.roundNum = 1;
        state.handResultDescription = "";
        state.handCalled = false;
        state.players = [this.createPlayer(0), this.createPlayer(1)];
        state.deck = getNewDeck();
        state.shiftCount = 0;
        state.showShiftAlert = false;

        drawCardsForEachPlayer(state);
        return state;
    }

    createPlayer(id: number): PlayerState {
        var player = new PlayerState();
        player.id = id;
        player.cards = [];
        player.balance = constants.initialPlayerBalance - constants.mainPotAnteAmount - constants.sabaccPotAnteAmount;
        player.bet = 0;
        player.totalHandBet = 0;
        player.nextBet = constants.defaultBetAmount;
        return player;
    }

    handlePlayerDoneDrawing(newState: GameState) {
        if (newState.gamePhase === GamePhases.FirstPlayerDraw) {
            this.aiDrawCard(newState);
        } else {
            this.handleEndRound(newState);
        }
    }

    handleEndRound(newState: GameState) {
        if (!newState.handCalled) {
            this.trackRoundOver(newState);
            this.handleStartNextRound(newState);
            return;
        }

        const result = getHandWinner(newState);
        let winner: string = '';
        newState.gamePhase = GamePhases.HandResults;
        newState.handResultDescription = result.description;

        for (let player of newState.players) {
            if (isBombedOut(player)) {
                this.anteToSabaccPot(newState, player, newState.mainPot);
            }
        }

        switch (result.winner) {
            case HandResult.FirstPlayerWon:
            case HandResult.SecondPlayerWon:
                winner = getPlayerName(result.winner);
                newState.players[result.winner].balance += newState.mainPot;
                break;
            case HandResult.Draw:
            case HandResult.BothPlayersLost:
                winner = Strings.draw.name;
                for (let player of newState.players)
                    player.balance += Math.floor(newState.mainPot / newState.players.length);
                break;
        }
        newState.mainPot = 0;

        if (result.wonSabacc) {
            switch (result.winner) {
                case HandResult.FirstPlayerWon:
                case HandResult.SecondPlayerWon:
                    newState.players[result.winner].balance += newState.sabaccPot;
                    break;
                case HandResult.Draw:
                    for (let player of newState.players)
                        player.balance += Math.floor(newState.sabaccPot / newState.players.length);
                    break;
            }
            newState.sabaccPot = 0;
        }

        this._appCenterClient.trackEvent(AnalyticsFields.handOver, {
            round: newState.roundNum,
            winner: winner
        });
    }

    handleStartNextRound(newState: GameState) {
        newState.gamePhase = GamePhases.FirstPlayerBetting;
        newState.roundNum++;
        this.clearRoundBets(newState);
        this.makeShift(newState);
        this.trackRoundStart(newState);
    }

    handleFold(newState: GameState, winner: PlayerState, loser: PlayerState, handResultDescription: string) {
        winner.balance += newState.mainPot;
        newState.mainPot = 0;
        newState.gamePhase = GamePhases.HandResults;
        newState.handResultDescription = handResultDescription;
        this._appCenterClient.trackEvent(AnalyticsFields.fold, {
            card_total: getHandValue(loser.cards),
            round: newState.roundNum,
            player: getPlayerName(loser.id)
        });
    }

    makeShift(newState: GameState) {
        if (shift(newState)) {
            this.showShiftAlert(newState);
            this._appCenterClient.trackEvent(AnalyticsFields.shift, {
                round: newState.roundNum,
                hand: newState.handNum
            });
        }
    }

    showShiftAlert(newState: GameState) {
        newState.showShiftAlert = true;

        setTimeout(() => {
            this.setNewState(newState => {
                newState.showShiftAlert = false;
            });
        }, constants.alertVisibilityTimeInMs);
    }

    clearRoundBets(newState: GameState) {
        newState.players[0].bet = newState.players[1].bet = 0;
    }

    makeBet(newState: GameState, playerNum: number, bet: number) {
        newState.players[playerNum].balance -= bet;
        newState.players[playerNum].bet += bet;
        newState.players[playerNum].totalHandBet += bet;
        newState.mainPot += bet;
        this._appCenterClient.trackEvent(AnalyticsFields.raise, {
            amount: bet,
            round: newState.roundNum,
            player: getPlayerName(playerNum)
        })
    }

    matchBet(newState: GameState, playerId: number) {
        const maxBet = newState.players.reduce((acc, player) => player.bet > acc ? player.bet : acc, 0); // get maximum bet
        const toBet = maxBet - newState.players[playerId].bet; // amount of credits to match maximum bet
        const balance = newState.players[playerId].balance;
        const bet = toBet > balance ? balance : toBet;
        this.makeBet(newState, playerId, bet);
    }

    anteToMainPot(newState: GameState, player: PlayerState) {
        player.balance -= constants.mainPotAnteAmount;
        newState.mainPot += constants.mainPotAnteAmount;
    }

    anteToSabaccPot(newState: GameState, player: PlayerState, amount: number = constants.sabaccPotAnteAmount) {
        player.balance -= amount;
        newState.sabaccPot += amount;
    }

    aiMakeBet(newState: GameState) {
        const aiPlayer = newState.players[1];
        const handValue = getHandValue(aiPlayer.cards);

        if (handValue < 24 && aiPlayer.balance > 0) {
            for (let betThreshold of aiConstants.betThresholds) {
                if (handValue >= betThreshold.handValue && aiPlayer.totalHandBet < betThreshold.betAmount) {
                    const toBet = betThreshold.betAmount - aiPlayer.totalHandBet;
                    const bet = toBet > aiPlayer.balance ? aiPlayer.balance : toBet;
                    this.makeBet(newState, 1, bet);
                    newState.gamePhase = GamePhases.FirstPlayerMatchingBet;
                    return;
                }
            }
        }

        if (newState.handCalled) {
            this.handleEndRound(newState);
        } else {
            newState.gamePhase = GamePhases.FirstPlayerDraw;
        }
    }

    aiMatchBet(newState: GameState) {
        this.matchBet(newState, 1);
        newState.gamePhase = GamePhases.FirstPlayerBetting;
    }

    aiDrawCard(newState: GameState) {
        const handValue = getHandValue(newState.players[1].cards);
        if (handValue < aiConstants.drawNewCardHandValueThreshold) {
            const card = drawCard(newState, 1);
            this._appCenterClient.trackEvent(AnalyticsFields.draw, {
                card_value: card.value,
                card_total: handValue,
                round: newState.roundNum,
                player: getPlayerName(1)
            });
        } else {
            this._appCenterClient.trackEvent(AnalyticsFields.stand, {
                card_total: handValue,
                round: newState.roundNum,
                player: getPlayerName(1)
            });
        }
        this.handleEndRound(newState);
    }

    getDeviceInfo(): DeviceInfo {
        const deviceInfo = new DeviceInfo();
        deviceInfo.appNamespace = 'sabacc.game';
        deviceInfo.appVersion = '1.0.0';
        deviceInfo.appBuild = '1';
        deviceInfo.carrierName = 'Web';
        deviceInfo.carrierCountry = 'US';
        deviceInfo.locale = 'en_US';
        deviceInfo.osApiLevel = '1';
        deviceInfo.sdkName = 'appcenter.node';
        deviceInfo.sdkVersion = '0.0.1';
        deviceInfo.model = 'PC';
        deviceInfo.oemName = 'PC';
        deviceInfo.osName = 'Windows';
        deviceInfo.osVersion = '10.0.0';
        deviceInfo.osBuild = '1';
        deviceInfo.screenSize = '1920x1080';
        deviceInfo.timeZoneOffset = -8;
        return deviceInfo;
    }

    trackRoundStart(newState: GameState) {
        this._appCenterClient.trackEvent(AnalyticsFields.roundStart, {
            round: newState.roundNum,
            hand: newState.handNum,
            main_pot: newState.mainPot,
            sabacc_pot: newState.sabaccPot
        });
    }

    trackRoundOver(newState: GameState) {
        this._appCenterClient.trackEvent(AnalyticsFields.roundOver, {
            round: newState.roundNum,
            hand: newState.handNum
        });
    }
}