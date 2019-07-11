import React, { Component } from 'react'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import {ListItem, SearchBar} from "react-native-elements";
import {connect} from 'react-redux'

import * as Colors from '../utils/colors'
import InternetNotification from '../components/ui_components/InternetNotification'
import commonStyles from "../utils/commonStyles";
import OneLabel from '../components/ui_components/OneLabel'
import AddButton from '../components/ui_components/AddButton'
import {getLabelsForUser} from '../utils/API'
import {setLabels} from '../actions/labels'


class LabelsList extends Component{

  constructor(props){
    super(props);

    this.state = {
      search: '',
      chosenLabelID: '',
      labelsList: [],
      searchDataList: [],
      refresh: false,
      isLabelsLoaded: false
    }
  }


  static navigationOptions = ({navigation}) => {

    return {
      // headerLeft: (
      //   <CalendarIcon/>
      // ),
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Метки</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
      // headerRight: (
      //   <Avatar/>
      // ),

    }
  };

  componentDidMount(){
   getLabelsForUser()
      .then(data => {

        this.props.dispatch(setLabels(data));
      });


  }


  componentWillReceiveProps(nextProps) {
    console.log('New PROPS', nextProps);
    const {labels} = nextProps.labels;


    const copyLabels = JSON.parse(JSON.stringify(labels));

    const labelsListKeys = Object.keys(copyLabels);

    const labelsList = labelsListKeys.map((item) => {
      copyLabels[item].checked = false;
      return copyLabels[item];
    });

    if (labelsList !== this.state.labelsList) {
      this.setState({
        labelsList: labelsList,
        searchDataList: labelsList,
        isLabelsLoaded: true
      });
    }


  }

  updateSearch = (search) => {

    this.setState({
      search
    });

    const searchVal = search;
    const {labelsList} = this.state;

    if (searchVal !== '') {
      const searchResultArr = labelsList.filter((item) => {
        const value = item.title.toLowerCase();
        return ~value.indexOf(searchVal.toLowerCase());
      });

      this.setState({
        ...this.state,
        search,
        searchDataList : searchResultArr
      })

    } else {

      this.setState({
        ...this.state,
        search,
        searchDataList : this.state.labelsList
      })
    }

  };

  handleChoosingLabel = (labelID) => {

    const {labelsList} = this.state;

    let newLabelsList = labelsList.map((item) => {
      item.checked = labelID === item.id;
      return item;
    });


    this.setState({
      labelsList: newLabelsList,
      chosenLabelID: labelID,
      refresh: !this.state.refresh
    })
  };

  renderFlatListItem = ({item}) => {
    return (
      <OneLabel  key={item.id} labelData={item} hasRadio={false}  handleChoosingLabel = {this.handleChoosingLabel}/>
    )
  };

  emptyFlatList = () => {
    console.log('here');
    console.log(this.props);
    return (
      <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
        <Text>К сожалению, список пуст</Text>
      </View>
    )
  };


  handlePressAddButton = () => {
    this.props.navigation.navigate('CreateLabel');
  };




  render() {

    console.log('STATE:', this.state);
    console.log('PROPS', this.props);

    const { search, searchDataList, isLabelsLoaded } = this.state;

    searchDataList.sort((a,b) => {
      if (a.dateModified < b.dateModified) {
        return 1;
      }
      if (a.dateModified > b.dateModified) {
        return -1;
      }
      return 0

    });


    return (
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>
        <SearchBar
          placeholder="Имя, фамилия или специализация"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0 }}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />
       <View style={[commonStyles.containerIndents, {marginTop: 16} ]}>
         {isLabelsLoaded  &&

           <FlatList
           keyExtractor={(item, index) => index.toString()}
           data={searchDataList}
           ListEmptyComponent={this.emptyFlatList}
           extraData={this.state.refresh}
           renderItem={this.renderFlatListItem}
           />

         }
       </View>
        <AddButton handlePress={this.handlePressAddButton}/>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  const labels = state.labels;
  console.log(state);
  return(
    {
      labels,
    }
  )

}

export default withNavigationFocus(connect(mapStateToProps)(LabelsList)) ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND
  }
});
