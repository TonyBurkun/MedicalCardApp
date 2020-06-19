import {Dimensions} from 'react-native'
import {IndicatorForm} from '../utils/dataPattern'

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

export function convertObjToArr(obj) {
  const copyObj = JSON.parse(JSON.stringify(obj));
  const objListKeys = Object.keys(copyObj);

  return objListKeys.map((item) => {
    return copyObj[item];
  });

}

export function addCheckFieldToArr(arr) {
  const copyArr = JSON.parse(JSON.stringify(arr));

  return copyArr.map((item) => {
    item.checked = false;
    return item;
  });
}

export function setChosenItemInArr(arr, chosenIdArr) {
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

export function setInverseChosenItemInArr(arr, id) {
  const copyArr = JSON.parse(JSON.stringify(arr));

  copyArr.forEach((item) => {
    if (item.id === id) {
      item.checked = !item.checked;
    }
  });

  return copyArr;
}

export function updateUserDataFields(newUserFieldsObj, prevUserFieldsObj) {
  for (let key in newUserFieldsObj) {
    if (newUserFieldsObj.hasOwnProperty(key)) {
      prevUserFieldsObj[key] = newUserFieldsObj[key]
    }
  }

  return prevUserFieldsObj;
}


export function sortArrByObjectProp(arr, objProp) {
  arr.sort((a, b) => {
    let propA = a[objProp].toLowerCase(), propB = b[objProp].toLowerCase();
    if (propA < propB) //сортируем строки по возрастанию
      return -1;
    if (propA > propB)
      return 1;
    return 0 // Никакой сортировки
  });
  return arr;
}


export function getUserAgeInMilliseconds(userDate){
  const splitDateArr = userDate.split('-');
  const [day, month, year] = splitDateArr;

  const dateInMilliseconds = new Date(year, month, day).getTime();
  const currentDateInMilliseconds = new Date().getTime();

  const ageInMilliseconds = currentDateInMilliseconds - dateInMilliseconds;

  return Math.round(ageInMilliseconds / 1000 / 60 / 60 / 24);
}

export function getIndicatorsArrForShow(currentTestTypeObj = {}, userAge, userGender) {

  let age = userAge;
  let gender = userGender;
  function _getTestFieldsValue (item = null, currentTestTypeID, gender){

    let indicatorFields = new IndicatorForm();
    indicatorFields.testTypeID = currentTestTypeID;


    if (Boolean(item)) {
      console.log(item);
      indicatorFields.indicatorID = item.id;
      indicatorFields.inputFields.title = item['indicator_title'];
      indicatorFields.inputFields.unit = item['unit'];



      if (item['norma']['global'] && item['norma']['global'].length) {
        // if the test types has global value which identical for both male and female

        const globalNorma = item['norma']['global'][0].value;

        if (globalNorma['from'] === globalNorma['to']) {
          indicatorFields.inputFields['norma'] = globalNorma['to'];
        } else {
          indicatorFields.inputFields['norma'] = globalNorma['from'] + '-' + globalNorma['to']
        }

        return indicatorFields;

      }

      if (Boolean(item['norma'][gender])) {
        // if the test types doesn't include global value and need to find the value depends on male or female and age
        const valuesByGender = item['norma'][gender];

        let normaValueForShow = '';

        let valuesByUserAge = valuesByGender.find(item => {
          return (item['from'] <= age && age <= item['to'])
        });



        if (valuesByUserAge.value['from'] === valuesByUserAge.value['to']) {
          normaValueForShow = valuesByUserAge.value['to']
        } else {
          normaValueForShow = valuesByUserAge.value['from'] + '-' + valuesByUserAge.value['to']
        }

        indicatorFields.inputFields['norma'] = normaValueForShow;

        return indicatorFields;
      }
    }
  }

  let indicatorsArrForShow = [];

  if (currentTestTypeObj['indicators']) {
    const indicatorsArr = currentTestTypeObj['indicators'];
    indicatorsArrForShow = indicatorsArr.map((item) => {
      return _getTestFieldsValue(item, currentTestTypeObj.id, gender);
    });

    return indicatorsArrForShow;

  } else {
    let indicatorFields = new IndicatorForm();
    indicatorFields.custom = true;
    indicatorFields.testTypeID = 'test_type_0';


    indicatorsArrForShow.push(indicatorFields);
    return indicatorsArrForShow;
  }
}

export function getFormedTestTypesList(testTypesList, userAge, gender){
  let formedTestTypesListObj = {};

  for (let i = 0; i < testTypesList.length; i++) {
    let currentTestTypeObj = testTypesList[i];
    let formedTestTypeObj = {};

    formedTestTypeObj.title = currentTestTypeObj.title;
    formedTestTypeObj.id = currentTestTypeObj.id;
    formedTestTypeObj.indicators = getIndicatorsArrForShow(currentTestTypeObj, userAge, gender);

    formedTestTypesListObj[formedTestTypeObj.id] = formedTestTypeObj;
  }
  return formedTestTypesListObj;
}


export function getTestTypeID(chosenTestTypeArr, formedTestTypesList){
  let indexChosenTestType = chosenTestTypeArr[0];
  let formedTestTypeListArr = convertObjToArr(formedTestTypesList);
  let chosenTestTypeObj = formedTestTypeListArr[indexChosenTestType];

  return chosenTestTypeObj.id;
}

export function getTestTypeIndexByID(testTypeID, formedTestTypesList) {
  let formedTestTypesListArr = convertObjToArr(formedTestTypesList);
  return formedTestTypesListArr.findIndex(item => {
    return item.id === testTypeID;
  });
}


export function sortIndicatorsListForShowByFilledFields(indicatorsListForShow){
  let customIndicators = indicatorsListForShow.filter(item => {
    return item.custom === true;
  });

  let noEmptyIndicatorsPattern = indicatorsListForShow.filter(item => {
    return item.custom === false && item.inputFields.result.length > 0;
  });


  let emptyIndicatorsPattern = indicatorsListForShow.filter(item => {
    return item.custom === false && item.inputFields.result.length === 0;
  });


  return  [...customIndicators, ...noEmptyIndicatorsPattern, ...emptyIndicatorsPattern]


};
