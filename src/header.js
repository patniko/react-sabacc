import React from 'react';
import { gamePhases, isRoundOverPhase } from './utility'

export default function Header(props) {
    let handResult = props.gameState.gamePhase === gamePhases.handResults ?
        <div><span>{props.gameState.handResultDescription}</span></div> : null;

    let className = "rounded mt-3 mb-3 p-1 " + (isRoundOverPhase(props.gameState.gamePhase) ? "shadow-active" : "shadow-inactive");

    return (
        <div className={className}>
            <div>Hand: {props.gameState.handNum}, round: {props.gameState.roundNum}, total credits: {getTotalCredits(props.gameState)}, hand called: {props.gameState.handCalled ? "yes" : "no"}, phase: {phaseDescriptions[props.gameState.gamePhase]}</div>
            {handResult}
        </div>
    );
}

var phaseDescriptions = {
    [gamePhases.firstPlayerDraw]: "first player draws cards",
    [gamePhases.secondPlayerDraw]: "second player draws cards",
    [gamePhases.roundOver]: "round over",
    [gamePhases.handResults]: "hand results",
    [gamePhases.firstPlayerBetting]: "first player betting",
    [gamePhases.secondPlayerBetting]: "second palyer betting",
    [gamePhases.firstPlayerMatchingBet]: "first player decides to either match the bet or fold",
    [gamePhases.secondPlayerMatchingBet]: "second player decides to either match the bet or fold",
    [gamePhases.firstPlayerLostGame]: "first player have lost the game because he run out of credits",
    [gamePhases.secondPlayerLostGame]: "second player have lost the game because he run out of credits",
};

function getTotalCredits(state) {
    return state.mainPot + state.sabaccPot + state.players.reduce((acc, player) => acc + player.balance, 0);
}