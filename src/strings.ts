import { GamePhases } from './enums';

export default class {
    static draw = {
        name: "Draw",
        idiotsArray: "Draw, both players have 'Idiot's Array'",
        positivePureSabacc: "Draw, both players have positive 'Pure Sabacc'",
        negativePureSabacc: "Draw, both players have negative 'Pure Sabacc'",
        bombedOut: "No winners, both players have Bombed Out",
        value: "Draw, both players have equal hand value"
    };
    static first = {
        name: 'Human',
        idiotsArray: "You have won because you have 'Idiot's Array'",
        positivePureSabacc: "You have won because you have positive 'Pure Sabacc'",
        negativePureSabacc: "You have won because you have negative 'Pure Sabacc'",
        bombedOut: "AI player have won, you have Bombed Out",
        value: "You have won because your hand value is closer to 23",
        fold: "You folded, AI player have won this hand"
    };
    static second = {
        name: 'AI',
        idiotsArray: "AI player have won because he has 'Idiot's Array'",
        positivePureSabacc: "AI player have won because he has positive 'Pure Sabacc'",
        negativePureSabacc: "AI player have won because he has negative 'Pure Sabacc'",
        bombedOut: "You have won, second player have Bombed Out",
        value: "AI player have won because his hand value is closer to 23",
        fold: "AI player folded, you have won this hand"
    };
    static phaseDescriptions = {
        [GamePhases.FirstPlayerDraw]: "Draw a card",
        [GamePhases.SecondPlayerDraw]: "second player draws cards",
        [GamePhases.RoundOver]: "round over",
        [GamePhases.HandResults]: "hand results",
        [GamePhases.FirstPlayerBetting]: "It’s your bet",
        [GamePhases.SecondPlayerBetting]: "second palyer betting",
        [GamePhases.FirstPlayerMatchingBet]: "Match the bet",
        [GamePhases.SecondPlayerMatchingBet]: "second player decides to either match the bet or fold",
        [GamePhases.FirstPlayerLostGame]: "first player have lost the game because he run out of credits",
        [GamePhases.SecondPlayerLostGame]: "second player have lost the game because he run out of credits",
    };
}