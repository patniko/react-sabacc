import * as React from 'react';
import CardInfo from './cardInfo';
import ValueAndSuit from './valueAndSuit';

export interface CardProps {
    card: CardInfo;
    upturned: boolean;
    onClick?: () => void;
}

export default function Card(props: CardProps) {
    return (
        <div className="sabaccCard" onClick={props.onClick} >
            {props.upturned ?
                <div>
                    <ValueAndSuit card={props.card} />
                    <ValueAndSuit card={props.card} rotated />
                    <div className="cardImage center">{props.card.suit}</div>
                </div> :
                <div className="cardback center">⚛</div>
            }
        </div>
    );
}