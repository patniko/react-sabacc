export const Suits = {
    SABERS: '⚔️',
    FLASKS: '🍶',
    COINS: '💰',
    STAVES: '🔱'
};

export const Ranks =
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'S', 'E', 'M', 'D', 'B', 'N', 'Q', 'I'];

export const RanksValues = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: -17, // The Star
    17: -15, // The Evil One
    18: -14, // Moderation
    19: -13, // Demise
    20: -11, // Balance
    21: -8,  // Endurance
    22: -2,  // Queen of Air and Darkness
    23: 0    // Idiot 
};

export const Places = {
    FOUNDATION: 'FOUNDATION',
    PILE: 'PILE',
    DECK: 'DECK',

    INTERFERENCE_FIELD: 'INTERFERENCE_FIELD',
    HAND: 'HAND'
};

export const ActionTypes = {
    TURN_CARD: 'TURN_CARD',
    MOVE_CARD: 'MOVE_CARD',
    FOLD_CARDS: 'FOLD_CARDS'
}
