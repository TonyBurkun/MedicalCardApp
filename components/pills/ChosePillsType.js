import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import * as Colors from "../../utils/colors";
import HeaderAddBtn from "../ui_components/TopNavigation/HeaderAddBtn";
import {SafeAreaView} from "react-navigation";
import commonStyles from "../../utils/commonStyles";
import CustomList from "../ui_components/List/CustomList";

class ChosePillsType extends Component {


  static navigationOptions = ({navigation}) => {

    console.log(navigation);
    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}> {navigation.state.params.screenTitle} </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerRight: (
        <HeaderAddBtn titleBtn={'Сохранить'} type={'chosePillsType'}/>
      )
    }
  };

  render() {

    console.log(this.props);

    const pillsTypeListArr = this.props.pillsTypeList;
    const {chosenPillsTypeArr} = this.props;

    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0, backgroundColor: Colors.WHITE}]}>
        <CustomList data={pillsTypeListArr} route={'ChosePillsType'} chosenItemsID={chosenPillsTypeArr} searchField={false} radio={true}/>
      </SafeAreaView>
    )
  }


}


function mapStateToProps (state) {
  console.log(state);
  return {
    pillsTypeList: state.pills.pillsTypeList,
    chosenPillsTypeArr: state.pills.chosenPillsTypeArr,
  }
}

export default connect(mapStateToProps)(ChosePillsType)

const styles = StyleSheet.create({});
