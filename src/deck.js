import React from 'react';
import Card from './card'
import cards from './cards'

export default function Deck(props) {
    return (
        <div style={{ display: 'inline-block' }}>
            <p>remaining: {props.deck.length}</p>
            <div>
                <Card card={cards.cardback} onClick={props.onDrawCard} />
            </div>
            <button onClick={props.onStand}>Stand</button>
        </div>
    );
}