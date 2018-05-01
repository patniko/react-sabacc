import cards from './cards';
import constants from './constants';
import { handResult, gamePhases } from './enums';

const _ = require('lodash');

export function getNewDeck() {
    return [
        cards.sabers1, cards.flasks1, cards.coins1, cards.staves1, cards.sabers2, cards.flasks2, cards.coins2, cards.staves2, cards.sabers3, cards.flasks3,
        cards.coins3, cards.staves3, cards.sabers4, cards.flasks4, cards.coins4, cards.staves4, cards.sabers5, cards.flasks5, cards.coins5, cards.staves5,
        cards.sabers6, cards.flasks6, cards.coins6, cards.staves6, cards.sabers7, cards.flasks7, cards.coins7, cards.staves7, cards.sabers8, cards.flasks8,
        cards.coins8, cards.staves8, cards.sabers9, cards.flasks9, cards.coins9, cards.staves9, cards.sabers10, cards.flasks10, cards.coins10, cards.staves10,
        cards.sabers11, cards.flasks11, cards.coins11, cards.staves11, cards.sabersCom, cards.flasksCom, cards.coinsCom, cards.stavesCom, cards.sabersMis, cards.flasksMis,
        cards.coinsMis, cards.stavesMis, cards.sabersMas, cards.flasksMas, cards.coinsMas, cards.stavesMas, cards.sabersAce, cards.flasksAce, cards.coinsAce, cards.stavesAce,
        cards.idiot, cards.queen, cards.endurance, cards.balance, cards.demise, cards.moderation, cards.evilone, cards.star, cards.idiot, cards.queen,
        cards.endurance, cards.balance, cards.demise, cards.moderation, cards.evilone, cards.star
    ];
}

export function getHandValue(cards) {
    return cards.reduce((acc, card) => acc + card.value, 0);
}

export function isDrawingPhase(gamePhase) {
    return gamePhase === gamePhases.firstPlayerDraw || gamePhase === gamePhases.secondPlayerDraw;
}

export function isBettingPhase(gamePhase) {
    return gamePhase === gamePhases.firstPlayerBetting || gamePhase === gamePhases.secondPlayerBetting;
}

export function isMatchingBetPhase(gamePhase) {
    return gamePhase === gamePhases.firstPlayerMatchingBet || gamePhase === gamePhases.secondPlayerMatchingBet;
}

export function isRoundOverPhase(gamePhase) {
    return gamePhase === gamePhases.roundOver || gamePhase === gamePhases.handResults;
}

export function drawCard(state, playerNum) {
    if (state.deck.length == 0) {
        return;
    }

    const randCardIndex = getRandomInt(0, state.deck.length);
    const card = state.deck[randCardIndex];
    state.players[playerNum].cards.push(card);
    state.deck.splice(randCardIndex, 1); // remove card from deck
}

export function drawCardsForEachPlayer(state) {
    for (let playerNum = 0; playerNum < state.players.length; playerNum++) {
        for (let i = 1; i <= 2; i++) {
            drawCard(state, playerNum);
        }
    }
}

