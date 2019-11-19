import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {Icon} from 'react-native-elements/src/index'
import { withNavigation } from 'react-navigation'
import * as Colors from "../../../utils/colors";

class ProfileListBtnChangeStatus extends Component{
  constructor(props){
    super(props);

    this.state = {
     fb: {
       active: require('../../../assets/profile/fb_active.png'),
       no_active: require('../../../assets/profile/fb_no_active.png')
     },
      twitter: {
        active: require('../../../assets/profile/twitter_active.png'),
        no_active: require('../../../assets/profile/twitter_no_active.png')
      },
      email: {
        active: require('../../../assets/profile/email_active.png'),
        no_active: require('../../../assets/profile/email_no_active.png')
      },
    }
  }


  render() {

    const {title, iconType, active} = this.props;


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
              source={active ? (this.state[iconType].active) : (this.state[iconType].no_active)}
            />
            <Text style={styles.itemBtn__text}>{title}</Text>
          </View>
         <View style={{flexDirection: 'row'}}>
           <Text
             numberOfLines={1}
             style={{width: 130, alignSelf: 'center', fontSize: 14, color: Colors.MAIN_GREEN}}>
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

export default withNavigation(ProfileListBtnChangeStatus)


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



ProfileListBtnChangeStatus.propTypes = {
  title: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired,
  onPressAction: PropTypes.func,
  active: PropTypes.bool
};

ProfileListBtnChangeStatus.defaultProps = {
  title: 'Название кнопки',
  iconType: 'label',
  active: false
};
