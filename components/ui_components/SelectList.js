import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Platform, Picker} from 'react-native'
import PropTypes from 'prop-types'
import SimplePicker from 'react-native-simple-picker';

import * as Colors from '../../utils/colors'
import commonStyles from '../../utils/commonStyles'





class SelectList extends Component{

  constructor(props) {
    super(props);

    this.state = {
      selectedOption: '',
    }
  }


  render(){

    const {updateSelectVal, selectTitle, selectVal, options, initValIndex} = this.props;

    if (Platform.OS === 'android') {

      if (selectVal === 'weight') {
        options.unshift('Вес')
      }

      if (selectVal === 'height') {
        options.unshift('Рост')
      }


      return (
        <View style={[commonStyles.btn, {width: '100%', height: 56, paddingTop: 0, paddingBottom: 0}]}>
          <Picker
            style={{color: Colors.GRAY_TEXT}}
            selectedValue={this.state.selectedOption}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({selectedOption: itemValue});

              if (itemIndex > 0) {
                updateSelectVal(selectVal, itemValue);
              } else {
                updateSelectVal(selectVal, '');
              }
            }}>

            {options.map((item, index) => {
              item = item.toString();
              return (
                <Picker.Item key={index} label={item} value={item}/>
              )
            })}

          </Picker>
        </View>
      )
    }



    return(

      <View>

        <TouchableOpacity
          onPress={() => {this.refs.picker.show()}}
          style={[commonStyles.btn, commonStyles.selectBtn]}
        >
          <Text style={[commonStyles.btn__text, commonStyles.selectBtn__text]}>{this.state.selectedOption || selectTitle}</Text>
          <View style={[styles.triangle, commonStyles.selectBtn__caret]} />
        </TouchableOpacity>
        <SimplePicker
          initialOptionIndex={initValIndex}
          ref={'picker'}
          options={options}
          onSubmit={(option) => {
            this.setState({
              selectedOption: option,
            });

            updateSelectVal(selectVal, option);
          }}
        />
      </View>
    )
  }
}

export default SelectList


SelectList.propTypes = {
  updateSelectVal: PropTypes.func.isRequired,
  selectVal: PropTypes.string.isRequired,
  selectTitle: PropTypes.string,
  options: PropTypes.array.isRequired,
  initValIndex: PropTypes.number,
};

SelectList.defaultProps = {
  selectTitle: 'Выберать значение',
  options: ['option1', 'option2']
};


const styles = StyleSheet.create({


  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.GRAY_TEXT,
    transform: [
      {rotate: '180deg'}
    ]
  },
});
