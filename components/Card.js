
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Button, View } from 'react-native';

const Card = (props) => {
      const { onButtonDown, onButtonUp } = props;
      return(
          <View style={styles.card}>
              <View>
                  <Button
                      title="UP"
                      onPress={onButtonUp}
                  />
    
                  <Button
                      title="DOWN"
                      onPress={onButtonDown}
                  />
              </View>
          </View>
      )
}

Card.propTypes = {
    onButtonUp: PropTypes.func.isRequired,
    onButtonDown: PropTypes.func.isRardequired,
}

export default Card;

const styles = new StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        width: 314,
        height: 226,
        elevation: 2
    }
});