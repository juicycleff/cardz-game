import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from './components/Card';

export default class App extends React.Component {

  hasEntered = false;

  constructor(props) {
    super(props);

    this.state = {
      deckId: '',
      currentCard: {},
      prevCard: {},
      gameStarted: false,
      win: false,
      loading: false,
      currentBet: 0 // 0 = lower and 1 = higher
    }

    this.onButtonUp = this.onButtonUp.bind(this);
    this.onButtonDown = this.onButtonDown.bind(this);
  }

  componentDidMount() {
    this.hasEntered = true;
    this.drawNewCard();
  }

  UNSAFE_componentWillMount() {
    this.hasEntered = false;
  }

  async drawNewCard() {
    await fetch('https://deckofcardsapi.com/api/deck/new')
      .then((response) => response.json())
      .then(responseJson => {
        const result = responseJson;
        this.setState({ deckId: result.deck_id });
        this.drawCards(result.deck_id, 1);
      });
  }

  async drawCards(deckId, count) {
    await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
      .then((response) => response.json())
      .then(responseJson => {
        const cards = responseJson;
        this.setState({ currentCard: cards[0] });
      });
  }

  async betGame(deckId, count) {
    const { currentCard, prevCard, currentBet, gameStarted } = this.state;
    this.setState({loading: true});
  
    await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const cards = responseJson.cards;
        const newCard = cards[0];

        this.setState({
          prevCard: currentCard,
          currentCard: newCard,
          loading: false
        });

        if(!gameStarted) {
          this.setState({ gameStarted: true });
        }
      });

    if(currentBet === 0) {
      if(parseInt(currentCard.value) < parseInt(prevCard.value)) this.setState({ win: true });
      else this.setState({ win: false });
    } else if(currentBet === 1) {
      if(currentCard.value > prevCard.value) this.setState({ win: true });
      else this.setState({ win: false });
    }
  }

  onButtonUp() {
    const { deckId } = this.state;

    this.setState({ currentBet: 1 });
    this.betGame(deckId, 1);
  }

  onButtonDown() {
    const { deckId, currentCard } = this.state;

    this.setState({ currentBet: 0 });
    this.betGame(deckId, 1);
  }

  renderWinOrLose() {
    const { win, gameStarted, loading } = this.state;

    if(gameStarted) {
      return(
        <Text>{loading ? 'getting card...' : (win ? 'You Win' : 'You lose')}</Text>
      )
    }

    return null;
  }
  render() {

    return (
      <View style={styles.container}>
        <Text style={{paddingTop: 100}}>Game of Cardsss</Text>
        {this.renderWinOrLose()}

        <View style={styles.flexible}>
          <Card
            onButtonDown={this.onButtonDown}
            onButtonUp={this.onButtonUp}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexible: {
    flex: 1,
    justifyContent: 'center',
  }
});