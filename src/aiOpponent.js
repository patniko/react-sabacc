import React from 'react'
import Card from './card'
import { getHandValue } from './utility'

export default function AIOpponent(props) {
    return (
        <div className="rounded mb-3 p-1 shadow-inactive">
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits, {props.player.cards.length} cards in hand, total value: {getHandValue(props.player.cards)}</p>
            {props.player.cards.map((card, index) => <Card key={index} card={card} />)}
        </div>
    );
}