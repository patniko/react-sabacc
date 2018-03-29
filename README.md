
# Overview

React implementation of Sabacc.

# Rules
* All players start with 1000 coins.

The Sabacc deck is composed of 76 cards, in the following configuration:

Four Suits (Sabers, Flasks, Coins, Staves)
- Values 1 - 11

Ranked Cards
- Commander (value 12)
- Mistress (value 13)
- Master (value 14)
- Ace (value 15)

Two copies of eight Face Cards
- The Star (value -17)
- The Evil One (value -15)
- Moderation (value -14)
- Demise (value -13)
- Balance (value -11)
- Endurance (valu1e -8)
- Queen of Air and Darkness (value -2)
- Idiot (value 0)

1. Every game uses one deck containing 76 cards.
  - 4 suits, each containing numbered cards 1 - 15.
  - 2 copies of 8 special cards.
2. The games consists of several sequential rounds, and ends when a player wins.
3. There are two pots - the sabacc pot is utilized for game winnings, while the special pot can only be won with a trump score.
4. To achieve a trump score you must have a pure sabacc of either +23 or -23

# Round
2. At the start of a round each player is dealt 2 to 5 cards depending on the settings.
3. Starting to the left of the dealers, players may bet and continue to call.

## Winning the game
The sabacc pot is another pot to which players must ante each hand. This special pot can be won only by winning a hand with one of the three trump scores: a pure sabacc of either +23 or −23 (with the former trumping the latter) or an Idiot's Array. The Array is a special hand containing a card called The Idiot, worth zero, a Two of any suit, and a Three of the same suit. When laid out on the table, an Idiot's Array is read, literally, as 023, and is considered the highest hand in the game, trumping even a pure sabacc of 23. A win with any of those three special hands will give that player both the hand pot and the sabacc pot, and is typically seen as the end of gameplay for a single game.

The game of sabacc used a deck of seventy-six cards featuring sixty numbered cards divided into four suits, and two copies of eight special cards. Each player is dealt two cards (sometimes five, depending on the set of rules in play at the table) which make up their hand. There are four phases within each hand: Betting, Calling, Shifting and Drawing.

Betting phase: Beginning with the player to the left of the dealer, the player has the option to place a bet.

A typical game of sabacc is composed of several sequential rounds, and officially ends when a player wins with one of three special winning hands. At the beginning of each round, each player contributes an ante to the hand pot, which goes to the person with the winning hand at the conclusion of that hand. The winner in standard sabacc is the player who holds the hand with an absolute value closest to 23 (with both +23 and −23 being possible); this player wins the hand pot. Since −21 is closer to −23 than 20 is to 23, −21 would trump positive 20; however, in a situation where both −21 and 21 are in play at the same time, the positive 21 would triumph. Players with a hand above 23 or below −23 are considered to have Bombed Out, thus losing the hand, and in some cases, being forced to pay into the sabacc pot.

The sabacc pot is another pot to which players must ante each hand. This special pot can be won only by winning a hand with one of the three trump scores: a pure sabacc of either +23 or −23 (with the former trumping the latter) or an Idiot's Array. The Array is a special hand containing a card called The Idiot, worth zero, a Two of any suit, and a Three of the same suit. When laid out on the table, an Idiot's Array is read, literally, as 023, and is considered the highest hand in the game, trumping even a pure sabacc of 23. A win with any of those three special hands will give that player both the hand pot and the sabacc pot, and is typically seen as the end of gameplay for a single game.

Calling phase: A player has the option to call the hand during another player's calling phase but never his own.

Shifting phase: The cards themselves are small, electronic devices with a display panel covering the surface of one side; this panel is capable of shifting the displayed suit and value of each card when told to do so by the computer running the game, or when a player has the option to manually shuffle the card's value. In this fashion, a player can receive new cards of any possible suit or rank without actually having to take new cards from the deck itself.

Drawing phase: A player may also draw or discard individual cards from his hand. During the Drawing phase, a player may exchange a card in his hand for one in the deck. If the player decides to simply discard a card during this phase, that individual card is removed from play and is not subject to shifting.[2]


# Contributions

Shout out to:
* [gcedo](https://github.com/gcedo/) for the great work on [react-solitaire](https://github.com/gcedo/react-solitaire).
* [Sabacc](http://sabacc.sourceforge.net/rules) on SourceForge for the background info on the rules and card images.


## Quick Start
```
$ npm install
$ npm start
$ open http://localhost:3000
```
