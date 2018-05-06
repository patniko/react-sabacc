import * as React from 'react';
import Card from './card';
import PlayerState from './playerState';
import cards from './cards';
import { getHandValue } from './utility';
import { GamePhases } from './enums';

export interface AIPlayerProps {
    gamePhase: GamePhases;
    player: PlayerState;
}

export default function AIPlayer(props: AIPlayerProps) {
    const handValue = props.gamePhase === GamePhases.HandResults ?
        <span className="inlineBlock">Total value: {getHandValue(props.player.cards)}</span> : null;

    return (
        <div className="mb-3 p-1 player">
            <p>
                <span className="inlineBlock">Balance: {props.player.balance} credits</span>
                <span className="inlineBlock">Current bet: {props.player.bet} credits</span>
                {handValue}
            </p>
            <div className="flexLeft">
                {props.player.cards.map((card, index) => <Card key={index} upturned={props.gamePhase === GamePhases.HandResults} card={card} />)}
            </div>
        </div>
    );
}