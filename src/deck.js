import React from 'react';
import Card from './card'
import cards from './cards'
import { isDrawingPhase } from './utility';

export default function Deck(props) {
    let className = "rounded p-3 mb-5 bg-white " + (isDrawingPhase(props.gamePhase) ? "shadow-active" : "shadow-inactive");

    let standButton = isDrawingPhase(props.gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onStand}>Stand</button> : null;

    return (
        <div className={className}>
            <p>remaining: {props.deck.length}</p>
            <div>
                <Card card={cards.cardback} onClick={props.onDrawCard} />
            </div>
            {standButton}
        </div>
    );
}