import React from 'react'
import Card from './card'
import { getHandValue, getActivePlayerId } from './utility'

export default function Player(props) {
    return (
        <div style={{ border: '1px solid black' }}>
            <p>{props.player.cards.length} cards in hand, total value: {getHandValue(props.player.cards)}</p>
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits</p>
            {props.player.cards.map((card, index) => <Card key={index} card={card} />)}
            <div>
                <button onClick={props.onBet}>Bet</button>
                <button onClick={props.onDontBet}>Don't bet</button>
                <button onClick={props.onFold}>Fold</button>
            </div>
        </div>
    );
}