import React, {Component} from 'react'
import {View, Text, FlatList} from 'react-native'
import {connect} from 'react-redux'
// import {ListItem, CheckBox} from 'react-native-elements'

// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
const myIcon = (<Icon name="rocket" size={30} color="#900" />)


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

    console.log(Icon);

    const listType = this.props.navigation.getParam('listType');

    const dataList = this.props[listType];



    return (
      <View>
       {/*<Text>*/}
       {/*  <Icon name="rocket" size={30} color="#900" />;*/}
       {/*</Text>*/}

        {myIcon}
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
