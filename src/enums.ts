// if you add new value then update phaseDescriptions, getActivePlayerId
export enum GamePhases {
    FirstPlayerDraw,
    SecondPlayerDraw,
    RoundOver,
    HandResults,
    FirstPlayerBetting,
    SecondPlayerBetting,
    FirstPlayerMatchingBet,
    SecondPlayerMatchingBet,
    FirstPlayerLostGame,
    SecondPlayerLostGame
}

export enum HandResult {
    BothPlayersLost = -1,
    FirstPlayerWon = 0,
    SecondPlayerWon = 1,
    Draw = 2
}