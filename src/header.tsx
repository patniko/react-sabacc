import * as React from 'react';
import GameState from './gameState';
import { isRoundOverPhase } from './utility';
import { GamePhases } from './enums';
import Strings from './strings';

export interface HeaderProps {
    gameState: GameState;
}

export default function Header(props: HeaderProps) {
    const handResult = props.gameState.gamePhase === GamePhases.HandResults ?
        <div><span>{props.gameState.handResultDescription}</span></div> : null;

    const className = "rounded mt-3 mb-3 p-1 " + (isRoundOverPhase(props.gameState.gamePhase) ? "shadow-active" : "shadow-inactive");

    return (
        <div className={className}>
            <div>Hand: {props.gameState.handNum}, round: {props.gameState.roundNum}, total credits: {getTotalCredits(props.gameState)}, hand called: {props.gameState.handCalled ? "yes" : "no"}, phase: {Strings.phaseDescriptions[props.gameState.gamePhase]}</div>
            {handResult}
        </div>
    );
}

function getTotalCredits(state: GameState) {
    return state.mainPot + state.sabaccPot + state.players.reduce((acc, player) => acc + player.balance, 0);
}