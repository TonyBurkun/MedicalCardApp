import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image, FlatList, Platform, ScrollView} from 'react-native'
import HeaderCancelBtn from "../ui_components/TopNavigation/HeaderCancelBtn";
import * as Colors from "../../utils/colors";
import HeaderAddBtn from "../ui_components/TopNavigation/HeaderAddBtn";
import {
  checkRelationsImgToPills, deletePillByID,
  getAppPillsList,
  getPillsList,
  getPillsType,
  getUIDfromFireBase,
  removeRelationImgToPill
} from "../../utils/API";
import {deletePill, setPills, setPillsTypeList} from "../../actions/pills";
import Swipeable from "react-native-swipeable";
import OnePillList from "../ui_components/ListItems/OnePillList";
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import InternetNotification from "../ui_components/InternetNotification";
import {SearchBar} from "react-native-elements/src/index";
import CustomButtonGroup from "../ui_components/Buttons/CustomButtonGroup";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";
import {isIphone5} from "../../utils/helpers";
import {connect} from "react-redux";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GroupButtonsTitle from "../ui_components/titles/GroupButtonsTitle";
import AddButton from "../ui_components/Buttons/AddButton";

class ChosePill extends Component {

  constructor(props){
    super(props);
    this.swipe = [];

    this.state={
      search: '',
      pillsList: [],
      pillsListOrigin: [],
      isLoaded: true,
      emptySearch: false,
      showList: false,
      chosenPillsID: []
    }
  }

