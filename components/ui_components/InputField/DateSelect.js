import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../../utils/colors";
import {Icon, ListItem} from "react-native-elements";
import DatePicker from "react-native-datepicker";
import {getCurrentDate} from "../../../utils/helpers";
import PropTypes from 'prop-types'

class DateSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: getCurrentDate(),
    }

  }

  handlePressDateList = () => {
    this.datePicker.onPressDate()
  };

  render() {

    const {initialDate} = this.props;

    return (
      <View>
        <ListItem
          onPress={this.handlePressDateList}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 0,
            paddingTop: 9,
            paddingBottom: 9,
            borderBottomWidth: 1,
            borderColor: Colors.TABLE_BORDER
          }}
          title={'Дата'}
          titleStyle={{fontSize: 14}}
          rightAvatar={
            <View style={{flexDirection: 'row'}}>
              <DatePicker
                locale={'ru'}
                ref={(picker) => {
                  this.datePicker = picker;
                }}
                date={initialDate || this.state.date} //initial date from state
                // mode="date" //The enum of date, datetime and time
                format="DD-MM-YYYY"
                minDate="01-01-1930"
                maxDate={getCurrentDate()}
                confirmBtnText="Сохранить"
                cancelBtnText="Отмена"
                hideText={!this.state.date}
                showIcon={false}
                customStyles={{
                  dateInput: {
                    alignItems: 'flex-end',
                    paddingLeft: 16,
                    borderWidth: 0,
                    backgroundColor: Colors.WHITE,

                  },
                  dateText: {
                    fontSize: 14,
                    color: Colors.MAIN_GREEN,
                    fontWeight: 'bold'
                  },
                  placeholderText: {
                    fontSize: 14,
                    color: Colors.GRAY_TEXT,
                  },

                }}
                onDateChange={(value) => {
                  this.setState({
                    ...this.state,
                    date: value,
                  });

                  this.props.updateDateValue(value);

                }}
              />
              <Icon
                name='chevron-right'
                type='evilicon'
                color={Colors.GRAY_TEXT}
                size={40}
                containerStyle={{alignSelf: 'center', paddingTop: 2}}
              />
            </View>
          }
        />
      </View>
    )
  }


}

export default DateSelect

const styles = StyleSheet.create({});

DateSelect.propTypes = {
  updateDateValue: PropTypes.func.isRequired,
  initialDate: PropTypes.string,

};

DateSelect.defaultProps = {

};
