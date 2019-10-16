import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import * as Colors from './../../utils/colors'
import {Image} from "react-native-elements";
import {removeChosePill} from "../../actions/pills";
import {connect} from 'react-redux'

class PillLabel extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }


  handleRemoveChosenPill = (pillID) => {
    console.log('press remove Pill');
    console.log(pillID);
    console.log(this.props);

    this.props.dispatch(removeChosePill(pillID));
  };

  render() {


    const {pillTitle, pillID} = this.props;

    return (
      <View style={{position: 'relative', backgroundColor: Colors.PROFILE_HEAD_BG, borderRadius: 8, height: 31, paddingLeft: 10, paddingRight: 10, marginRight: 15, marginBottom: 8, justifyContent: 'center'}}>
        <TouchableOpacity
          style={{position: 'absolute', top: -8, right: -8, zIndex: 100}}
          onPress={() => {
            this.handleRemoveChosenPill(pillID)
          }}
        >
          <Image
            style={{width: 15, height: 15}}
            source={require('../../assets/general/close_round.png')}
          />
        </TouchableOpacity>

        <Text style={{color: Colors.WHITE, fontSize: 8, fontWeight: 'bold', alignItems: 'center'}}>{pillTitle.toUpperCase()}</Text>
      </View>
    )
  }


}

export default connect()(PillLabel)

const styles = StyleSheet.create({});


PillLabel.propTypes = {
  pillTitle: PropTypes.string.isRequired,
  pillID: PropTypes.string.isRequired,
};

PillLabel.defaultProps = {
  pillTitle: 'Препарат',
};
