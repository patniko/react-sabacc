import React from 'react';
import SmartDeck from './SmartDeck.jsx';
import SmartPile from  './SmartPile.jsx';
import SmartFoundation from './SmartFoundation.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import range from 'lodash/range';
import { connect } from 'react-redux';
import ActionCreators from '../../actions';
import { Colors, Dimensions } from '../../constants';

@connect((state) => { return { game: state.game.toJS(), score: state.score } })
@DragDropContext(HTML5Backend)
class Game extends React.Component {

    turnCard = () => {
        const { dispatch } = this.props;
        dispatch(ActionCreators.turnCard());
    }

    moveCards = (cards, where) => {
        const { dispatch } = this.props;
        dispatch(ActionCreators.moveCard(cards, where));
    }

    render() {
        const { game, score } = this.props;
        const { moveCards, turnCard } = this;
        console.log(score);
        return (
            <div style={{
                width: Dimensions.Game.width,
                height: Dimensions.Game.height,
                backgroundColor: Colors.Game.backgroundColor,
                padding: 10
            }}>
                





                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <SmartDeck deck={game.DECK} turnCard={turnCard} />
                    <div style={{
                        width: 540,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <SmartFoundation
                            suit="SABERS"
                            cards={game.FOUNDATION.SABERS}
                            moveCards={moveCards}
                        />
                        <SmartFoundation
                            suit="FLASKS"
                            cards={game.FOUNDATION.FLASKS}
                            moveCards={moveCards}
                        />
                        <SmartFoundation
                            suit="COINS"
                            cards={game.FOUNDATION.COINS}
                            moveCards={moveCards}
                        />
                        <SmartFoundation
                            suit="STAVES"
                            cards={game.FOUNDATION.STAVES}
                            moveCards={moveCards}
                        />
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 40
                }}>
                {
                    range(0, 6).map(index =>
                        <SmartPile
                            cards={game.PILE[index]}
                            index={index}
                            key={index}
                            moveCards={moveCards}
                        />
                    )
                }
                </div>
            </div>
        );
    }
}

export default Game;
