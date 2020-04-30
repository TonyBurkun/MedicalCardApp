import {Dimensions} from 'react-native'
import {IndicatorForm} from '../utils/dataPattern'
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


export function convertObjToArr(obj) {
  const copyObj = JSON.parse(JSON.stringify(obj));
  console.log(copyObj);
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


// export function prepareIndicatorDataForSaving(
//   patternTypeIndex = null,
//   indicatorID = null,
//   createdIndicatorID = null,
//   title = '',
//   norma = '',
//   unit = '',
//   result = '',
// ) {
//
//   const indicatorDataObj = {};
//   indicatorDataObj.inputFields = {};
//
//   indicatorDataObj.patternTypeIndex = patternTypeIndex;
//   indicatorDataObj.indicatorID = indicatorID;
//   indicatorDataObj.createdIndicatorID = createdIndicatorID;
//   indicatorDataObj.inputFields.title = title;
//   indicatorDataObj.inputFields.norma = norma;
//   indicatorDataObj.inputFields.unit = unit;
//   indicatorDataObj.inputFields.result = result;
//   indicatorDataObj.custom = !Boolean(patternTypeIndex);
//   indicatorDataObj.readyForSave = false;
//
//   return indicatorDataObj;
// }


// export function getIndicatorInReadableFormat(testTypesList, indicatorsList, date, gender) {
//   console.group();
//   console.log(testTypesList);
//   console.log(indicatorsList);
//   console.log(date);
//   console.log(gender);
//   console.groupEnd();
//
//
//   return indicatorsList.map((item) => {
//     const indicatorFields = {};
//
//     if (!Boolean(item.custom)) {
//
//       const patternTypeIndex = item.patternTypeIndex;
//       const patternIndicatorID = item.patternIndicatorID;
//       const patternTest = testTypesList[patternTypeIndex];
//       const patternIndicator = patternTest.indicators[patternIndicatorID];
//
//
//       const splitDateArr = date.split('-');
//       const MMDDYY = splitDateArr[1] + '-' + splitDateArr[0] + '-' + splitDateArr[2];
//       const dateInMilliseconds = new Date(MMDDYY).getTime();
//       const currentDateInMilliseconds = new Date().getTime();
//       const ageInMilliseconds = currentDateInMilliseconds - dateInMilliseconds;
//       const userAge = Math.round(ageInMilliseconds / 1000 / 60 / 60 / 24);
//
//
//       indicatorFields.title = patternIndicator['indicator_title'];
//       indicatorFields.unit = patternIndicator['unit'];
//
//       if (patternIndicator['norma']['global'] && patternIndicator['norma']['global'].length) {
//         // if the test types has global value which identical for both male and female
//
//         const globalNorma = patternIndicator['norma']['global'][0].value;
//
//         if (globalNorma.from === globalNorma.to) {
//           indicatorFields.norma = globalNorma.to;
//         } else {
//           indicatorFields.norma = globalNorma.from + '-' + globalNorma.to
//         }
//
//       }
//
//       if (!(patternIndicator['norma']['global'] && patternIndicator['norma']['global'].length)) {
//         // if the test types doesn't include global value and need to find the value depends on male or female and age
//         const valuesByGender = patternIndicator['norma'][gender];
//         if (Boolean(valuesByGender)) {
//           valuesByGender.map(item => {
//
//             if (item.from <= userAge && userAge <= item.to) {
//
//               if (item.value.from === item.value.to) {
//                 indicatorFields.norma = item.value.to
//               }
//               if (item.value.from !== item.value.to) {
//                 indicatorFields.norma = item.value.from + '-' + item.value.to
//               }
//
//             }
//           })
//         }
//
//       }
//
//       indicatorFields.result = item.inputFields.result;
//     }
//
//     if (Boolean(item.custom)) {
//       indicatorFields.title = item.inputFields.title;
//       indicatorFields.unit = item.inputFields.unit;
//       indicatorFields.norma = item.inputFields.norma;
//       indicatorFields.result = item.inputFields.result;
//     }
//
//
//     return indicatorFields;
//   })
//
// }


export function sortArrByObjectProp(arr, objProp) {
  arr.sort((a, b) => {
    let propA = a[objProp].toLowerCase(), propB = b[objProp].toLowerCase();
    if (propA < propB) //сортируем строки по возрастанию
      return -1;
    if (propA > propB)
      return 1;
    return 0 // Никакой сортировки
  });
  console.log(arr);
  return arr;
}


export function getIndicatorsArrForShow(currentTestTypeObj = {}, userAge, userGender) {

  let age = userAge;
  let gender = userGender;
  function _getTestFieldsValue (item = null, currentTestTypeID, gender){

    let indicatorFields = new IndicatorForm();
    // let indicatorFields = {
    //   testTypeID: null,
    //   indicatorID: null,
    //   customIndicatorID: null,
    //   inputFields: {
    //     title: '',
    //     unit: '',
    //     norma: '',
    //     result: '',
    //   },
    //   custom: false,
    // };

    indicatorFields.testTypeID = currentTestTypeID;


    if (Boolean(item)) {
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



        // valuesByGender.forEach(item => {
        //   console.log(item['from'], userAge, item['to']);
        //   console.log(userAge);
        //   indicatorFields.inputFields.norma = item;
        //   if ( item['from'] < userAge && userAge < item['to']){
        //
        //     // if (item.value['from'] === item.value['to']) {
        //     //   indicatorFields.inputFields['norma'] = item.value['to']
        //     // }
        //     // if (item.value['from'] !== item.value['to']) {
        //     //   indicatorFields.inputFields['norma'] = item.value['from'] + '-' + item.value['to']
        //     // }
        //
        //   }
        // });


        // console.log(valuesByUserAgeArr);
        // indicatorFields.inputFields['norma'] =  valuesByUserAgeArr.value['from'] + '-' + valuesByUserAgeArr.value['to'];
        //
        // if (valuesByUserAgeArr.value['from'] === valuesByUserAgeArr.value['to']) {
        //   indicatorFields.inputFields['norma'] = valuesByUserAgeArr.value['to']
        // }
        // if (valuesByUserAgeArr.value['from'] !== valuesByUserAgeArr.value['to']) {
        //   indicatorFields.inputFields['norma'] = valuesByUserAgeArr.value['from'] + '-' + valuesByUserAgeArr.value['to']
        // }

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



export function getTestTypeID(chosenTestTypeArr, formedTestTypesList){

  let indexChosenTestType = chosenTestTypeArr[0];

  let formedTestTypeListArr = convertObjToArr(formedTestTypesList);
  console.log(formedTestTypeListArr);

  let chosenTestTypeObj = formedTestTypeListArr[indexChosenTestType];

  return chosenTestTypeObj.id;

}