export function shift(state) {
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

export function shuffleCards(cards) {
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

export function shiftHappens(shiftCount) {
    return getRandomInt(0, constants.shiftProbability * (shiftCount + 1)) === 6;
}

export function getHandWinner(state) {
    const firstPlayerHandValue = getHandValue(state.players[0].cards);
    const secondPlayerHandValue = getHandValue(state.players[1].cards);
    const firstHasIdiotsArray = isIdiotsArray(state.players[0].cards);
    const secondHasIdiotsArray = isIdiotsArray(state.players[1].cards);
    const bothHaveIdiotsArray = secondHasIdiotsArray && firstHasIdiotsArray;

    if (bothHaveIdiotsArray) {
        return {
            winner: handResult.draw,
            description: strings.draw.idiotsArray,
            wonSabacc: true
        };
    }

    if (firstHasIdiotsArray) {
        return {
            winner: handResult.firstPlayerWon,
            description: strings.first.idiotsArray,
            wonSabacc: true
        };
    }

    if (secondHasIdiotsArray) {
        return {
            winner: handResult.secondPlayerWon,
            description: strings.second.idiotsArray,
            wonSabacc: true
        };
    }

    const firstHasPositivePureSabacc = isPositivePureSabacc(firstPlayerHandValue);
    const secondHasPositivePureSabacc = isPositivePureSabacc(secondPlayerHandValue);
    const bothHavePositivePureSabacc = firstHasPositivePureSabacc && secondHasPositivePureSabacc;

    if (bothHavePositivePureSabacc) {
        return {
            winner: handResult.draw,
            description: strings.draw.positivePureSabacc,
            wonSabacc: true
        };
    }

    if (firstHasPositivePureSabacc) {
        return {
            winner: handResult.firstPlayerWon,
            description: strings.first.positivePureSabacc,
            wonSabacc: true
        };
    }

    if (secondHasPositivePureSabacc) {
        return {
            winner: handResult.secondPlayerWon,
            description: strings.second.positivePureSabacc,
            wonSabacc: true
        };
    }

    const firstHasNegativePureSabacc = isNegativePureSabacc(firstPlayerHandValue);
    const secondHasNegativePureSabacc = isNegativePureSabacc(secondPlayerHandValue);
    const bothHaveNegativePureSabacc = firstHasNegativePureSabacc && secondHasNegativePureSabacc;

    if (bothHaveNegativePureSabacc) {
        return {
            winner: handResult.draw,
            description: strings.draw.negativePureSabacc,
            wonSabacc: true
        };
    }

    if (firstHasNegativePureSabacc) {
        return {
            winner: handResult.firstPlayerWon,
            description: strings.first.negativePureSabacc,
            wonSabacc: true
        };
    }

    if (secondHasNegativePureSabacc) {
        return {
            winner: handResult.secondPlayerWon,
            description: strings.second.negativePureSabacc,
            wonSabacc: true
        };
    }

    const firstBombedOut = isBombedOut(state.players[0]);
    const secondBombedOut = isBombedOut(state.players[1]);
    const bothBombedOut = firstBombedOut && secondBombedOut;

    if (bothBombedOut) {
        return {
            winner: handResult.bothPlayersLost,
            description: strings.draw.bombedOut
                
        };
    }

    if (firstBombedOut) {
        return {
            winner: handResult.secondPlayerWon,
            description: strings.first.bombedOut
        };
    }

    if (secondBombedOut) {
        return {
            winner: handResult.firstPlayerWon,
            description: strings.second.bombedOut
        };
    }

    if (firstPlayerHandValue === secondPlayerHandValue) {
        return {
            winner: handResult.draw,
            description: strings.draw.value
        };
    } else if (firstPlayerHandValue > secondPlayerHandValue) {
        return {
            winner: handResult.firstPlayerWon,
            description: strings.first.value
        };
    } else {
        return {
            winner: handResult.secondPlayerWon,
            description: strings.second.value
        };
    }
}

/** create deep object clone */
export function clone(obj) {
    return _.cloneDeep(obj);
}

export function isBombedOut(player) {
    const handValue = getHandValue(player.cards);
    return handValue == 0 || handValue > 23 || handValue < -23;
}

export function getActivePlayerId(gamePhase) {
    switch (gamePhase) {
        case gamePhases.firstPlayerDraw:
        case gamePhases.firstPlayerBetting:
        case gamePhases.firstPlayerMatchingBet:
            return 0;
        case gamePhases.secondPlayerDraw:
        case gamePhases.secondPlayerBetting:
        case gamePhases.secondPlayerMatchingBet:
            return 1;
        case gamePhases.roundOver:
        case gamePhases.handResults:
        case gamePhases.firstPlayerLostGame:
        case gamePhases.secondPlayerLostGame:
        default:
            return -1;
    }
}

function isPositivePureSabacc(handValue) {
    return handValue === 23;
}

function isNegativePureSabacc(handValue) {
    return handValue === -23;
}

function isIdiotsArray(cards) {
    return cards.length === 3  // 3 cards
        && cards.some(card => card.value === 0) // The Idiot
        && cards.some(card => card.value === 2) // any 2
        && cards.some(card => card.value === 3); // any 3
}

/** The maximum is exclusive and the minimum is inclusive */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}