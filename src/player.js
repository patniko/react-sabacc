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

    return (
        <div className="border border-dark rounded shadow-lg p-3 mb-5 bg-white">
            <p>{props.player.cards.length} cards in hand, total value: {getHandValue(props.player.cards)}</p>
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits</p>
            {props.player.cards.map((card, index) => <Card key={index} card={card} />)}
            {betControls}
        </div>
    );
}