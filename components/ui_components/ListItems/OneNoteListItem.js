import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native'
import {connect} from "react-redux";
import PropTypes from 'prop-types'
import {CheckBox, Image} from "react-native-elements";
import * as Colors from "../../../utils/colors";
import PillLabel from "../PillLabel";
import ChosenLabel from "../ChosenLabel";
import DateLabel from "../../ui_components/DateLabel";

class OneNoteListItem extends Component {

  constructor(props){
    super(props);

    this.state={}
  }


  render() {

    const {noteData, hasCheckBox, index} = this.props;
    const noteLabelsID = noteData.labels || [];
    const noteImagesArr = noteData.images || [];
    const {labelsList} = this.props;

    return (
      <TouchableOpacity
        onPress={() => {this.props.handleChoosingNote(noteData.id, hasCheckBox)}}
        style={[styles.noteBody]}>
        <View>
          <DateLabel date={noteData.date}/>
          <Text style={{fontSize: 21, color: Colors.BLACK_TITLE}}>{noteData.title}</Text>
          <Text style={{fontSize: 12, color: Colors.NOTE_GREY_TEXT, marginTop: 8}}>{noteData.other}</Text>
           <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: -8}}>
             {noteLabelsID.map((item, index) => {
               return   <ChosenLabel key={index} title={labelsList[item].title} color={labelsList[item].color}/>
             })}
           </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: -8}}>
            {noteImagesArr.map((item, index) => {
              return (

                <View
                  key={index}
                  style={{borderRadius: 12, overflow: 'hidden', marginRight: 8, marginBottom: 8}}>
                  <Image
                    style={{width: 80, height: 80}}
                    source={{uri: item.url}}
                    resizeMode={'cover'}
                    PlaceholderContent={<ActivityIndicator/>}
                  />
                </View>
              )
            })}
          </View>
        </View>
      </TouchableOpacity>
    )
  }


}

function mapStateToProps (state) {

  return {
    labelsList: state.labels.labels
  }
}

export default connect(mapStateToProps)(OneNoteListItem)

const styles = StyleSheet.create({
  noteBody: {
    position: 'relative',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,

    shadowColor: Colors.BLACK_TITLE,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4
    }
  },

  pillText: {
    color: Colors.BLACK_TITLE_BTN,
    fontSize: 16,
    alignSelf: 'center',

  }
});


OneNoteListItem.propTypes = {
  noteData: PropTypes.object.isRequired,
  handleChoosingNote: PropTypes.func.isRequired,
  hasCheckBox: PropTypes.bool.isRequired,

};

OneNoteListItem.defaultProps = {
  noteData: {
    id: 'pill-id',
    title: 'Название записи',
    createdByUser: 'Пользователь который создал',
    pills: [],
    checked: false,
    other: '',
    labels: [],
    images: [],
    complaint: '',
    conclusion: '',
    date: 'дата',
    diagnosis: '',
    diseasesHistory: ''

  },
  hasCheckBox: false
};

