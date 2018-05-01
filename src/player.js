import React from 'react'
import Card from './card'
import constants from './constants'
import { gamePhases, getHandValue, isBettingPhase, isMatchingBetPhase, getActivePlayerId } from './utility'

export default function Player(props) {
    let gamePhase = props.gameState.gamePhase;

    let customBetInput = isBettingPhase(gamePhase) ?
        <input className="form-control" onChange={props.onNextBetChange} type="text" pattern="[0-9]*" value={props.player.nextBet}></input> : null;

    let betButton = isBettingPhase(gamePhase) || isMatchingBetPhase(gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onBet}>{isBettingPhase(gamePhase) ? "Bet" : "Match bet"}</button> : null;

    let dontBetButton = isBettingPhase(gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onDontBet}>Don't bet</button> : null;

    let foldButton = isMatchingBetPhase(gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onFold}>Fold</button> : null;

    let callHandButton = canCallHand(props.gameState) ?
        <button className="btn btn-outline-dark" onClick={props.onCallHand}>Call hand</button> : null;

    let startNextHandButton = props.gameState.gamePhase === gamePhases.handResults ?
        <button className="btn btn-outline-dark" onClick={props.onStartNewHand}>Start next hand</button> : null;

    let className = "rounded mb-3 p-1 " + getShadow(props, gamePhase);

    return (
        <div className={className}>
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits, total value: {getHandValue(props.player.cards)}</p>
            {props.player.cards.map((card, index) => <Card key={index} card={card} />)}
            <div className="form-inline">
                {customBetInput}
                {betButton}
                {dontBetButton}
                {foldButton}
                {callHandButton}
                {startNextHandButton}
            </div>
        </div>
    );
}

function canCallHand(gameState) {
    return !gameState.handCalled
        && gameState.roundNum > constants.numberOfPotBuildingRounds
        && isBettingPhase(gameState.gamePhase)
        && gameState.players.every(player => player.bet === 0);
}

function getShadow(props, gamePhase) {
    return (isBettingPhase(gamePhase) || isMatchingBetPhase(gamePhase))
        && getActivePlayerId(gamePhase) === props.player.id
        ? "shadow-active" : "shadow-inactive"
}