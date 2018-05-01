import { GamePhases } from './enums';

export default class {
    static handResultSecond = "First player folded, second player won this hand";
    static handResultFirst = "Second player folded, first player won this hand";
    static draw = {
        idiotsArray: "Draw, both players have 'Idiot's Array'",
        positivePureSabacc: "Draw, both players have positive 'Pure Sabacc'",
        negativePureSabacc: "Draw, both players have negative 'Pure Sabacc'",
        bombedOut: "No winners, both players have Bombed Out",
        value: "Draw, both players have equal hand value"
    };
    static first = {
        idiotsArray: "First player has won because he has 'Idiot's Array'",
        positivePureSabacc: "First player has won because he has positive 'Pure Sabacc'",
        negativePureSabacc: "First player has won because he has negative 'Pure Sabacc'",
        bombedOut: "Second player has won, first player has Bombed Out",
        value: "First player has won because his hand value is closer to 23"
    };
    static second = {
        idiotsArray: "Second player has won because he has 'Idiot's Array'",
        positivePureSabacc: "Second player has won because he has positive 'Pure Sabacc'",
        negativePureSabacc: "Second player has won because he has negative 'Pure Sabacc'",
        bombedOut: "First player has won, second player has Bombed Out",
        value: "Second player has won because his hand value is closer to 23"
    };
    static phaseDescriptions = {
        [GamePhases.FirstPlayerDraw]: "first player draws cards",
        [GamePhases.SecondPlayerDraw]: "second player draws cards",
        [GamePhases.RoundOver]: "round over",
        [GamePhases.HandResults]: "hand results",
        [GamePhases.FirstPlayerBetting]: "first player betting",
        [GamePhases.SecondPlayerBetting]: "second palyer betting",
        [GamePhases.FirstPlayerMatchingBet]: "first player decides to either match the bet or fold",
        [GamePhases.SecondPlayerMatchingBet]: "second player decides to either match the bet or fold",
        [GamePhases.FirstPlayerLostGame]: "first player have lost the game because he run out of credits",
        [GamePhases.SecondPlayerLostGame]: "second player have lost the game because he run out of credits",
    };
}