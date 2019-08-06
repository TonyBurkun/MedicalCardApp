import React, {Component, Fragment} from 'react'
import {View, Text, ScrollView} from 'react-native'
import PropTypes from 'prop-types'
import {ListItem, CheckBox, Icon, SearchBar} from "react-native-elements";
import {withNavigation} from 'react-navigation'
import * as Colors from "../../../utils/colors";
import commonStyles from '../../../utils/commonStyles'





class CustomList extends Component{

  constructor(props){
    super(props);

    this.state = {
      search: '',
      doctorSpecializationsOrigin: [],
      data: [],
      chosenSpecializationIDArr: [],
    }
  }

  componentDidMount(){
    const {data, chosenItemsID} = this.props;
    const dataObj = data.map((item, index) => {
      return  {
        id: index,
        value: item,
        checked: false,
      }
    });

    if (chosenItemsID) {
      chosenItemsID.forEach((item) => {
        dataObj[item].checked = true;
      })
    }

    this.setState({
      doctorSpecializationsOrigin: dataObj,
      data: dataObj,
    });
  }



  updateSearch = search => {
    this.setState({ search });

    const searchVal = search;
    const listArr = this.state.doctorSpecializationsOrigin;

    if (searchVal !== '') {
      const searchResultArr = listArr.filter((item) => {
        const value = item.value.toLowerCase();

        return ~value.indexOf(searchVal.toLowerCase());
      });

      this.setState({
        ...this.state,
        search,
        data : searchResultArr
      })
    } else {
      this.setState({
        ...this.state,
        search,
        data : this.state.doctorSpecializationsOrigin
      })
    }

  };

  onPressListItem = (index) => {

    const {data, doctorSpecializationsOrigin, chosenSpecializationIDArr} = this.state;
    data[index].checked =  !data[index].checked;

    this.setState({
      data: data,
      chosenSpecializationIDArr: chosenSpecializationIDArr,
    });

    const activeItemsArr = [];

    doctorSpecializationsOrigin.forEach((item) => {
      if(item.checked) {
        activeItemsArr.push(item.id)
      }
    });


    const {route} = this.props;
    this.props.navigation.navigate(route, {type: 'checkItem', data: activeItemsArr, prevData: this.props.chosenItemsID})
  };

  render() {

    const {data, search} = this.state;

    // console.log(this.state);
    // console.log(this.props);
    return (


      <Fragment>
        <SearchBar
          placeholder="Поиск по названию"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0 }}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />
        {
          data.length ? (
            <ScrollView style={{backgroundColor: Colors.WHITE, paddingLeft: 16}}>
              {
                data.map((item, index) => {
                  return (
                    <ListItem
                      key={item.id}
                      title={item.value}
                      onPress={() => {this.onPressListItem(index)}}
                      containerStyle={{paddingTop: 19, paddingBottom: 19, paddingLeft: 0, paddingRight: 16,}}
                      titleStyle={{fontSize: 14}}
                      bottomDivider={true}
                      rightAvatar={
                        <CheckBox
                          checked={item.checked}
                          onPress={() => {this.onPressListItem(index)}}
                          iconType='material'
                          checkedIcon='done'
                          uncheckedIcon='done'
                          uncheckedColor={Colors.WHITE}
                          checkedColor={Colors.MAIN_GREEN}
                          containerStyle={{margin: 0, padding: 0 }}
                        />
                      }
                    />
                  )


                })
              }
            </ScrollView>
          ) : (
            <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16,}}>
              <Text>К сожалению, список пуст</Text>
            </View>
          )
        }
      </Fragment>
    )
  }
}

CustomList.propTypes = {
  data: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  chosenItemsID: PropTypes.array.isRequired,
};

CustomList.defaultProps = {
  data: [],
  chosenItemsID: [],
};


export default withNavigation(CustomList)
