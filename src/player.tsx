import * as React from 'react';
import Card from './card';
import constants from './constants';
import GameState from './gameState';
import PlayerState from './playerState';
import { getHandValue, isDrawingPhase, isBettingPhase, isMatchingBetPhase, getActivePlayerId } from './utility';
import { GamePhases } from './enums';

export interface PlayerProps {
    player: PlayerState;
    gameState: GameState;
    onBet: () => void;
    onDontBet: () => void;
    onCallHand: () => void;
    onFold: () => void;
    onStartNewHand: () => void;
    onDraw: () => void;
    onStand: () => void;
    onNextBetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Player(props: PlayerProps) {
    const gamePhase = props.gameState.gamePhase;

    const customBetInput = isBettingPhase(gamePhase) ?
        <input className="form-control" onChange={props.onNextBetChange} type="text" pattern="[0-9]*" value={props.player.nextBet}></input> : null;

    const betButton = isBettingPhase(gamePhase) || isMatchingBetPhase(gamePhase) ?
        <button className="btn btn-primary" onClick={props.onBet}>{isBettingPhase(gamePhase) ? "Bet" : "Match bet"}</button> : null;

    const dontBetButton = isBettingPhase(gamePhase) ?
        <button className="btn btn-secondary" onClick={props.onDontBet}>Don't bet</button> : null;

    const foldButton = isMatchingBetPhase(gamePhase) ?
        <button className="btn btn-danger" onClick={props.onFold}>Fold</button> : null;

    const callHandButton = canCallHand(props.gameState) ?
        <button className="btn btn-success" onClick={props.onCallHand}>Call hand</button> : null;

    const startNextHandButton = props.gameState.gamePhase === GamePhases.HandResults ?
        <button className="btn btn-primary" onClick={props.onStartNewHand}>Start next hand</button> : null;

    const drawButton = isDrawingPhase(gamePhase) ?
        <button className="btn btn-primary" onClick={props.onDraw}>Draw</button> : null;

    const standButton = isDrawingPhase(gamePhase) ?
        <button className="btn btn-secondary" onClick={props.onStand}>Stand</button> : null;

    return (
        <div className="mb-3 p-1 player">
            <p className="textCenter">
                <span className="inlineBlock">Balance: {props.player.balance} credits</span>
                <span className="inlineBlock">Current bet: {props.player.bet} credits</span>
                <span className="inlineBlock">Total value: {getHandValue(props.player.cards)}</span>
            </p>
            <div className="flexCenter">
                {props.player.cards.map((card, index) => <Card key={index} upturned={true} card={card} />)}
            </div>
            <div className="mt-3 form-inline flexCenter">
                {customBetInput}
                {betButton}
                {dontBetButton}
                {foldButton}
                {callHandButton}
                {startNextHandButton}
                {drawButton}
                {standButton}
            </div>
        </div>
    );
}

function canCallHand(gameState: GameState) {
    return !gameState.handCalled
        && gameState.roundNum > constants.numberOfPotBuildingRounds
        && isBettingPhase(gameState.gamePhase)
        && gameState.players.every(player => player.bet === 0);
}