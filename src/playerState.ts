import CardInfo from "./cardInfo";

export default class PlayerState {
    id: number;
    cards: CardInfo[];
    balance: number;
    bet: number;
    totalHandBet: number;
    nextBet: number;
}