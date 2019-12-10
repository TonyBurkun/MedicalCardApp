import {Dimensions} from 'react-native'
import {generateUniqID} from "./API";

export function isIphone5() {
  const windowHeight = Dimensions.get('window').height;

  return windowHeight === 568;
}


export function getCurrentDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = `${dd}-${mm}-${yyyy}`;

  return today;
}


export function convertObjToArr (obj){
  const copyObj = JSON.parse(JSON.stringify(obj));
  const objListKeys = Object.keys(copyObj);

  return objListKeys.map((item) => {
    return copyObj[item];
  });

}

export function addCheckFieldToArr(arr){
  const copyArr = JSON.parse(JSON.stringify(arr));

  return copyArr.map((item) => {
    item.checked = false;
    return item;
  });
}

export function setChosenItemInArr(arr, chosenIdArr){
  const copyArr = JSON.parse(JSON.stringify(arr));

  chosenIdArr.forEach((id) => {
    copyArr.forEach((item) => {
      if (item.id === id) {
        item.checked = true;
      }
    })
  });

  return copyArr;
}

export function setInverseChosenItemInArr(arr, id){
  const copyArr = JSON.parse(JSON.stringify(arr));

  copyArr.forEach((item) => {
    if (item.id === id) {
      item.checked = !item.checked;
    }
  });

  return copyArr;
}

export function updateUserDataFields(newUserFieldsObj, prevUserFieldsObj){
  for (let key in newUserFieldsObj) {
    if (newUserFieldsObj.hasOwnProperty(key)) {
      prevUserFieldsObj[key] = newUserFieldsObj[key]
    }
  }

  return  prevUserFieldsObj;
}


export function prepareIndicatorDataForSaving(
  patternTypeID = null,
  patternIndicatorID = null,
  createdIndicatorID = null,
  title = '',
  norma = '',
  unit = '',
  result = '',
) {

  const indicatorDataObj = {};
  indicatorDataObj.inputFields = {};

  indicatorDataObj.patternTypeID = patternTypeID;
  indicatorDataObj.patternIndicatorID = patternIndicatorID;
  indicatorDataObj.createdIndicatorID = createdIndicatorID;
  indicatorDataObj.inputFields.title = title;
  indicatorDataObj.inputFields.norma = norma;
  indicatorDataObj.inputFields.unit = unit;
  indicatorDataObj.inputFields.result = result;
  indicatorDataObj.custom = !Boolean(patternTypeID);
  indicatorDataObj.readyForSave = false;

  return indicatorDataObj;
}
