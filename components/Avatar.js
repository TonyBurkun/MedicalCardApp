import React, {Component} from 'react'
import {View, Text, Image, Button, StyleSheet} from 'react-native'
import {connect} from 'react-redux'

class Avatar extends Component {
  render() {

    let image = this.props.currentUserPhotoURL;
    return (
      <Image
        style={styles.avatar}
        source={{uri: image + '?width=100&height=100'}}
      />
    )
  }
}

function mapStateToProps(state) {
  const {currentUserUID, currentUserData} = state.authedUser;
  const {photoURL} = currentUserData;
  return {
    currentUserPhotoURL: photoURL || ''
  }
}

export default connect(mapStateToProps)(Avatar)



const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  }
});
