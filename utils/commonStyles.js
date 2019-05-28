import {StyleSheet, Platform} from 'react-native'
import * as Colors from '../utils/colors'
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper'

const commonStyles = StyleSheet.create({

// -- GENERAL ------
  container: {
    position: 'relative',
    flex: 1,
    // borderWidth: 2,
    // borderColor: 'yellow',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Colors.MAIN_BACKGROUND,
      ...ifIphoneX({paddingBottom: 0}, {paddingBottom: 20})
  },


  logoBigWrap: {
    marginTop: 30
  },

  logoBigIMG: {
    width: 120,
    height: 107,
    alignSelf: 'center'

  },

  logoSmallIMG: {
    width: 80,
    height: 71,
    alignSelf: 'center'
  },


// -- TITLES -------

  screenTitle: {
    ...Platform.select({
      ios: {
        textTransform: 'uppercase',
      }
    }),
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.MAIN_GREEN,
    fontSize: 21,
    marginBottom: 0,
  },

  subTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.GRAY_TEXT,
    marginBottom: 16,
  },



// -- BUTTONS ------
//   buttonIndents: {
//     marginBottom: 20
//   },

  disabledSubmitBtn: {
    backgroundColor: Colors.DISABLED_BG,
    borderWidth: 1,
    borderColor: Colors.DISABLED_BORDER,
  },

  disabledSubmitBtnText: {
    color: Colors.DISABLED_TEXT
  },

  btn: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    paddingLeft: 16,
    paddingRight: 16,
  },

  btn__text: {
    color: Colors.GRAY_TEXT,
    fontSize: 14,
    alignSelf: 'center'
  },

  selectBtn: {
    flexDirection: 'row'
  },

  selectBtn__caret: {
    alignSelf: 'center',
    marginTop: 2
  },

  selectBtn__text: {
    flex: 1,
  },

  captionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 56,

  },

  captionBtn__text: {
    // height: 56,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.BLUE,
    alignSelf: 'center',
  },

  submitBtn: {
    // paddingTop: 17,
    // paddingBottom: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 56,
    backgroundColor: Colors.MAIN_GREEN,
    borderWidth: 1,
    borderColor: Colors.MAIN_GREEN,
    borderRadius: 14,
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
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.WHITE,
    fontSize: 14,
  },

  socialBtnBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  facebookBtn: {
    backgroundColor: Colors.FB_COLOR,
    borderColor: Colors.FB_COLOR,
    width: '47.5%',
  },

  facebookBtn__Text: {},

  twitterBtn: {
    backgroundColor: Colors.TW_COLOR,
    borderColor: Colors.TW_COLOR,
    width: '47.5%'
  },

  twitterBtn__Text: {},

  lineTextBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  lineTextBtn__text: {
    fontSize: 16,
    color: Colors.BLACK_TITLE
  },

  lineTextBtn__textBtn:{
    color: Colors.MAIN_GREEN,
    fontWeight: 'bold',
    fontSize: 16,
  },


// -- INPUT FIELDS -----
  formInput: {
    height: 56,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    fontSize:16,
  },

  formInput__last: {
    marginBottom: 0
  },

  datePicker: {
    width: 'auto',
    height: 55.5,
  },



//  -- TABLE BLOCK ------

  tableBlock: {
    marginTop: 32,
  },

  tableBlockTitle: {
    fontSize: 12,
    color: Colors.TABLE_TITLE,
    marginBottom: 7.32,
  },
  tableBlockItem: {
    backgroundColor: Colors.WHITE,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    borderBottomWidth: 1,
    borderColor: Colors.TABLE_BORDER
  },

  tableBlockItemText: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 25,
  }

});

export default commonStyles;
