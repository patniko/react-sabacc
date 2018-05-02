import Cards from './cards';
import constants from './constants';
import CardInfo from './cardInfo';
import GameState from './gameState';
import PlayerState from './playerState';
import Strings from './strings';
import { HandResult, GamePhases } from './enums';
let _ = require('lodash');

export function getNewDeck(): CardInfo[] {
    return [
        Cards.sabers1, Cards.flasks1, Cards.coins1, Cards.staves1, Cards.sabers2, Cards.flasks2, Cards.coins2, Cards.staves2, Cards.sabers3, Cards.flasks3,
        Cards.coins3, Cards.staves3, Cards.sabers4, Cards.flasks4, Cards.coins4, Cards.staves4, Cards.sabers5, Cards.flasks5, Cards.coins5, Cards.staves5,
        Cards.sabers6, Cards.flasks6, Cards.coins6, Cards.staves6, Cards.sabers7, Cards.flasks7, Cards.coins7, Cards.staves7, Cards.sabers8, Cards.flasks8,
        Cards.coins8, Cards.staves8, Cards.sabers9, Cards.flasks9, Cards.coins9, Cards.staves9, Cards.sabers10, Cards.flasks10, Cards.coins10, Cards.staves10,
        Cards.sabers11, Cards.flasks11, Cards.coins11, Cards.staves11, Cards.sabersCom, Cards.flasksCom, Cards.coinsCom, Cards.stavesCom, Cards.sabersMis, Cards.flasksMis,
        Cards.coinsMis, Cards.stavesMis, Cards.sabersMas, Cards.flasksMas, Cards.coinsMas, Cards.stavesMas, Cards.sabersAce, Cards.flasksAce, Cards.coinsAce, Cards.stavesAce,
        Cards.idiot, Cards.queen, Cards.endurance, Cards.balance, Cards.demise, Cards.moderation, Cards.evilone, Cards.star, Cards.idiot, Cards.queen,
        Cards.endurance, Cards.balance, Cards.demise, Cards.moderation, Cards.evilone, Cards.star
    ];
}

export function getHandValue(cards: CardInfo[]) {
    return cards.reduce((acc, card) => acc + card.value, 0);
}

export function isDrawingPhase(gamePhase: GamePhases) {
    return gamePhase === GamePhases.FirstPlayerDraw || gamePhase === GamePhases.SecondPlayerDraw;
}

export function isBettingPhase(gamePhase: GamePhases) {
    return gamePhase === GamePhases.FirstPlayerBetting || gamePhase === GamePhases.SecondPlayerBetting;
}

export function isMatchingBetPhase(gamePhase: GamePhases) {
    return gamePhase === GamePhases.FirstPlayerMatchingBet || gamePhase === GamePhases.SecondPlayerMatchingBet;
}

export function isRoundOverPhase(gamePhase: GamePhases) {
    return gamePhase === GamePhases.RoundOver || gamePhase === GamePhases.HandResults;
}

export function drawCard(state: GameState, playerNum: number) {
    if (state.deck.length == 0) {
        return;
    }

    const randCardIndex = getRandomInt(0, state.deck.length);
    const card = state.deck[randCardIndex];
    state.players[playerNum].cards.push(card);
    state.deck.splice(randCardIndex, 1); // remove card from deck
}

export function drawCardsForEachPlayer(state: GameState) {
    for (let playerNum = 0; playerNum < state.players.length; playerNum++) {
        for (let i = 1; i <= 2; i++) {
            drawCard(state, playerNum);
        }
    }
}

export function shift(state: GameState) {
    if (shiftHappens(state.shiftCount)) {
        state.shiftCount++;
        const cardsInPlay = [];
        for (let player of state.players) {
            cardsInPlay.push(...player.cards);
        }
        shuffleCards(cardsInPlay);
        for (let player of state.players) {
            player.cards = cardsInPlay.splice(0, player.cards.length);
        }
        return true;
    }
    return false;
}

export function shuffleCards(cards: CardInfo[]) {
    const shufflesCount = cards.length / 2;
    for (let i = 0; i < shufflesCount; i++) {
        const firstCardIndex = getRandomInt(0, cards.length);
        const secondCardIndex = getRandomInt(0, cards.length);
        if (firstCardIndex !== secondCardIndex) {
            const temp = cards[firstCardIndex];
            cards[firstCardIndex] = cards[secondCardIndex];
            cards[secondCardIndex] = temp;
        }
    }
}

export function shiftHappens(shiftCount: number) {
    return getRandomInt(0, constants.shiftProbability * (shiftCount + 1)) === 6;
}

