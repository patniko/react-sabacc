import { gamePhases } from './enums';

export default ({
    handResultSecond: "First player folded, second player won this hand",
    handResultFirst: "Second player folded, first player won this hand",
    draw: {
        idiotsArray: "Draw, both players have 'Idiot's Array'",
        positivePureSabacc: "Draw, both players have positive 'Pure Sabacc'",
        negativePureSabacc: "Draw, both players have negative 'Pure Sabacc'",
        bombedOut: "No winners, both players have Bombed Out",
        value: "Draw, both players have equal hand value"
    },
    first: {
        idiotsArray: "First player has won because he has 'Idiot's Array'",
        positivePureSabacc: "First player has won because he has positive 'Pure Sabacc'",
        negativePureSabacc: "First player has won because he has negative 'Pure Sabacc'",
        bombedOut: "Second player has won, first player has Bombed Out",
        value: "First player has won because his hand value is closer to 23"
    },
    second: {
        idiotsArray: "Second player has won because he has 'Idiot's Array'",
        positivePureSabacc: "Second player has won because he has positive 'Pure Sabacc'",
        negativePureSabacc: "Second player has won because he has negative 'Pure Sabacc'",
        bombedOut: "First player has won, second player has Bombed Out",
        value: "Second player has won because his hand value is closer to 23"
    },

    phaseDescriptions: {
        [gamePhases.firstPlayerDraw]: "first player draws cards",
        [gamePhases.secondPlayerDraw]: "second player draws cards",
        [gamePhases.roundOver]: "round over",
        [gamePhases.handResults]: "hand results",
        [gamePhases.firstPlayerBetting]: "first player betting",
        [gamePhases.secondPlayerBetting]: "second palyer betting",
        [gamePhases.firstPlayerMatchingBet]: "first player decides to either match the bet or fold",
        [gamePhases.secondPlayerMatchingBet]: "second player decides to either match the bet or fold",
        [gamePhases.firstPlayerLostGame]: "first player has lost the game because he ran out of credits",
        [gamePhases.secondPlayerLostGame]: "second player has lost the game because he ran out of credits",
    }
})