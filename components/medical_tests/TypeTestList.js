import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import CustomList from "../ui_components/List/CustomList";
import {connect} from "react-redux";
import {SafeAreaView} from "react-navigation";
import * as Colors from "../../utils/colors";

class TypeTestList extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {
    const {chosenTestType, testTypesList} = this.props.tests;

    const testTypesTitleList = testTypesList.map(item => {
      return item['title'];
    });

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.WHITE}}>
       <CustomList data={testTypesTitleList} route={'TypeTestList'} chosenItemsID={chosenTestType} radio={true}/>
      </SafeAreaView>
    )
  }


}

function mapStateToProps (state) {
  return {
    tests: state.tests,
  }
}


export default connect(mapStateToProps)(TypeTestList)

const styles = StyleSheet.create({});
