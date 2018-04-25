import React from 'react';
import Card from './card'
import cards from './cards'

export default function Deck(props) {
    return (
        <div className="border border-dark rounded shadow p-3 mb-5 bg-white rounded">
            <p>remaining: {props.deck.length}</p>
            <div>
                <Card card={cards.cardback} onClick={props.onDrawCard} />
            </div>
            <button className="btn btn-outline-dark" onClick={props.onStand}>Stand</button>
        </div>
    );
}