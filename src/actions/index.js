import { ActionTypes } from '../constants';

export function moveCard(cards, where) {
    return {
        type: ActionTypes.MOVE_CARD,
        payload: { cards, where }
     };
}

export function turnCard() {
    return {
        type: ActionTypes.TURN_CARD
    };
}

export function foldCards() {
    return {
        type: ActionTypes.FOLD_CARDS
    };
}

export function shuffleDeck() {
    return { type: 'SHUFFLE_DECK' }
}

export default {
    turnCard,
    shuffleDeck,
    moveCard,
    foldCards
}
