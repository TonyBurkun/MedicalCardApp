import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import * as Colors from "../../../utils/colors";

class RadioButtons extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: null,
    }

  }

  componentDidMount(){
    const {defaultValue} = this.props;
    console.log(defaultValue);

    this.setState({
      value: defaultValue
    })
  }



  render() {
    const {options} = this.props;
    const { value } = this.state;

    return (
      <View style={{flexDirection: 'row'}}>
        {options.map(item => {
          return (
            <TouchableOpacity key={item.key}
                              style={styles.buttonContainer}
                              onPress={() => {
                                this.props.updateRadioBtnState(item.key);
                                this.setState({
                                  value: item.key,
                                });
                              }}
            >
              <View style={value !== item.key ? styles.circle : [styles.circle, {borderColor: Colors.MAIN_GREEN}]}>
                {value === item.key && <View style={styles.checkedCircle} />}
              </View>
              <Text style={value !== item.key ? {color: Colors.GRAY_TEXT, fontSize: 16} : {fontSize: 16, color: Colors.MAIN_GREEN}}>{item.text}</Text>

            </TouchableOpacity>
          );
        })}
      </View>
    );
  }


}

export default RadioButtons

RadioButtons.propTypes = {
  options: PropTypes.array.isRequired,

};

RadioButtons.defaultProps = {
  defaultValue: null
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 30,
    marginRight: 20,
    flexWrap: 'nowrap'
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.GRAY_TEXT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.MAIN_GREEN,
  },
});
