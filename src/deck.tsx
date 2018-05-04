import * as React from 'react';
import Card from './card';
import cards from './cards';
import { GamePhases } from './enums';
import { isDrawingPhase } from './utility';

export interface DeckProps {
    gamePhase: GamePhases;
    onDrawCard: () => void;
}

export default function Deck(props: DeckProps) {
    return (
        <div className="mb-3 p-1">
            <div>
                <Card card={cards.sabers1} upturned={false} onClick={props.onDrawCard} />
            </div>
        </div>
    );
}