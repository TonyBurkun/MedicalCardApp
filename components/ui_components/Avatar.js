import React, {Component} from 'react'
import {View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native'
import {withNavigation} from 'react-navigation'
import {Image} from 'react-native-elements/src/index'
import {connect} from 'react-redux'

class Avatar extends Component {

  handlePressAvatar = () => {
    this.props.navigation.navigate('Profile');
  };

  render() {

    let image = this.props.currentUserPhotoURL;

    return (
     <TouchableOpacity
       onPress={this.handlePressAvatar}
     >
       <Image
         style={styles.avatar}
         source={{uri: image + '?width=100&height=100'}}
         resizeMode='cover'
         PlaceholderContent={<ActivityIndicator />}
       />
     </TouchableOpacity>
    )
  }
}

function mapStateToProps(state) {

  const {currentUserUID, currentUserData} = state.authedUser;
  const {avatarURL} = currentUserData;
  return {
    currentUserPhotoURL: avatarURL || ''
  }
}

export default  withNavigation(connect(mapStateToProps)(Avatar))



const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  }
});
