import React from 'react';
import { isRoundOverPhase } from './utility';
import { gamePhases } from './enums';
import strings from './strings';

export default function Header(props) {
    const handResult = props.gameState.gamePhase === gamePhases.handResults ?
        <div><span>{props.gameState.handResultDescription}</span></div> : null;

    const className = "rounded mt-3 mb-3 p-1 " + (isRoundOverPhase(props.gameState.gamePhase) ? "shadow-active" : "shadow-inactive");
    
    return (
        <div className={className}>
            <div>Hand: {props.gameState.handNum}, round: {props.gameState.roundNum}, total credits: {getTotalCredits(props.gameState)}, hand called: {props.gameState.handCalled ? "yes" : "no"}, phase: {strings.phaseDescriptions[props.gameState.gamePhase]}</div>
            {handResult}
        </div>
    );
}

function getTotalCredits(state) {
    return state.mainPot + state.sabaccPot + state.players.reduce((acc, player) => acc + player.balance, 0);
}