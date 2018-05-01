// if you add new value then update phaseDescriptions, getActivePlayerId
const gamePhases = {
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

const handResult = {
    bothPlayersLost: -1,
    firstPlayerWon: 0,
    secondPlayerWon: 1,
    draw: 2
};

exports.handResult = handResult;
exports.gamePhases = gamePhases; 