import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {connect} from "react-redux";
import PropTypes from 'prop-types'
import {CheckBox} from "react-native-elements";
import * as Colors from "../../../utils/colors";

class OnePillList extends Component {

  constructor(props){
    super(props);

    this.state={
      pillsType: []
    }
  }


  componentDidMount(){
    const {pillsType} = this.props;
    this.setState({
      pillsType: pillsType
    })

  }

  componentWillReceiveProps(newProps){
    // console.log(newProps);
    this.setState({
      pillsType: newProps.pillsType
    })
  }

  render() {

    function getTypeTitleStr(pillsTypeArr, chosenTypeIDArr) {
      let chosenTitlesStr = '';

      if (chosenTypeIDArr.length && pillsTypeArr.length) {
        chosenTypeIDArr.forEach((item) => {
          chosenTitlesStr = chosenTitlesStr + pillsTypeArr[item] + ', '
        });
        chosenTitlesStr = chosenTitlesStr.substr(0, chosenTitlesStr.length - 2);
      }


      return chosenTitlesStr;
    }


    const {pillData, hasCheckBox, index} = this.props;
    const {pillsType} = this.state;

    getTypeTitleStr(pillsType, pillData.pillType);




    return (
      <TouchableOpacity
        onPress={() => {this.props.handleChoosingPill(pillData.id, hasCheckBox)}}
        style={[styles.pillBody, {position: 'relative'}, !hasCheckBox ? {paddingRight: 18} : {paddingRight: 38} ]}>
        {hasCheckBox &&
          <CheckBox
            checked={pillData.checked}
            iconType='material'
            checkedIcon='done'
            uncheckedIcon='done'
            uncheckedColor={Colors.WHITE}
            checkedColor={Colors.MAIN_GREEN}
            size={20}
            containerStyle={{margin: 0, padding: 0, alignSelf: 'center', position: 'absolute', right: 0, top: '50%', marginTop: -10}}
            onPress={() => {this.props.handleChoosingPill(pillData.id, hasCheckBox, index)}}
          />
        }
        <View style={{flexDirection: 'column', justifyContent: 'center', paddingTop: 10, paddingBottom: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.pillText]}>{pillData.pillTitle}</Text>
          </View>
          {/*<Text style={{color: Colors.MAIN_GREEN, fontSize: 14, marginTop: 3}}>{ getTypeTitleStr(pillsType, pillData.pillType)}</Text>*/}
        </View>
      </TouchableOpacity>
    )
  }


}

function mapStateToProps (state) {
  // console.log(state);

  return {
    pillsType: state.pills.pillsTypeList
  }
}

export default connect(mapStateToProps)(OnePillList)

const styles = StyleSheet.create({
  pillBody: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    minHeight: 64,
    paddingLeft: 18,
    marginLeft: 16,
    // marginRight: 16,
    flexDirection: 'row',
    marginBottom: 8,

    shadowColor: Colors.BLACK_TITLE,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },

  pillText: {
    color: Colors.BLACK_TITLE_BTN,
    fontSize: 16,
    alignSelf: 'center',

  }
});


OnePillList.propTypes = {
  pillData: PropTypes.object.isRequired,
  handleChoosingPill: PropTypes.func.isRequired,
  hasCheckBox: PropTypes.bool.isRequired,

};

OnePillList.defaultProps = {
  pillData: {
    id: 'pill-id',
    pillTitle: 'Название препарата',
    createdByUser: 'Пользователь который создал',
    pillType: [],
    checked: false,
  },
  hasCheckBox: false
};

