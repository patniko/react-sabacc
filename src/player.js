import React from 'react'
import Card from './card'
import { getHandValue, getActivePlayerId } from './utility'

export default function Player(props) {
    return (
        <div className="border border-dark rounded shadow p-3 mb-5 bg-white rounded">
            <p>{props.player.cards.length} cards in hand, total value: {getHandValue(props.player.cards)}</p>
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits</p>
            {props.player.cards.map((card, index) => <Card key={index} card={card} />)}
            <div>
                <button className="btn btn-outline-dark" onClick={props.onBet}>Bet</button>
                <button className="btn btn-outline-dark" onClick={props.onDontBet}>Don't bet</button>
                <button className="btn btn-outline-dark" onClick={props.onFold}>Fold</button>
            </div>
        </div>
    );
}