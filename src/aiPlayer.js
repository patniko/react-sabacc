import React from 'react'
import Card from './card'
import cards from './cards'
import { getHandValue, gamePhases } from './utility'

export default function AIPlayer(props) {
    let handValue = props.gamePhase === gamePhases.handResults ?
        <span>, total value: {getHandValue(props.player.cards)}</span> : null;

    return (
        <div className="rounded mb-3 p-1 shadow-inactive">
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits{handValue}</p>
            {props.player.cards.map((card, index) => <Card key={index} card={props.gamePhase === gamePhases.handResults ? card : cards.cardback} />)}
        </div>
    );
}