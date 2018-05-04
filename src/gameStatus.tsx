import * as React from 'react';
import GameState from './gameState';
import { GamePhases } from './enums';

export interface GameStatusProps {
    gameState: GameState;
}

export default function GameStatus(props: GameStatusProps) {
    const shiftAlert = props.gameState.showShiftAlert ?
        <p className='shift-alert'><strong>Sabacc Shift!</strong></p> : null;

    return (
        <div className="p-1">
            <p>Main pot: {props.gameState.mainPot} credits</p>
            <p>Sabacc pot: {props.gameState.sabaccPot} credits</p>
            <p>Hand called: {props.gameState.handCalled ? "Yes" : "No"}</p>
            {shiftAlert}
        </div>
    );
}