  static navigationOptions = ({navigation}) => {

    const screenTitle = navigation.state.params.screenTitle;
    return {
      headerLeft: () => {
        return (
          <HeaderCancelBtn />
        )
      },
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>{screenTitle}</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      },
      headerRight: (
        <HeaderAddBtn type={'chosenPills'}/>
      )
    }
  };


  _closeAllSwipes = () => {
    this.swipe.forEach((item) => {
      item.recenter();
    });
  };

  _clonePillsObjWithCheckedFalse = (pills, chosenPillsID) => {

    console.log(chosenPillsID);

    const copyPills = JSON.parse(JSON.stringify(pills));
    const pillsListKeys = Object.keys(copyPills);


    let pillsArr = pillsListKeys.map((item) => {
      copyPills[item].checked = false;

      return copyPills[item];
    });


    chosenPillsID.forEach((id) => {
      pillsArr.forEach((label) => {
        if (label.id === id) {
          label.checked = true;
        }
      })
    });


    return pillsArr;

  };


  componentDidMount(){

    let appPills = getAppPillsList();
    let customPills = getPillsList();
    const uid = getUIDfromFireBase();


    Promise.all([appPills, customPills])
      .then(resolve => {
        let currentUserPills = resolve[1];

        console.log(currentUserPills);


        for (let key in currentUserPills) {
          console.log(currentUserPills[key]);

          console.log(key);
          console.log(uid);
          console.log(currentUserPills[key].createdByUser);

          if (currentUserPills[key].createdByUser !== uid) {
            delete(currentUserPills[key]);
          }

        }

        let data = {...resolve[0], ...resolve[1]};


        console.log(currentUserPills);
        this.props.dispatch(setPills(data));
        const {chosenPillsID} = this.state;
        const pillsList = this._clonePillsObjWithCheckedFalse(data, chosenPillsID);
        this.setState({
          pillsList: pillsList,
          pillsListOrigin: pillsList,
          isLoaded: pillsList.length,
          showList: pillsList.length,
        })
      });

    getPillsType()
      .then(data => {
        this.props.dispatch(setPillsTypeList(data));
      })
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    // const data = this.props.pillsList;


    const nextPillsList = nextProps.pillsList;
    const {pillsListOrigin} = this.state;

    if (Object.keys(nextPillsList).length !== pillsListOrigin.length) {

      const chosenPillsID = nextProps.chosenPillsID;
      const data = nextProps.pillsList;

      const newPillsList = this._clonePillsObjWithCheckedFalse(data, chosenPillsID);

      this.setState({
        pillsList: newPillsList,
        pillsListOrigin: newPillsList,
        isLoaded: newPillsList.length,
        showList: newPillsList.length,
        search: '',
        emptySearch: false,
        chosenPillsID,
      })

    }

  }

  renderFlatListItem = ({item}) => {

    console.log('render Flat list');
    const uid = getUIDfromFireBase();

    const handleEditBtn = () => {
      console.log('here');
      this._closeAllSwipes();
      this.props.navigation.navigate('CreatePill', {pillID: item.id})

    };

    const handleDeleteBtn = () => {
      this._closeAllSwipes();

      console.log(item.images);

      const shouldBeRemovedImgArr = item.images || [];
      const id = item.id;

      if (shouldBeRemovedImgArr.length) {
        console.log('AFTER REMOVE', shouldBeRemovedImgArr);
        removeRelationImgToPill(shouldBeRemovedImgArr, id)
          .then( async (success) => {
            if (success) {
              // images relations was removed.
              for (let image of shouldBeRemovedImgArr) {
                // await removePillImages(image.name);
                await checkRelationsImgToPills(image.name)
              }
              console.log('DONE REMOVE IMAGE');
            }
          });
      }



      deletePillByID(item.id)
        .then(() => {
          // removePillImages(item);
          this.props.dispatch(deletePill(item.id));
          const newPillsList = this._clonePillsObjWithCheckedFalse(this.props.pillsList, []);


          this.setState({
            pillsList: newPillsList,
            pillsListOrigin: newPillsList,
            isLoaded: newPillsList.length,
            showList: newPillsList.length,
          })
        });

    };

    let rightButtons = null;

    if (uid === item.createdByUser) {
      rightButtons = [
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={handleEditBtn}
          style={{height: 56, width: 56, marginLeft: 15, justifyContent: 'center'}}
        >
          <Image
            style={{width: 40, height: 40}}
            source={require('../../assets/general/edit.png')}
          />
        </TouchableHighlight>,

        <TouchableHighlight
          underlayColor={'transparent'}
          style={{height: 56, width: 56, marginLeft: 15,  justifyContent: 'center'}}
          onPress={handleDeleteBtn}
        >
          <Image
            style={{width: 40, height: 40}}
            source={require('../../assets/general/delete.png')}
          />
        </TouchableHighlight>
      ];
    }

    if (uid !== item.createdByUser) {
      rightButtons = [
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={handleEditBtn}
          style={{height: 56, width: 56, marginLeft: 15, justifyContent: 'center'}}
        >
          <Image
            style={{width: 40, height: 40}}
            source={require('../../assets/general/edit.png')}
          />
        </TouchableHighlight>
      ];
    }





    return (
      <Swipeable rightButtons={rightButtons}
                 onRef={(swipe) => {
                   this.swipe.push(swipe);
                 }}
                 rightButtonWidth={56}
                 onSwipeStart={() => { this._closeAllSwipes()}}
      >
        <OnePillList key={item.id} pillData={item} hasCheckBox={true} handleChoosingPill = {this.handleChoosingPill}/>
      </Swipeable>
    )
  };

  updateSearch = (search) => {

    this.setState({
      search
    });

    const searchVal = search.toLowerCase();
    const {pillsListOrigin} = this.state;

    if (searchVal !== '') {

      const searchResultArr = pillsListOrigin.filter((item) => {
        const pillTitle = item.pillTitle.toLowerCase();
        return ~pillTitle.indexOf(searchVal)

      });

      this.setState({
        ...this.state,
        search,
        emptySearch: Boolean(!searchResultArr.length),
        pillsList : searchResultArr,
      })

    } else {

      this.setState({
        ...this.state,
        search,
        emptySearch: false,
        pillsList : this.state.pillsListOrigin,
      })
    }

  };


  handleChoosingPill = (pillID, hasCheckBox) => {


    if (hasCheckBox){

      const {pillsList, pillsListOrigin} = this.state;

      let newPillsList = JSON.parse(JSON.stringify(pillsList));
      let newPillsListOrigin = JSON.parse(JSON.stringify(pillsListOrigin));

      newPillsList = newPillsList.map((item) => {
        if (pillID === item.id) {
          item.checked = !item.checked;
        }
        return item;
      });

      newPillsListOrigin = newPillsListOrigin.map((item) => {
        if (pillID === item.id) {
          item.checked = !item.checked;
        }
        return item;
      });


      const newChosenPillsID = [];

      newPillsListOrigin.forEach(item => {
        if (item.checked) {
          newChosenPillsID.push(item.id)
        }
      });

      const prevChosenPills = this.props.chosenPillsID;


      this.setState({
        pillsList: newPillsList,
        pillsListOrigin: newPillsListOrigin,
        chosenPillsID: newChosenPillsID,
      });


      // this.props.dispatch(setChosenDoctors(newChosenDoctorsID));

      this.props.navigation.navigate('ChosePill',{type: 'AddItemsWithBack', chosenItemsID: newChosenPillsID, prevData: prevChosenPills});
    } else {
      const {pillsList} = this.props;
      const currentPill = pillsList[pillID];

      this.props.navigation.navigate('OnePill', {pillID: pillID, currentPill: currentPill})

    }

  };

  handlePressAddButton = () => {
    this.props.navigation.navigate('CreatePill');
  };





  render() {

    console.log(this.state);

    const uid = getUIDfromFireBase();

    let {isLoaded, pillsList, search, showList} = this.state;

    pillsList.sort((a,b) => {

      if (a.pillTitle.toLowerCase() < b.pillTitle.toLowerCase()) {
        return -1;
      }
      if (a.pillTitle.toLowerCase() > b.pillTitle.toLowerCase()) {
        return 1;
      }
      return 0

    });

    console.log(pillsList);

    const popularPillsList = pillsList.filter(item => {
      return item.createdByUser !== uid
    });

    const createdPillsList = pillsList.filter(item => {
      return item.createdByUser === uid
    });



    return(
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>
        <SearchBar
          placeholder="Название препарата"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0}}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />

        <ScrollView style={{paddingRight: 16}}>
          {createdPillsList.length !==0 &&
            <Fragment>
              <GroupButtonsTitle title={'СОЗДАННЫЕ'} paddingLeft={16}/>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={createdPillsList}
                renderItem={this.renderFlatListItem}
                scrollEnabled={false}
              />
            </Fragment>
          }
          {popularPillsList.length !== 0 &&
            <Fragment>
              <GroupButtonsTitle title={'ПОПУЛЯРНЫЕ'} paddingLeft={16}/>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={popularPillsList}
                renderItem={this.renderFlatListItem}
                scrollEnabled={false}
              />
            </Fragment>
          }

          {popularPillsList.length ===0 && createdPillsList.length === 0 && Boolean(showList) &&
            <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
              <Text>{NO_DATA_TO_SHOW}</Text>
            </View>
          }

        </ScrollView>

        <AddButton handlePress={this.handlePressAddButton}/>
      </SafeAreaView>
    )
  }


}

