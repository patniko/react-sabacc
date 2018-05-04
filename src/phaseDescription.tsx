import * as React from 'react';
import GameState from './gameState';
import Strings from './strings';
import { GamePhases } from './enums';

export interface PhaseDescriptionProps {
    gameState: GameState;
}

export default function PhaseDescription(props: PhaseDescriptionProps) {
    const description = props.gameState.gamePhase !== GamePhases.HandResults ?
        <p>{Strings.phaseDescriptions[props.gameState.gamePhase]}</p> : null;

    const handResult = props.gameState.gamePhase === GamePhases.HandResults ?
        <p>{props.gameState.handResultDescription}</p> : null;

    return (
        <div className="textCenter">
            {description}
            {handResult}
        </div>
    );
}