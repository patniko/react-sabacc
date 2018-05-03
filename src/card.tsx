import * as React from 'react';
import CardInfo from './cardInfo';

export interface CardProps {
    card: CardInfo;
    onClick?: () => void;
}

export default function Card(props: CardProps) {
    return (
        <div className="sabaccCard">
            <img src={props.card.img} onClick={props.onClick} />
        </div>
    );
}