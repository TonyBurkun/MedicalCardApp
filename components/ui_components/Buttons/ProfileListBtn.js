import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {Icon} from 'react-native-elements/src/index'
import { withNavigation } from 'react-navigation'
import * as Colors from "../../../utils/colors";

class ProfileListBtn extends Component{
  constructor(props){
    super(props);

    this.state = {
      label: require('../../../assets/profile/label_icon.png'),
      logout: require('../../../assets/profile/logout_icon.png'),
      problem: require('../../../assets/profile/problem_icon.png'),
      policy: require('../../../assets/profile/policy_icon.png'),
    }
  }

  render() {

  const {title, iconType} = this.props;


    console.log(this.state);



    return (
      <View>
        <TouchableOpacity
          style={styles.itemBtn}
          onPress={this.props.onPressAction}
        >
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.itemBtn__icon}
              source={this.state[iconType]}
            />
            <Text style={styles.itemBtn__text}>{title}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              numberOfLines={1}
              style={{alignSelf: 'center', fontSize: 14, color: Colors.MAIN_GREEN}}>
              {this.props.value}
            </Text>
            <Icon
              name='chevron-right'
              type='evilicon'
              color={Colors.GRAY_TEXT}
              size={40}
              containerStyle={{alignSelf: 'center', paddingTop: 4}}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default withNavigation(ProfileListBtn)


const styles = StyleSheet.create({
  itemBtn: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.WHITE,
    height: 56,
    paddingLeft: 8,
    paddingRight: 0,
    borderRadius: 12,
    marginBottom: 8,
    // Offset: 0 pt, 4 pt,
    // rgba 0.0, 0.0, 0.0, 0.1,

    shadowColor: Colors.BLACK_TITLE,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    },
  },

  itemBtn__icon: {
    width: 32,
    height: 32,
    alignSelf: 'center'
  },

  itemBtn__text: {
    color: Colors.BLACK_TITLE_BTN,
    alignSelf: 'center',
    fontSize: 14,
    marginLeft: 8,
  }


});



ProfileListBtn.propTypes = {
  title: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired,
  onPressAction: PropTypes.func,
};

ProfileListBtn.defaultProps = {
  title: 'Название кнопки',
  iconType: 'label'
};
