## Overview

React implementation of Sabacc.

### Deck
The Sabacc deck is composed of 76 cards, in the following configuration:

- Four Suits (Sabers, Flasks, Coins, Staves)
- Values 1 - 11
- Ranked Cards
	- Commander (value 12)
	- Mistress (value 13)
	- Master (value 14)
	- Ace (value 15)

- Two copies of eight Face Cards
	- The Star (value -17)
	- The Evil One (value -15)
	- Moderation (value -14)
	- Demise (value -13)
	- Balance (value -11)
	- Endurance (valu1e -8)
	- Queen of Air and Darkness (value -2)
	- Idiot (value 0)

### Rules
Sabacc's main objective is to win Credits. There are two pots: The main pot and the Sabacc pot. Each hand starts with each player placing an ante into both the Main Pot and the Sabacc Pot. Subsequent bets during the hand will be placed only into the Main Pot. Beginning with the player to the dealer's left, each player may elect to either bet or fold. Going clockwise from that player, each person must match the previous bet to stay in the hand. They may also raise the bet to a new amount. If a raise is made, all players must at least match the new bet amount to stay in the hand. When no one wishes to raise any more, the betting is over.

The game can have between 2 and 8 players. Winning hands in Sabacc are hands that total 23 or -23, which are called Pure Sabacc, or a hand made up of an Idiot (value 0) a 2 of any suit and a 3 of any suit (this is a literal 023) called an Idiot's Array. An Idiot's Array beats a Pure Sabacc. If no one has any of these winning hands, the player with the highest hand total below 23 wins.

Once the initial betting is complete, each player is dealt two cards. Players then take turns drawing a card or standing. Afterwards another round of betting takes place. The first through fourth rounds of play and betting are usually considered the pot-building phase, and the game cannot be Called during this time.

After the pot-building phase is over, any player may decide they wish to call the hand. One last round of betting occurs, starting with the Calling player, and then players reveal their cards. Any player with a hand totalling more than 23, less than -23, or exactly 0 at the time the hand is called has Bombed Out. The penalty for Bombing Out is to pay an amount equal to the contents of the Main Pot into the Sabacc Pot. The winning player takes the contents of the Main Pot. If that player won with a Pure Sabacc or an Idiot's Array, the Sabacc Pot is also collected.

In the event that two or more players have equal winning hands, a Sudden Demise is enacted between those players. Each player in the Sudden Demise is dealt one extra card. Their hand totals are then re-summed to include their new card. Whichever player then has the best modified hand wins. If all players involved in the Sudden Demise bomb out they do not have to pay into the Sabacc pot, but none are then eligible to win the Main Pot. The Main Pot in that case goes to the player with the best hand who is not bombed out.

At any time during game-play, up until the point where players reveal their cards, a Sabacc Shift may occur. This random event redistributes the values of the cards in play. It is the rare case when a Sabacc Shift occurs three or more times in a single hand, though once should be expected and twice is not abnormal. The only way to prevent a card from being affected by the Shift is to place it into the Interference Field (due to be implemented in a later version of Sabacc). A player may put a card into the field at any point during play. This Field prevents the Shift from affecting any card placed within it. The trade-off for placing a card in the Field is that it is placed face-up and the value can be seen by all other players.
*  [Sabacc rules](http://sabacc.sourceforge.net/rules) on SourceForge for the background info.

# Contributions
Shout out to:
* [Edoardo Colombo](https://github.com/gcedo/) for the great work on [react-solitaire](https://github.com/gcedo/react-solitaire).



## Quick Start
```
$ npm install
$ npm start
$ open http://localhost:3000
<<<<<<< HEAD
```
=======
```
>>>>>>> upstream/master
