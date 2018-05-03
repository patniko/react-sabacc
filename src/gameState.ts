import CardInfo from "./cardInfo";
import { GamePhases } from './enums';
import PlayerState from "./playerState";

export default class GameState {
    gamePhase: GamePhases;
    sabaccPot: number;
    mainPot: number;
    handNum: number;
    roundNum: number;
    handResultDescription: string;
    handCalled: boolean;
    shiftCount: number;
    showShiftAlert: boolean;
    deck: CardInfo[];
    players: PlayerState[];
}