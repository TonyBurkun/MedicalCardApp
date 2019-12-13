import {Dimensions} from 'react-native'

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


export function getIndicatorInReadableFormat(testTypesList, indicatorsList, date, gender) {
  // console.group();
  // console.log(testTypesList);
  // console.log(indicatorsList);
  // console.log(date);
  // console.log(gender);
  // console.groupEnd();


  return indicatorsList.map((item) => {
    const patternTypeID = item.patternTypeID;
    const patternIndicatorID = item.patternIndicatorID;
    const patternTest = testTypesList[patternTypeID];
    const patternIndicator = patternTest.indicators[patternIndicatorID];


    const splitDateArr = date.split('-');
    const MMDDYY = splitDateArr[1] + '-' + splitDateArr[0] + '-' + splitDateArr[2];

    const dateInMilliseconds = new Date(MMDDYY).getTime();
    const currentDateInMilliseconds = new Date().getTime();


    const ageInMilliseconds = currentDateInMilliseconds - dateInMilliseconds;
    const userAge = Math.round(ageInMilliseconds / 1000 / 60 / 60 / 24);

    const indicatorFields = {};

    if (!Boolean(item.custom)) {
      indicatorFields.title = patternIndicator['indicator_title'];
      indicatorFields.unit = patternIndicator['unit'];

      if (patternIndicator['norma']['global'] && patternIndicator['norma']['global'].length) {
        // if the test types has global value which identical for both male and female

        const globalNorma = patternIndicator['norma']['global'][0].value;

        if (globalNorma.from === globalNorma.to) {
          indicatorFields.norma = globalNorma.to;
        } else {
          indicatorFields.norma = globalNorma.from + '-' + globalNorma.to
        }

      }

      if (!(patternIndicator['norma']['global'] && patternIndicator['norma']['global'].length)) {
        // if the test types doesn't include global value and need to find the value depends on male or female and age
        const valuesByGender = patternIndicator['norma'][gender];
        if (Boolean(valuesByGender)) {
          valuesByGender.map(item => {

            if (item.from <= userAge && userAge <= item.to) {

              if (item.value.from === item.value.to) {
                indicatorFields.norma = item.value.to
              }
              if (item.value.from !== item.value.to) {
                indicatorFields.norma = item.value.from + '-' + item.value.to
              }

            }
          })
        }

      }

      indicatorFields.result = item.inputFields.result;
    }

    if (Boolean(item.custom)) {
      indicatorFields.title = item.inputFields.title;
      indicatorFields.unit = item.inputFields.unit;
      indicatorFields.norma = item.inputFields.norma;
      indicatorFields.result = item.inputFields.result;
    }


    return indicatorFields;
  })

}
