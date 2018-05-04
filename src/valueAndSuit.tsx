import * as React from 'react';
import CardInfo from './cardInfo';

export interface ValueAndSuitProps {
    card: CardInfo;
    rotated?: boolean;
}

export default function ValueAndSuit(props: ValueAndSuitProps) {
    return (
        <div className={props.rotated ? "valueAndSuitRotated" : "valueAndSuit"}>
            <div>{props.card.value}</div>
            <div>{props.card.suit}</div>
        </div>
    );
}