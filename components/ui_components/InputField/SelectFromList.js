import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import commonStyles from "../../../utils/commonStyles";
import * as Colors from "../../../utils/colors";
import {Icon} from "react-native-elements";
import withNavigation from "react-navigation/src/views/withNavigation";
import {connect} from 'react-redux'


function convertChosenValueToStr (chosenItemsArr, valueListArr) {
  let chosenValuesStr = '';
  if (chosenItemsArr.length) {
    chosenItemsArr.forEach((item) => {
      chosenValuesStr = chosenValuesStr + valueListArr[item] + ', '
    });
    chosenValuesStr = chosenValuesStr.substr(0, chosenValuesStr.length - 2);
  }

  return chosenValuesStr;
}

class SelectFromList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedValuesList: [],
      valueListArr: [],
      chosenValueStr: '',
    }

  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);

    switch (this.props.type) {
      case 'testList':
        console.log('HERE TEST LIST');
        console.log(nextProps);
        const {tests} = nextProps;
        const chosenTestType = tests.chosenTestType;
        if (chosenTestType.length) {
          const chosenTestTypeID = chosenTestType[0];
          const {testTypesTitleList} = tests;
          this.setState({
            chosenValueStr: testTypesTitleList[chosenTestTypeID]
          });
        }

        break;

      default:
        break;
    }

  }


  render() {


    const {placeholder} = this.props;
    const {chosenValueStr} = this.state;
    console.log(this.state);


    return (
      <TouchableOpacity
        style={[commonStyles.tableBlockItem, {position: 'relative'}]}
        onPress={this.props.pressOnSelect}
      >

        <Text style={{
          position: 'absolute',
          left: 12,
          top: 5,
          fontSize: 14,
          color: Colors.GRAY_TEXT
        }}> {chosenValueStr.length > 0 && placeholder}</Text>
        <Text
          style={!chosenValueStr.length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
            paddingTop: 28,
            fontSize: 16,
            color: Colors.TYPOGRAPHY_COLOR_DARK
          }]}>
          {!chosenValueStr.length ? placeholder : chosenValueStr}
        </Text>
        <Icon
          name='chevron-right'
          type='evilicon'
          color={Colors.GRAY_TEXT}
          size={40}
          containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
        />
      </TouchableOpacity>
    )
  }


}


function mapStateToProps(state) {
  console.log(state);

  return {
   tests: state.tests

  }
}

export default withNavigation(connect(mapStateToProps)(SelectFromList))

const styles = StyleSheet.create({});


SelectFromList.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.array,

};

SelectFromList.defaultProps = {
  placeholder: 'Выбрать значение'
};