export function getHandWinner(state: GameState) {
    const firstPlayerHandValue = getHandValue(state.players[0].cards);
    const secondPlayerHandValue = getHandValue(state.players[1].cards);
    const firstHasIdiotsArray = isIdiotsArray(state.players[0].cards);
    const secondHasIdiotsArray = isIdiotsArray(state.players[1].cards);
    const bothHaveIdiotsArray = secondHasIdiotsArray && firstHasIdiotsArray;

    if (bothHaveIdiotsArray) {
        return {
            winner: HandResult.Draw,
            description: Strings.draw.idiotsArray,
            wonSabacc: true
        };
    }

    if (firstHasIdiotsArray) {
        return {
            winner: HandResult.FirstPlayerWon,
            description: Strings.first.idiotsArray,
            wonSabacc: true
        };
    }

    if (secondHasIdiotsArray) {
        return {
            winner: HandResult.SecondPlayerWon,
            description: Strings.second.idiotsArray,
            wonSabacc: true
        };
    }

    const firstHasPositivePureSabacc = isPositivePureSabacc(firstPlayerHandValue);
    const secondHasPositivePureSabacc = isPositivePureSabacc(secondPlayerHandValue);
    const bothHavePositivePureSabacc = firstHasPositivePureSabacc && secondHasPositivePureSabacc;

    if (bothHavePositivePureSabacc) {
        return {
            winner: HandResult.Draw,
            description: Strings.draw.positivePureSabacc,
            wonSabacc: true
        };
    }

    if (firstHasPositivePureSabacc) {
        return {
            winner: HandResult.FirstPlayerWon,
            description: Strings.first.positivePureSabacc,
            wonSabacc: true
        };
    }

    if (secondHasPositivePureSabacc) {
        return {
            winner: HandResult.SecondPlayerWon,
            description: Strings.second.positivePureSabacc,
            wonSabacc: true
        };
    }

    const firstHasNegativePureSabacc = isNegativePureSabacc(firstPlayerHandValue);
    const secondHasNegativePureSabacc = isNegativePureSabacc(secondPlayerHandValue);
    const bothHaveNegativePureSabacc = firstHasNegativePureSabacc && secondHasNegativePureSabacc;

    if (bothHaveNegativePureSabacc) {
        return {
            winner: HandResult.Draw,
            description: Strings.draw.negativePureSabacc,
            wonSabacc: true
        };
    }

    if (firstHasNegativePureSabacc) {
        return {
            winner: HandResult.FirstPlayerWon,
            description: Strings.first.negativePureSabacc,
            wonSabacc: true
        };
    }

    if (secondHasNegativePureSabacc) {
        return {
            winner: HandResult.SecondPlayerWon,
            description: Strings.second.negativePureSabacc,
            wonSabacc: true
        };
    }

    const firstBombedOut = isBombedOut(state.players[0]);
    const secondBombedOut = isBombedOut(state.players[1]);
    const bothBombedOut = firstBombedOut && secondBombedOut;

    if (bothBombedOut) {
        return {
            winner: HandResult.BothPlayersLost,
            description: Strings.draw.bombedOut

        };
    }

    if (firstBombedOut) {
        return {
            winner: HandResult.SecondPlayerWon,
            description: Strings.first.bombedOut
        };
    }

    if (secondBombedOut) {
        return {
            winner: HandResult.FirstPlayerWon,
            description: Strings.second.bombedOut
        };
    }

    if (firstPlayerHandValue === secondPlayerHandValue) {
        return {
            winner: HandResult.Draw,
            description: Strings.draw.value
        };
    } else if (firstPlayerHandValue > secondPlayerHandValue) {
        return {
            winner: HandResult.FirstPlayerWon,
            description: Strings.first.value
        };
    } else {
        return {
            winner: HandResult.SecondPlayerWon,
            description: Strings.second.value
        };
    }
}

/** create deep object clone */
export function clone(obj: object) {
    return _.cloneDeep(obj);
}

export function isBombedOut(player: PlayerState) {
    const handValue = getHandValue(player.cards);
    return handValue == 0 || handValue > 23 || handValue < -23;
}

export function getActivePlayerId(gamePhase: GamePhases) {
    switch (gamePhase) {
        case GamePhases.FirstPlayerDraw:
        case GamePhases.FirstPlayerBetting:
        case GamePhases.FirstPlayerMatchingBet:
            return 0;
        case GamePhases.SecondPlayerDraw:
        case GamePhases.SecondPlayerBetting:
        case GamePhases.SecondPlayerMatchingBet:
            return 1;
        case GamePhases.RoundOver:
        case GamePhases.HandResults:
        case GamePhases.FirstPlayerLostGame:
        case GamePhases.SecondPlayerLostGame:
        default:
            return -1;
    }
}

function isPositivePureSabacc(handValue: number) {
    return handValue === 23;
}

function isNegativePureSabacc(handValue: number) {
    return handValue === -23;
}

function isIdiotsArray(cards: CardInfo[]) {
    return cards.length === 3  // 3 cards
        && cards.some(card => card.value === 0) // The Idiot
        && cards.some(card => card.value === 2) // any 2
        && cards.some(card => card.value === 3); // any 3
}

/** The maximum is exclusive and the minimum is inclusive */
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}