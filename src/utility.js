import cards from './cards'
import constants from './constants'
let _ = require('lodash');

// if you add new value then update phaseDescriptions, getActivePlayerId
var gamePhases = {
    firstPlayerDraw: 1,
    secondPlayerDraw: 2,
    roundOver: 3,
    handResults: 4,
    firstPlayerBetting: 5,
    secondPlayerBetting: 6,
    firstPlayerMatchingBet: 7,
    secondPlayerMatchingBet: 8,
    firstPlayerLostGame: 9,
    secondPlayerLostGame: 10
};

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

var handResult = {
    bothPlayersLost: -1,
    firstPlayerWon: 0,
    secondPlayerWon: 1,
    draw: 2
};

exports.handResult = handResult;
exports.gamePhases = gamePhases;
exports.phaseDescriptions = phaseDescriptions;

export function getInitialState() {
    let state = {
        gamePhase: gamePhases.firstPlayerBetting,
        mainPot: constants.mainPotAnteAmount * constants.playersCount,
        sabaccPot: constants.sabaccPotAnteAmount * constants.playersCount,
        handNum: 1,
        roundNum: 1,
        handResultDescription: "",
        handCalled: false,
        players: [createPlayer(0), createPlayer(1)],
        deck: getNewDeck()
    };

    drawCardsForEachPlayer(state);

    return state;
}

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

export function drawCard(state, playerNum) {
    if (state.deck.length == 0)
        return;

    let randCardIndex = getRandomInt(0, state.deck.length);
    let card = state.deck[randCardIndex];
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

export function getHandWinner(state) {
    let firstPlayerHandValue = getHandValue(state.players[0].cards);
    let secondPlayerHandValue = getHandValue(state.players[1].cards);

    if (isIdiotsArray(state.players[0].cards))
        if (isIdiotsArray(state.players[1].cards)) return { winner: handResult.draw, description: "Draw, both players have 'Idiot's Array'", wonSabacc: true };
        else return { winner: handResult.firstPlayerWon, description: "First player have won because he have 'Idiot's Array'", wonSabacc: true };
    if (isIdiotsArray(state.players[1].cards))
        return { winner: handResult.secondPlayerWon, description: "Second player have won because he have 'Idiot's Array'", wonSabacc: true };

    if (isPositivePureSabacc(firstPlayerHandValue))
        if (isPositivePureSabacc(secondPlayerHandValue)) return { winner: handResult.draw, description: "Draw, both players have positive 'Pure Sabacc'", wonSabacc: true };
        else return { winner: handResult.firstPlayerWon, description: "First player have won because he have positive 'Pure Sabacc'", wonSabacc: true };
    if (isPositivePureSabacc(secondPlayerHandValue))
        return { winner: handResult.secondPlayerWon, description: "Second player have won because he have positive 'Pure Sabacc'", wonSabacc: true };

    if (isNegativePureSabacc(firstPlayerHandValue))
        if (isNegativePureSabacc(secondPlayerHandValue)) return { winner: handResult.draw, description: "Draw, both players have negative 'Pure Sabacc'", wonSabacc: true };
        else return { winner: handResult.firstPlayerWon, description: "First player have won because he have negative 'Pure Sabacc'", wonSabacc: true };
    if (isNegativePureSabacc(secondPlayerHandValue))
        return { winner: handResult.secondPlayerWon, description: "Second player have won because he have negative 'Pure Sabacc'", wonSabacc: true };

    if (isBombedOut(state.players[0]))
        if (isBombedOut(state.players[1])) return { winner: handResult.bothPlayersLost, description: "No winners, both players have Bombed Out" };
        else return { winner: handResult.secondPlayerWon, description: "Second player have won, first player have Bombed Out" }
    if (isBombedOut(state.players[1]))
        return { winner: handResult.firstPlayerWon, description: "First player have won, second player have Bombed Out" };

    if (firstPlayerHandValue === secondPlayerHandValue) return { winner: handResult.draw, description: "Draw, both players have equal hand value" };
    else if (firstPlayerHandValue > secondPlayerHandValue) return { winner: handResult.firstPlayerWon, description: "First player have won because his hand value closer to 23" };
    else return { winner: handResult.secondPlayerWon, description: "Second player have won because his hand value closer to 23" };
}

/** create deep object clone */
export function clone(obj) {
    return _.cloneDeep(obj);
}

export function isBombedOut(player) {
    let handValue = getHandValue(player.cards);
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

function createPlayer(id) {
    return { id: id, cards: [], balance: constants.initialPlayerBalance - constants.mainPotAnteAmount - constants.sabaccPotAnteAmount, bet: 0, nextBet: constants.defaultBetAmount };
}

/** The maximum is exclusive and the minimum is inclusive */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}