function mapStateToProps (state) {
  console.log(state);
  const pills = state.pills;
  return {
    pillsList: pills.pillsList,
    pillsTypeList: pills.pillsTypeList,
    chosenPillsType: pills.chosenPillsType,
    chosenPillsID: pills.chosenPillsID,
  }
}


export default withNavigationFocus(connect(mapStateToProps)(ChosePill))


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    backgroundColor: Colors.MAIN_BACKGROUND
  },

  submitBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.DARK_CERULEAN,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },

  firstBtn: {
    marginTop: 30,
  },

  submitBtnText: {
    ...Platform.select({
      ios: {
        textTransform: 'uppercase',
      }
    }),
    textAlign: 'center',
    color: Colors.ISABELLINE,
  },


  mainTextWrapper: {
    fontSize: 16,
    width: '100%',
    position: 'absolute',
    top: '10%',
    paddingLeft: 30,
    paddingRight: 30,
  },

  mainText: {
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  mainText__smallPhone: {
    fontSize: 12,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },

  subText__smallPhone: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },

  personImage: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    width: wp('43%'),
    height: hp('55%')
  },

  tipWrapper: {
    position: 'absolute',
    bottom: 20,
    right: '50%',
    marginRight: -150,
    width: 150,
    height: 90,
  },

  tipText: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GREEN_TIP
  },

  tipArrow: {
    width: 39,
    height: 62,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -31,
  }

});

