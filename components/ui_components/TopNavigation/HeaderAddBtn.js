import React, {Component} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import * as Colors from '../../../utils/colors'



class HeaderAddBtn extends Component{

  handlePressBtn = () => {
    this.props.navigation.goBack();
  };

  render() {

    const {activeLabel} = this.props;


    return(
      <TouchableHighlight
        disabled={!activeLabel}
        underlayColor={'transparent'}
        onPress={this.handlePressBtn}
        style={{paddingRight: 8}}
      >
        <Text
          style={activeLabel ? {fontSize: 17, color: Colors.DARK_GREEN} : {fontSize: 17, color: Colors.DISABLED_BORDER}}
        >Добавить</Text>
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


export default withNavigation(connect(mapStateToProps)(HeaderAddBtn)) ;
