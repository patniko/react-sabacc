import * as React from 'react';
import GameState from './gameState';
import { GamePhases } from './enums';

export interface GameStatusProps {
    gameState: GameState;
    showSabaccPot: boolean;
    showMainPot: boolean;
    showCallHand: boolean;
}

export default function GameStatus(props: GameStatusProps) {
    const shiftAlert = props.gameState.showShiftAlert ?
        <p className='shift-alert'><strong>Sabacc Shift!</strong></p> : null;

    const mainPot = !props.showMainPot ? null
            : (
                <p>
                    <p className="poolHeader">Main pot: </p>
                    <p className="poolValue">{props.gameState.mainPot} credits</p>
                </p>
            );
    const sabaccPot = !props.showSabaccPot ? null
            : (
                <p>
                    <p className="poolHeader">Sabacc pot: </p>
                    <p className="poolValue">{props.gameState.sabaccPot} credits</p>
                </p>
            );
    const callHand = !props.showCallHand ? null
            : (
                <p className="shift-alert">
                    <p>{props.gameState.handCalled ? "Hand Called" : ""}</p>
                    {shiftAlert}
                </p>
            );
                    
    return (
        <div className="pool">
            {sabaccPot}
            {mainPot}
            {callHand}
        </div>
    );
}