import * as React from 'react';
import Card from './card';
import { getNewDeck } from './utility';

var deck = getNewDeck();

export interface AllCardsProps {
}

export default function AllCards(props: AllCardsProps) {
    return (
        <div className="row">
            <div className="col">
                {deck.map((card, index) =>
                    <Card key={index} card={card} upturned />
                )}
            </div>
        </div>
    );
}