import React, {Component} from 'react';
import {View, Text, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import {saveChosenLabel} from '../../../actions/labels'
import * as Colors from '../../../utils/colors'



class HeaderCancelBtn extends Component{

  handlePressBtn = () => {
    this.props.dispatch(saveChosenLabel(''));
    this.props.navigation.goBack();
  };

  render() {

    return(
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={this.handlePressBtn}
        style={{paddingLeft: 8}}
      >
        <Text
          style={{fontSize: 17, color: Colors.DARK_GREEN}}
        >Отмена</Text>
      </TouchableHighlight>
    )

  }
}

function mapStateToProps(state){
  const labels = state.labels;
  return {
    activeLabel: labels.chosenLabelID
  }
}


export default withNavigation(connect(mapStateToProps)(HeaderCancelBtn)) ;
