import React from 'react'
import Card from './card'
import { getHandValue, isBettingPhase, isMatchingBetPhase, getActivePlayerId } from './utility'

export default function Player(props) {
    let customBetInput = isBettingPhase(props.gamePhase) ?
        <input className="form-control" onChange={props.onNextBetChange} type="text" pattern="[0-9]*" value={props.player.nextBet}></input> : null;

    let betButton = isBettingPhase(props.gamePhase) || isMatchingBetPhase(props.gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onBet}>{isBettingPhase(props.gamePhase) ? "Bet" : "Match bet"}</button> : null;

    let dontBetButton = isBettingPhase(props.gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onDontBet}>Don't bet</button> : null;

    let foldButton = isMatchingBetPhase(props.gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onFold}>Fold</button> : null;

    let betControls = getActivePlayerId(props.gamePhase) === props.player.id ?
        <div className="form-inline">
            {customBetInput}
            {betButton}
            {dontBetButton}
            {foldButton}
        </div> : null;

    let className = "rounded mb-3 p-1 " + getShadow(props);

    return (
        <div className={className}>
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits, total value: {getHandValue(props.player.cards)}</p>
            {props.player.cards.map((card, index) => <Card key={index} card={card} />)}
            {betControls}
        </div>
    );
}

function getShadow(props) {
    return (isBettingPhase(props.gamePhase) || isMatchingBetPhase(props.gamePhase))
        && getActivePlayerId(props.gamePhase) === props.player.id
        ? "shadow-active" : "shadow-inactive"
}