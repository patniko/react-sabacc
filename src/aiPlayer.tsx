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
        <span>, total value: {getHandValue(props.player.cards)}</span> : null;

    return (
        <div className="rounded mb-3 p-1 shadow-inactive">
            <p>Balance: {props.player.balance} credits, current bet: {props.player.bet} credits{handValue}</p>
            {props.player.cards.map((card, index) => <Card key={index} card={props.gamePhase === GamePhases.HandResults ? card : cards.cardback} />)}
        </div>
    );
}