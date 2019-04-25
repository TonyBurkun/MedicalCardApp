import React, {Component} from 'react'
import {View, Text, FlatList} from 'react-native'
import {connect} from 'react-redux'
// import {ListItem, CheckBox} from 'react-native-elements'


class MedicalCardList extends Component{

  renderFlatListItem = ({item, index}) => {
    console.log(index);

    return (

      <View>
        <Text>{item}</Text>
      </View>

    )
  };

  render() {

    const listType = this.props.navigation.getParam('listType');

    const dataList = this.props[listType];



    return (
      <View>
        <FlatList
          data={dataList}
          renderItem={this.renderFlatListItem}
          keyExtractor={index => index}
        />
      </View>
    )
  }
}

function mapStateToProps (state) {
  const {childhoodDiseases} = state.childhoodDiseases;

  return {
   childhoodDiseases
  }
}

export default connect(mapStateToProps)(MedicalCardList)
