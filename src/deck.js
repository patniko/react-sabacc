import React from 'react';
import Card from './card'
import cards from './cards'
import { isDrawingPhase } from './utility';

export default function Deck(props) {
    const className = "rounded mb-3 p-1 " + (isDrawingPhase(props.gamePhase) ? "shadow-active" : "shadow-inactive");

    const standButton = isDrawingPhase(props.gamePhase) ?
        <button className="btn btn-outline-dark" onClick={props.onStand}>Stand</button> : null;

    const shiftAlert = props.showShiftAlert ?
        <span className='shift-alert'><strong>Sabacc Shift!</strong></span> : null;

    return (
        <div className={className}>
            <div>
                <Card card={cards.cardback} onClick={props.onDrawCard} />
                {standButton}
                {shiftAlert}
            </div>
        </div>
    );
}