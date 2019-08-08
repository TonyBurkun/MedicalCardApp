import React, {Component} from 'react';
import {View, Text, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import {saveChosenLabel} from '../../../actions/labels'
import * as Colors from '../../../utils/colors'
import {setChosenDoctors} from "../../../actions/doctors";



class HeaderCancelBtn extends Component{

  handlePressBtn = () => {

    console.log(this.props.navigation.state.routeName);

    switch (this.props.navigation.state.routeName) {
      case 'ChoseDoctor':
        this.props.dispatch(setChosenDoctors([]));
        this.props.navigation.goBack();
        break;

      case 'LabelsList':
        this.props.dispatch(saveChosenLabel([]));
        this.props.navigation.goBack();
        break;

      default:
        break;
    }

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
    chosenLabelsID: labels.chosenLabelsID
  }
}


export default withNavigation(connect(mapStateToProps)(HeaderCancelBtn)) ;
