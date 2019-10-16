import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image, FlatList} from 'react-native'
import HeaderCancelBtn from "./ui_components/TopNavigation/HeaderCancelBtn";
import * as Colors from "../utils/colors";
import HeaderAddBtn from "./ui_components/TopNavigation/HeaderAddBtn";
import {getLabelsForUser, removeLabelForCurrentUser} from "../utils/API";
import {deleteLabel, setLabels} from "../actions/labels";
import Swipeable from "react-native-swipeable";
import OneLabel from "./ui_components/OneLabel";
import {SafeAreaView} from "react-navigation";
import InternetNotification from "./ui_components/InternetNotification";
import {SearchBar} from "react-native-elements";
import {NO_DATA_TO_SHOW} from "../utils/textConstants";
import AddButton from "./ui_components/AddButton";
import {connect} from 'react-redux'

class ChoseLabel extends Component {

  constructor(props){
    super(props);
    this.swipe = [];

    this.state = {
      search: '',
      labelsList: [],
      searchDataList: [],
      isLabelsLoaded: true,
      chosenLabelsID: []

    }
  }


  _closeAllSwipes = () => {
    this.swipe.forEach((item) => {
      item.recenter();
    });
  };

  _cloneLabelsObjWithCheckedFalse = (labels, chosenLabelsID) => {
    const copyLabels = JSON.parse(JSON.stringify(labels));
    const labelsListKeys = Object.keys(copyLabels);


    let labelsArr = labelsListKeys.map((item) => {
      copyLabels[item].checked = false;

      return copyLabels[item];
    });


    chosenLabelsID.forEach((id) => {
      labelsArr.forEach((label) => {
        if (label.id === id) {
          label.checked = true;
        }
      })
    });

    return labelsArr;

  };

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: () => {
        return (
          <HeaderCancelBtn/>
        )
      },
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Метки</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      },
      headerRight: (
        <HeaderAddBtn type={'chosenLabels'}/>
      )
    }
  };


  componentDidMount(){

    getLabelsForUser()
      .then(data => {
        console.log(data);
        this.props.dispatch(setLabels(data));

        const {chosenLabelsID} = this.state;
        const labelsList = this._cloneLabelsObjWithCheckedFalse(data, chosenLabelsID);

        this.setState({
          labelsList: labelsList,
          searchDataList: labelsList,
        })
      });

  }

  componentWillReceiveProps(nextProps) {

    console.log('New PROPS', nextProps);
    // console.log(this.state);
    const nextLabels = nextProps.labels.labels;
    const {labelsList} = this.state;

    console.log(nextLabels);
    console.log(labelsList);


    if (Object.keys(nextLabels).length !== labelsList.length) {

      const {labels} = nextProps.labels;
      const chosenLabelsID = nextProps.labels.chosenLabelsID;


      const newLabelsList = this._cloneLabelsObjWithCheckedFalse(labels, chosenLabelsID);

      if (newLabelsList.length) {
        this.setState({
          labelsList: newLabelsList,
          searchDataList: newLabelsList,
          search: '',
          chosenLabelsID: chosenLabelsID,
          isLabelsLoaded: true
        });
      } else {
        this.setState({
          isLabelsLoaded: false,
          search: '',
        });
      }

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

      console.log(searchResultArr.length);
      console.log(Boolean(searchResultArr.length));



      this.setState({
        ...this.state,
        search,
        searchDataList : searchResultArr,
        isLabelsLoaded: Boolean(searchResultArr.length)
      })

    } else {

      this.setState({
        ...this.state,
        search,
        searchDataList : this.state.labelsList,
        isLabelsLoaded: true
      })
    }

  };

  handleChoosingLabel = (labelID, hasCheckBox) => {
    console.log('!!!!!');


    if (hasCheckBox){
      // this.props.navigation.setParams({
      //   chosenLabelsID: this.state.chosenLabelsID
      // });

      const {labelsList, searchDataList, chosenLabelsID} = this.state;

      let newLabelsList = JSON.parse(JSON.stringify(labelsList));
      let newSearchDataList = JSON.parse(JSON.stringify(searchDataList));



      newLabelsList = newLabelsList.map((item) => {
        if (labelID === item.id) {
          item.checked = !item.checked;
        }
        return item;
      });

      newSearchDataList = newSearchDataList.map((item) => {
        if (labelID === item.id) {
          item.checked = !item.checked;
        }
        return item;
      });


      const newChosenLabelsID = [];

      newLabelsList.forEach(item => {
        if (item.checked) {
          newChosenLabelsID.push(item.id)
        }
      });

      const prevChosenLabels = this.props.labels.chosenLabelsID;
      console.log(prevChosenLabels);

      this.setState({
        labelsList: newLabelsList,
        searchDataList: newSearchDataList,
        chosenLabelsID: newChosenLabelsID
      });

      this.props.navigation.navigate('ChoseLabel',{type: 'AddItemsWithBack', chosenItemsID: newChosenLabelsID, prevData: prevChosenLabels});
    } else {
      this.props.navigation.navigate('CreateLabel', {labelID: labelID});
    }

  };

  renderFlatListItem = ({item}) => {

    const handleEditBtn = () => {
      this._closeAllSwipes();
      this.props.navigation.navigate('CreateLabel', {labelID: item.id})

    };

    const handleDeleteBtn = () => {
      this._closeAllSwipes();

      if (item.checked) {
        const {chosenLabelsID} = this.state;

        chosenLabelsID.forEach((id, index) => {
          if (id === item.id) {
            chosenLabelsID.splice(index, 1);
          }
        });

        this.setState({
          chosenLabelsID
        })
      }

      removeLabelForCurrentUser(item.id)
        .then(() => {
          this.props.dispatch(deleteLabel(item.id));
        });

      this.props.navigation.setParams({
        chosenLabelsID: this.state.chosenLabelsID
      });

    };

    const rightButtons = [
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={handleEditBtn}
        style={{height: 56, width: 56, marginLeft: 15, justifyContent: 'center'}}
      >
        <Image
          style={{width: 40, height: 40}}
          source={require('../assets/general/edit.png')}
        />
      </TouchableHighlight>,

      <TouchableHighlight
        underlayColor={'transparent'}
        style={{height: 56, width: 56, marginLeft: 15,  justifyContent: 'center'}}
        onPress={handleDeleteBtn}
      >
        <Image
          style={{width: 40, height: 40}}
          source={require('../assets/general/delete.png')}
        />
      </TouchableHighlight>
    ];


    if (this.state.isLabelsLoaded) {

      return (
        <Swipeable rightButtons={rightButtons}
                   onRef={(swipe) => {
                     this.swipe.push(swipe);
                   }}
                   rightButtonWidth={56}
                   onSwipeStart={() => { this._closeAllSwipes()}}
        >
          <OneLabel  key={item.id} labelData={item} hasCheckBox={true}  handleChoosingLabel = {this.handleChoosingLabel}/>
        </Swipeable>
      )
    }
  };

  handlePressAddButton = () => {
    this.props.navigation.navigate('CreateLabel');
  };


  render() {

    console.log('STATE:', this.state);
    console.log('PROPS', this.props);

    const { search, searchDataList, isLabelsLoaded } = this.state;
    const {navigation} = this.props;

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
          placeholder="Имя метки"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0 }}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />
        <View style={{marginTop: 16, paddingRight: 16}}>
          {isLabelsLoaded ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={searchDataList}
              renderItem={this.renderFlatListItem}
            />
          ) : (
            <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
              <Text>{NO_DATA_TO_SHOW}</Text>
            </View>
          )

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

export default connect(mapStateToProps)(ChoseLabel)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND
  }
});
