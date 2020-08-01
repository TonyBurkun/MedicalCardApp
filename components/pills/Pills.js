import React, {Component, Fragment} from 'react'
import {View, Text, Image, StyleSheet, Platform, FlatList, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import * as Colors from "../../utils/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {convertObjToArr, isIphone5, sortPills} from "../../utils/helpers";
import {
  checkRelationsImgToPills,
  deleteDoctorByID, deletePillByID, getAppPillsList,
  getDoctorsList,
  getDoctorSpecializations, getNotesListByCurrentUser,
  getPillsList,
  getPillsType,
  getUIDfromFireBase, removePillImages, removeRelationImgToPill, updateChosenNote
} from "../../utils/API";
import {deletePill, setPills, setPillsTypeList} from "../../actions/pills";
import {SearchBar} from "react-native-elements/src/index";
import CustomButtonGroup from "../ui_components/Buttons/CustomButtonGroup";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";
import Swipeable from "react-native-swipeable";
import OnePillList from "../ui_components/ListItems/OnePillList";
import {updateNote} from "../../actions/notes";


class Pills extends Component{
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
      selectedIndex: 0,
    }
  }

  updateChosenTab (selectedIndex) {
    this._closeAllSwipes();

    this.setState({selectedIndex})
  }

  _closeAllSwipes = () => {
    this.swipe.forEach((item) => {
      item.recenter();
    });
  };


  _clonePillsObjWithCheckedFalse = (pills, chosenPillsID = []) => {
    const copyPills = JSON.parse(JSON.stringify(pills));
    const pillsListKeys = Object.keys(copyPills);


    let pillsArr = pillsListKeys.map((item) => {
      copyPills[item].checked = false;

      return copyPills[item];
    });


    chosenPillsID.forEach((id) => {
      pillsArr.forEach((item) => {
        if (item.id === id) {
          item.checked = true;
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

        for (let key in currentUserPills) {
          if (currentUserPills[key].createdByUser !== uid) {
            delete(currentUserPills[key]);
          }

        }

        let data = {...resolve[0], ...resolve[1]};
        this.props.dispatch(setPills(data));
        const pillsList = this._clonePillsObjWithCheckedFalse(data, []);
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
    // const data = nextProps.doctorsList;
    const data = this.props.pillsList;
    const newPillsList = this._clonePillsObjWithCheckedFalse(data, []);


    this.setState({
      pillsList: newPillsList,
      pillsListOrigin: newPillsList,
      isLoaded: newPillsList.length,
      showList: newPillsList.length,
      search: '',
      emptySearch: false,
    })

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

      // Remove the deleted PILL from the all Notes where it was added ----
      getNotesListByCurrentUser()
        .then(data => {
          const pillID = item.id;
          const notesListArr = convertObjToArr(data);
          notesListArr.forEach((item) => {
            if (item.pills) {
              let pillsArr = item.pills;
              let searchResult = pillsArr.indexOf(pillID);
              if (searchResult !== -1) {
                pillsArr.splice(searchResult, 1);
                updateChosenNote(item.id, item);
                this.props.dispatch(updateNote(item));
              }
            }
          })

        })
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
        <OnePillList key={item.id} pillData={item} hasCheckBox={false}  handleChoosingPill = {this.handleChoosingPill}/>
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


  handleChoosingPill = (pillID) => {
    const {pillsList} = this.props;
    const currentPill = pillsList[pillID];

    // this.props.navigation.navigate('OnePill', {pillID: pillID, currentPill: currentPill})
    this.props.navigation.navigate('CreatePill', {pillID: pillID})

  };



  render() {

    console.log(this.state);

    const uid = getUIDfromFireBase();

    const buttons = ['Популярные', 'Созданные'];

    let {isLoaded, pillsList, search} = this.state;
    const { selectedIndex } = this.state;

    switch (selectedIndex) {

      case 0 :
        pillsList = pillsList.filter(item => {
          return item.createdByUser !== uid
        });
        break;

      case 1:
        pillsList = pillsList.filter(item => {
          return item.createdByUser === uid
        });
        break;


      default:
        break;
    }



    return(
      <SafeAreaView style={styles.container}>
        <SearchBar
          placeholder="Название препарата"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0}}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />

        {isLoaded ?
          (
            this.state.showList &&
              <Fragment>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                  <CustomButtonGroup
                    updateIndex={(selectedIndex) => {this.updateChosenTab(selectedIndex)}}
                    buttons={buttons}
                    selectedIndex={selectedIndex}/>
                </View>
                {!this.state.emptySearch && pillsList.length ? (
                  <View style={{flex: 1, marginTop: 10, paddingRight: 16}}>
                    <FlatList
                      keyExtractor={(item, index) => index.toString()}
                      data={sortPills(pillsList)}
                      renderItem={this.renderFlatListItem}
                    />
                  </View>
                ) : (
                  <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
                    <Text>{NO_DATA_TO_SHOW}</Text>
                  </View>
                )}
              </Fragment>
          ) : (
            <View style={{flex: 1, position: 'relative'}}>
              <View style={styles.mainTextWrapper}>
                <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь отображаются Препараты, которые Вы добавили самостоятельно.</Text>
                <Text style={[!isIphone5()? styles.subText: styles.subText__smallPhone]}>Создавайте, редактируйте или удаляйте Препараты.</Text>
              </View>
              <Image
                style={styles.personImage}
                source={require('../../assets/person/pills.png')}/>
              <View style={styles.tipWrapper}>
                <Text style={styles.tipText}>Добавить препарат</Text>
                <Image
                  style={styles.tipArrow}
                  source={require('../../assets/vector/pills_vector.png')}/>

              </View>
            </View>
          )
        }
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
  }
}


export default withNavigationFocus(connect(mapStateToProps)(Pills))


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
