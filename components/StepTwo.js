import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Button,
  Platform,
  Picker,
  ScrollView,
  Dimensions
} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import * as Colors from '../utils/colors'
import commonStyles from '../utils/commonStyles'
import {signOut, getUIDfromFireBase, updateUserData, getMetricsByTitle} from '../utils/API'
import validationChecker from '../utils/validationChecker'
// import DatePicker from 'react-native-datepicker'
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper'
import InternetNotification from '../components/ui_components/InternetNotification'


import StepScreenTitle from './ui_components/StepScreenTitle'
import ScreenTitle from './ui_components/ScreenTitle'
import SelectList from './ui_components/SelectList';
import firebase from 'react-native-firebase'





const windowHeight = Dimensions.get('window').height;

export default class StepTwo extends Component {
  constructor(props) {
    super(props);

    const statusBarHeight = getStatusBarHeight();
    const bottomSpace = getBottomSpace();

    this.state = {
      bloodTypes: [
        {
          value: '1+',
          selected: false

        },
        {
          value: '1-',
          selected: false

        },
        {
          value: '2+',
          selected: false

        },
        {
          value: '2-',
          selected: false

        },
        {
          value: '3+',
          selected: false

        },
        {
          value: '3-',
          selected: false

        },
        {
          value: '4+',
          selected: false

        },
        {
          value: '4-',
          selected: false

        }

      ],
      weightOptions: [],
      heightOptions: [],
      formData: {
        BloodType: '',
        weight: '',
        height: '',
      },
      screenHeight: statusBarHeight + bottomSpace,

    }

  }

  componentDidMount(){


    getMetricsByTitle('weight')
      .then(result => {
        this.setState({
          weightOptions: result
        })
      });

    getMetricsByTitle('height')
      .then(result => {
        this.setState({
          heightOptions: result
        })
      });
  }

  handleBloodTypeChoice(index) {

    const clickedBtnIndex = index;

    let bloodTypesArr = this.state.bloodTypes;
    const bloodTypesActiveVal = bloodTypesArr[clickedBtnIndex].value;

    bloodTypesArr.forEach((carrentVal) => {
      carrentVal.selected = false;
    });

    bloodTypesArr[clickedBtnIndex].selected = true;


    this.setState({
      ...this.state,
      ...this.state.bloodTypes.bloodTypesArr,
      formData: {
        ...this.state.formData,
        BloodType: bloodTypesActiveVal

      }
    })

  }

  handleSelectValue = (selectValInState, selectValue) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [selectValInState]: selectValue
      }

    })
  };

  handleSubmitForm = () => {
    console.log('sumbit form');

    const fieldsForUpdateObj = this.state.formData;
    updateUserData(fieldsForUpdateObj);


    this.props.navigation.navigate('MedicalCardStart');


  };

  // handleLogOut = () => {
  //   const {navigation} = this.props;
  //   signOut(navigation);
  // };

  handlePassBtn= () => {
    this.props.navigation.navigate('MedicalCardStart');
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      ...this.state,
      screenHeight: this.state.screenHeight + contentHeight
    })
  };


  render() {
    const userID = getUIDfromFireBase();

    // console.log(this.state.screenHeight);
    // console.log(windowHeight);


    const scrollEnabled = this.state.screenHeight > windowHeight;
    const {weightOptions, heightOptions} = this.state;
    const {weight, height, BloodType} = this.state.formData;
    const isEnabled = weight.length > 0 && height.length > 0 && BloodType.length > 0;
    // let weightOptions = ["0 кг","0.5 кг","1 кг","1.5 кг","2 кг","2.5 кг","3 кг","3.5 кг","4 кг","4.5 кг","5 кг","5.5 кг","6 кг","6.5 кг","7 кг","7.5 кг","8 кг","8.5 кг","9 кг","9.5 кг","10 кг","10.5 кг","11 кг","11.5 кг","12 кг","12.5 кг","13 кг","13.5 кг","14 кг","14.5 кг","15 кг","15.5 кг","16 кг","16.5 кг","17 кг","17.5 кг","18 кг","18.5 кг","19 кг","19.5 кг","20 кг","20.5 кг","21 кг","21.5 кг","22 кг","22.5 кг","23 кг","23.5 кг","24 кг","24.5 кг","25 кг","25.5 кг","26 кг","26.5 кг","27 кг","27.5 кг","28 кг","28.5 кг","29 кг","29.5 кг","30 кг","30.5 кг","31 кг","31.5 кг","32 кг","32.5 кг","33 кг","33.5 кг","34 кг","34.5 кг","35 кг","35.5 кг","36 кг","36.5 кг","37 кг","37.5 кг","38 кг","38.5 кг","39 кг","39.5 кг","40 кг","40.5 кг","41 кг","41.5 кг","42 кг","42.5 кг","43 кг","43.5 кг","44 кг","44.5 кг","45 кг","45.5 кг","46 кг","46.5 кг","47 кг","47.5 кг","48 кг","48.5 кг","49 кг","49.5 кг","50 кг","50.5 кг","51 кг","51.5 кг","52 кг","52.5 кг","53 кг","53.5 кг","54 кг","54.5 кг","55 кг","55.5 кг","56 кг","56.5 кг","57 кг","57.5 кг","58 кг","58.5 кг","59 кг","59.5 кг","60 кг","60.5 кг","61 кг","61.5 кг","62 кг","62.5 кг","63 кг","63.5 кг","64 кг","64.5 кг","65 кг","65.5 кг","66 кг","66.5 кг","67 кг","67.5 кг","68 кг","68.5 кг","69 кг","69.5 кг","70 кг","70.5 кг","71 кг","71.5 кг","72 кг","72.5 кг","73 кг","73.5 кг","74 кг","74.5 кг","75 кг","75.5 кг","76 кг","76.5 кг","77 кг","77.5 кг","78 кг","78.5 кг","79 кг","79.5 кг","80 кг","80.5 кг","81 кг","81.5 кг","82 кг","82.5 кг","83 кг","83.5 кг","84 кг","84.5 кг","85 кг","85.5 кг","86 кг","86.5 кг","87 кг","87.5 кг","88 кг","88.5 кг","89 кг","89.5 кг","90 кг","90.5 кг","91 кг","91.5 кг","92 кг","92.5 кг","93 кг","93.5 кг","94 кг","94.5 кг","95 кг","95.5 кг","96 кг","96.5 кг","97 кг","97.5 кг","98 кг","98.5 кг","99 кг","99.5 кг","100 кг","100.5 кг","101 кг","101.5 кг","102 кг","102.5 кг","103 кг","103.5 кг","104 кг","104.5 кг","105 кг","105.5 кг","106 кг","106.5 кг","107 кг","107.5 кг","108 кг","108.5 кг","109 кг","109.5 кг","110 кг","110.5 кг","111 кг","111.5 кг","112 кг","112.5 кг","113 кг","113.5 кг","114 кг","114.5 кг","115 кг","115.5 кг","116 кг","116.5 кг","117 кг","117.5 кг","118 кг","118.5 кг","119 кг","119.5 кг","120 кг","120.5 кг","121 кг","121.5 кг","122 кг","122.5 кг","123 кг","123.5 кг","124 кг","124.5 кг","125 кг","125.5 кг","126 кг","126.5 кг","127 кг","127.5 кг","128 кг","128.5 кг","129 кг","129.5 кг","130 кг","130.5 кг","131 кг","131.5 кг","132 кг","132.5 кг","133 кг","133.5 кг","134 кг","134.5 кг","135 кг","135.5 кг","136 кг","136.5 кг","137 кг","137.5 кг","138 кг","138.5 кг","139 кг","139.5 кг","140 кг","140.5 кг","141 кг","141.5 кг","142 кг","142.5 кг","143 кг","143.5 кг","144 кг","144.5 кг","145 кг","145.5 кг","146 кг","146.5 кг","147 кг","147.5 кг","148 кг","148.5 кг","149 кг","149.5 кг","150 кг","150.5 кг","151 кг","151.5 кг","152 кг","152.5 кг","153 кг","153.5 кг","154 кг","154.5 кг","155 кг","155.5 кг","156 кг","156.5 кг","157 кг","157.5 кг","158 кг","158.5 кг","159 кг","159.5 кг","160 кг","160.5 кг","161 кг","161.5 кг","162 кг","162.5 кг","163 кг","163.5 кг","164 кг","164.5 кг","165 кг","165.5 кг","166 кг","166.5 кг","167 кг","167.5 кг","168 кг","168.5 кг","169 кг","169.5 кг","170 кг","170.5 кг","171 кг","171.5 кг","172 кг","172.5 кг","173 кг","173.5 кг","174 кг","174.5 кг","175 кг","175.5 кг","176 кг","176.5 кг","177 кг","177.5 кг","178 кг","178.5 кг","179 кг","179.5 кг","180 кг","180.5 кг","181 кг","181.5 кг","182 кг","182.5 кг","183 кг","183.5 кг","184 кг","184.5 кг","185 кг","185.5 кг","186 кг","186.5 кг","187 кг","187.5 кг","188 кг","188.5 кг","189 кг","189.5 кг","190 кг","190.5 кг","191 кг","191.5 кг","192 кг","192.5 кг","193 кг","193.5 кг","194 кг","194.5 кг","195 кг","195.5 кг","196 кг","196.5 кг","197 кг","197.5 кг","198 кг","198.5 кг","199 кг","199.5 кг","200 кг","200.5 кг","201 кг","201.5 кг","202 кг","202.5 кг","203 кг","203.5 кг","204 кг","204.5 кг","205 кг","205.5 кг","206 кг","206.5 кг","207 кг","207.5 кг","208 кг","208.5 кг","209 кг","209.5 кг","210 кг","210.5 кг","211 кг","211.5 кг","212 кг","212.5 кг","213 кг","213.5 кг","214 кг","214.5 кг","215 кг","215.5 кг","216 кг","216.5 кг","217 кг","217.5 кг","218 кг","218.5 кг","219 кг","219.5 кг","220 кг","220.5 кг","221 кг","221.5 кг","222 кг","222.5 кг","223 кг","223.5 кг","224 кг","224.5 кг","225 кг","225.5 кг","226 кг","226.5 кг","227 кг","227.5 кг","228 кг","228.5 кг","229 кг","229.5 кг","230 кг","230.5 кг","231 кг","231.5 кг","232 кг","232.5 кг","233 кг","233.5 кг","234 кг","234.5 кг","235 кг","235.5 кг","236 кг","236.5 кг","237 кг","237.5 кг","238 кг","238.5 кг","239 кг","239.5 кг","240 кг","240.5 кг","241 кг","241.5 кг","242 кг","242.5 кг","243 кг","243.5 кг","244 кг","244.5 кг","245 кг","245.5 кг","246 кг","246.5 кг","247 кг","247.5 кг","248 кг","248.5 кг","249 кг","249.5 кг","250 кг","250.5 кг","251 кг","251.5 кг","252 кг","252.5 кг","253 кг","253.5 кг","254 кг","254.5 кг","255 кг","255.5 кг","256 кг","256.5 кг","257 кг","257.5 кг","258 кг","258.5 кг","259 кг","259.5 кг","260 кг","260.5 кг","261 кг","261.5 кг","262 кг","262.5 кг","263 кг","263.5 кг","264 кг","264.5 кг","265 кг","265.5 кг","266 кг","266.5 кг","267 кг","267.5 кг","268 кг","268.5 кг","269 кг","269.5 кг","270 кг","270.5 кг","271 кг","271.5 кг","272 кг","272.5 кг","273 кг","273.5 кг","274 кг","274.5 кг","275 кг","275.5 кг","276 кг","276.5 кг","277 кг","277.5 кг","278 кг","278.5 кг","279 кг","279.5 кг","280 кг","280.5 кг","281 кг","281.5 кг","282 кг","282.5 кг","283 кг","283.5 кг","284 кг","284.5 кг","285 кг","285.5 кг","286 кг","286.5 кг","287 кг","287.5 кг","288 кг","288.5 кг","289 кг","289.5 кг","290 кг","290.5 кг","291 кг","291.5 кг","292 кг","292.5 кг","293 кг","293.5 кг","294 кг","294.5 кг","295 кг","295.5 кг","296 кг","296.5 кг","297 кг","297.5 кг","298 кг","298.5 кг","299 кг","299.5 кг","300 кг","300.5 кг","301 кг","301.5 кг","302 кг","302.5 кг","303 кг","303.5 кг","304 кг","304.5 кг","305 кг","305.5 кг","306 кг","306.5 кг","307 кг","307.5 кг","308 кг","308.5 кг","309 кг","309.5 кг","310 кг","310.5 кг","311 кг","311.5 кг","312 кг","312.5 кг","313 кг","313.5 кг","314 кг","314.5 кг","315 кг","315.5 кг","316 кг","316.5 кг","317 кг","317.5 кг","318 кг","318.5 кг","319 кг","319.5 кг","320 кг","320.5 кг","321 кг","321.5 кг","322 кг","322.5 кг","323 кг","323.5 кг","324 кг","324.5 кг","325 кг","325.5 кг","326 кг","326.5 кг","327 кг","327.5 кг","328 кг","328.5 кг","329 кг","329.5 кг","330 кг","330.5 кг","331 кг","331.5 кг","332 кг","332.5 кг","333 кг","333.5 кг","334 кг","334.5 кг","335 кг","335.5 кг","336 кг","336.5 кг","337 кг","337.5 кг","338 кг","338.5 кг","339 кг","339.5 кг","340 кг","340.5 кг","341 кг","341.5 кг","342 кг","342.5 кг","343 кг","343.5 кг","344 кг","344.5 кг","345 кг","345.5 кг","346 кг","346.5 кг","347 кг","347.5 кг","348 кг","348.5 кг","349 кг","349.5 кг","350 кг","350.5 кг","351 кг","351.5 кг","352 кг","352.5 кг","353 кг","353.5 кг","354 кг","354.5 кг","355 кг","355.5 кг","356 кг","356.5 кг","357 кг","357.5 кг","358 кг","358.5 кг","359 кг","359.5 кг","360 кг","360.5 кг","361 кг","361.5 кг","362 кг","362.5 кг","363 кг","363.5 кг","364 кг","364.5 кг","365 кг","365.5 кг","366 кг","366.5 кг","367 кг","367.5 кг","368 кг","368.5 кг","369 кг","369.5 кг","370 кг","370.5 кг","371 кг","371.5 кг","372 кг","372.5 кг","373 кг","373.5 кг","374 кг","374.5 кг","375 кг","375.5 кг","376 кг","376.5 кг","377 кг","377.5 кг","378 кг","378.5 кг","379 кг","379.5 кг","380 кг","380.5 кг","381 кг","381.5 кг","382 кг","382.5 кг","383 кг","383.5 кг","384 кг","384.5 кг","385 кг","385.5 кг","386 кг","386.5 кг","387 кг","387.5 кг","388 кг","388.5 кг","389 кг","389.5 кг","390 кг","390.5 кг","391 кг","391.5 кг","392 кг","392.5 кг","393 кг","393.5 кг","394 кг","394.5 кг","395 кг","395.5 кг","396 кг","396.5 кг","397 кг","397.5 кг","398 кг","398.5 кг","399 кг","399.5 кг","400 кг","400.5 кг","401 кг","401.5 кг","402 кг","402.5 кг","403 кг","403.5 кг","404 кг","404.5 кг","405 кг","405.5 кг","406 кг","406.5 кг","407 кг","407.5 кг","408 кг","408.5 кг","409 кг","409.5 кг","410 кг","410.5 кг","411 кг","411.5 кг","412 кг","412.5 кг","413 кг","413.5 кг","414 кг","414.5 кг","415 кг","415.5 кг","416 кг","416.5 кг","417 кг","417.5 кг","418 кг","418.5 кг","419 кг","419.5 кг","420 кг","420.5 кг","421 кг","421.5 кг","422 кг","422.5 кг","423 кг","423.5 кг","424 кг","424.5 кг","425 кг","425.5 кг","426 кг","426.5 кг","427 кг","427.5 кг","428 кг","428.5 кг","429 кг","429.5 кг","430 кг","430.5 кг","431 кг","431.5 кг","432 кг","432.5 кг","433 кг","433.5 кг","434 кг","434.5 кг","435 кг","435.5 кг","436 кг","436.5 кг","437 кг","437.5 кг","438 кг","438.5 кг","439 кг","439.5 кг","440 кг","440.5 кг","441 кг","441.5 кг","442 кг","442.5 кг","443 кг","443.5 кг","444 кг","444.5 кг","445 кг","445.5 кг","446 кг","446.5 кг","447 кг","447.5 кг","448 кг","448.5 кг","449 кг","449.5 кг","450 кг","450.5 кг","451 кг","451.5 кг","452 кг","452.5 кг","453 кг","453.5 кг","454 кг","454.5 кг","455 кг","455.5 кг","456 кг","456.5 кг","457 кг","457.5 кг","458 кг","458.5 кг","459 кг","459.5 кг","460 кг","460.5 кг","461 кг","461.5 кг","462 кг","462.5 кг","463 кг","463.5 кг","464 кг","464.5 кг","465 кг","465.5 кг","466 кг","466.5 кг","467 кг","467.5 кг","468 кг","468.5 кг","469 кг","469.5 кг","470 кг","470.5 кг","471 кг","471.5 кг","472 кг","472.5 кг","473 кг","473.5 кг","474 кг","474.5 кг","475 кг","475.5 кг","476 кг","476.5 кг","477 кг","477.5 кг","478 кг","478.5 кг","479 кг","479.5 кг","480 кг","480.5 кг","481 кг","481.5 кг","482 кг","482.5 кг","483 кг","483.5 кг","484 кг","484.5 кг","485 кг","485.5 кг","486 кг","486.5 кг","487 кг","487.5 кг","488 кг","488.5 кг","489 кг","489.5 кг","490 кг","490.5 кг","491 кг","491.5 кг","492 кг","492.5 кг","493 кг","493.5 кг","494 кг","494.5 кг","495 кг","495.5 кг","496 кг","496.5 кг","497 кг","497.5 кг","498 кг","498.5 кг","499 кг","499.5 кг","500 кг","500.5 кг","501 кг","501.5 кг","502 кг","502.5 кг","503 кг","503.5 кг","504 кг","504.5 кг","505 кг","505.5 кг","506 кг","506.5 кг","507 кг","507.5 кг","508 кг","508.5 кг","509 кг","509.5 кг","510 кг","510.5 кг","511 кг","511.5 кг","512 кг","512.5 кг","513 кг","513.5 кг","514 кг","514.5 кг","515 кг","515.5 кг","516 кг","516.5 кг","517 кг","517.5 кг","518 кг","518.5 кг","519 кг","519.5 кг","520 кг","520.5 кг","521 кг","521.5 кг","522 кг","522.5 кг","523 кг","523.5 кг","524 кг","524.5 кг","525 кг","525.5 кг","526 кг","526.5 кг","527 кг","527.5 кг","528 кг","528.5 кг","529 кг","529.5 кг","530 кг","530.5 кг","531 кг","531.5 кг","532 кг","532.5 кг","533 кг","533.5 кг","534 кг","534.5 кг","535 кг","535.5 кг","536 кг","536.5 кг","537 кг","537.5 кг","538 кг","538.5 кг","539 кг","539.5 кг","540 кг","540.5 кг","541 кг","541.5 кг","542 кг","542.5 кг","543 кг","543.5 кг","544 кг","544.5 кг","545 кг","545.5 кг","546 кг","546.5 кг","547 кг","547.5 кг","548 кг","548.5 кг","549 кг","549.5 кг","550 кг","550.5 кг","551 кг","551.5 кг","552 кг","552.5 кг","553 кг","553.5 кг","554 кг","554.5 кг","555 кг","555.5 кг","556 кг","556.5 кг","557 кг","557.5 кг","558 кг","558.5 кг","559 кг","559.5 кг","560 кг","560.5 кг","561 кг","561.5 кг","562 кг","562.5 кг","563 кг","563.5 кг","564 кг","564.5 кг","565 кг","565.5 кг","566 кг","566.5 кг","567 кг","567.5 кг","568 кг","568.5 кг","569 кг","569.5 кг","570 кг","570.5 кг","571 кг","571.5 кг","572 кг","572.5 кг","573 кг","573.5 кг","574 кг","574.5 кг","575 кг","575.5 кг","576 кг","576.5 кг","577 кг","577.5 кг","578 кг","578.5 кг","579 кг","579.5 кг","580 кг","580.5 кг","581 кг","581.5 кг","582 кг","582.5 кг","583 кг","583.5 кг","584 кг","584.5 кг","585 кг","585.5 кг","586 кг","586.5 кг","587 кг","587.5 кг","588 кг","588.5 кг","589 кг","589.5 кг","590 кг","590.5 кг","591 кг","591.5 кг","592 кг","592.5 кг","593 кг","593.5 кг","594 кг","594.5 кг","595 кг","595.5 кг","596 кг","596.5 кг","597 кг","597.5 кг","598 кг","598.5 кг","599 кг","599.5 кг","600 кг","600.5 кг","601 кг","601.5 кг","602 кг","602.5 кг","603 кг","603.5 кг","604 кг","604.5 кг","605 кг","605.5 кг","606 кг","606.5 кг","607 кг","607.5 кг","608 кг","608.5 кг","609 кг","609.5 кг","610 кг","610.5 кг","611 кг","611.5 кг","612 кг","612.5 кг","613 кг","613.5 кг","614 кг","614.5 кг","615 кг","615.5 кг","616 кг","616.5 кг","617 кг","617.5 кг","618 кг","618.5 кг","619 кг","619.5 кг","620 кг","620.5 кг","621 кг","621.5 кг","622 кг","622.5 кг","623 кг","623.5 кг","624 кг","624.5 кг","625 кг","625.5 кг","626 кг","626.5 кг","627 кг","627.5 кг","628 кг","628.5 кг","629 кг","629.5 кг","630 кг","630.5 кг","631 кг","631.5 кг","632 кг","632.5 кг","633 кг","633.5 кг","634 кг","634.5 кг","635 кг","635.5 кг","636 кг","636.5 кг","637 кг","637.5 кг","638 кг","638.5 кг","639 кг","639.5 кг","640 кг","640.5 кг","641 кг","641.5 кг","642 кг","642.5 кг","643 кг","643.5 кг","644 кг","644.5 кг","645 кг","645.5 кг","646 кг","646.5 кг","647 кг","647.5 кг","648 кг","648.5 кг","649 кг","649.5 кг","650 кг","650.5 кг","651 кг","651.5 кг","652 кг","652.5 кг","653 кг","653.5 кг","654 кг","654.5 кг","655 кг","655.5 кг","656 кг","656.5 кг","657 кг","657.5 кг"];
    // let heightOptions = ["0 см","1 см","2 см","3 см","4 см","5 см","6 см","7 см","8 см","9 см","10 см","11 см","12 см","13 см","14 см","15 см","16 см","17 см","18 см","19 см","20 см","21 см","22 см","23 см","24 см","25 см","26 см","27 см","28 см","29 см","30 см","31 см","32 см","33 см","34 см","35 см","36 см","37 см","38 см","39 см","40 см","41 см","42 см","43 см","44 см","45 см","46 см","47 см","48 см","49 см","50 см","51 см","52 см","53 см","54 см","55 см","56 см","57 см","58 см","59 см","60 см","61 см","62 см","63 см","64 см","65 см","66 см","67 см","68 см","69 см","70 см","71 см","72 см","73 см","74 см","75 см","76 см","77 см","78 см","79 см","80 см","81 см","82 см","83 см","84 см","85 см","86 см","87 см","88 см","89 см","90 см","91 см","92 см","93 см","94 см","95 см","96 см","97 см","98 см","99 см","100 см","101 см","102 см","103 см","104 см","105 см","106 см","107 см","108 см","109 см","110 см","111 см","112 см","113 см","114 см","115 см","116 см","117 см","118 см","119 см","120 см","121 см","122 см","123 см","124 см","125 см","126 см","127 см","128 см","129 см","130 см","131 см","132 см","133 см","134 см","135 см","136 см","137 см","138 см","139 см","140 см","141 см","142 см","143 см","144 см","145 см","146 см","147 см","148 см","149 см","150 см","151 см","152 см","153 см","154 см","155 см","156 см","157 см","158 см","159 см","160 см","161 см","162 см","163 см","164 см","165 см","166 см","167 см","168 см","169 см","170 см","171 см","172 см","173 см","174 см","175 см","176 см","177 см","178 см","179 см","180 см","181 см","182 см","183 см","184 см","185 см","186 см","187 см","188 см","189 см","190 см","191 см","192 см","193 см","194 см","195 см","196 см","197 см","198 см","199 см","200 см","201 см","202 см","203 см","204 см","205 см","206 см","207 см","208 см","209 см","210 см","211 см","212 см","213 см","214 см","215 см","216 см","217 см","218 см","219 см","220 см","221 см","222 см","223 см","224 см","225 см","226 см","227 см","228 см","229 см","230 см","231 см","232 см","233 см","234 см","235 см","236 см","237 см","238 см","239 см","240 см","241 см","242 см","243 см","244 см","245 см","246 см","247 см","248 см","249 см","250 см","251 см","252 см","253 см","254 см","255 см","256 см","257 см","258 см","259 см","260 см","261 см","262 см","263 см","264 см","265 см","266 см","267 см","268 см","269 см","270 см","271 см","272 см","273 см","274 см","275 см","276 см","277 см","278 см","279 см","280 см","281 см","282 см","283 см","284 см","285 см","286 см","287 см","288 см","289 см","290 см","291 см","292 см","293 см","294 см","295 см","296 см","297 см","298 см","299 см"];


    return (
      <SafeAreaView style={commonStyles.container}>
        <InternetNotification/>
        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          contentContainerStyle={{flexGrow: 1,justifyContent: 'space-between'}}
        >
          <View>
            <StepScreenTitle numberStep={2}/>
            <ScreenTitle titleText={'ЕЩЕ ЧУТОЧКУ'}/>

            <Text style={styles.bloodTypeBlock__title}>Группа крови</Text>
            <View style={styles.bloodTypeBlock}>
              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(0)}}
                style={!this.state.bloodTypes[0].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[0].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[0].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(1)}}
                style={!this.state.bloodTypes[1].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[1].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[1].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(2)}}
                style={!this.state.bloodTypes[2].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[2].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[2].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(3)}}
                style={!this.state.bloodTypes[3].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[3].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[3].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(4)}}
                style={!this.state.bloodTypes[4].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[4].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[4].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(5)}}
                style={!this.state.bloodTypes[5].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[5].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[5].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(6)}}
                style={!this.state.bloodTypes[6].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[6].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[6].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(7)}}
                style={!this.state.bloodTypes[7].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[7].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[7].value}</Text>
              </TouchableOpacity>

            </View>

            <View style={[styles.inlineBLock, {marginTop: 60}]}>
              <View style={styles.inlineItem}>
                <SelectList updateSelectVal={this.handleSelectValue}
                            selectVal={'weight'} selectTitle={'Вес'}
                            options={weightOptions} initValIndex={80}
                />
              </View>
              <View style={styles.inlineItem}>
                <SelectList updateSelectVal={this.handleSelectValue}
                            selectVal={'height'} selectTitle={'Рост'}
                            options={heightOptions}
                            initValIndex={150}
                />
              </View>
            </View>
          </View>


          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {/*<TouchableOpacity*/}
            {/*  onPress={this.handleLogOut}*/}
            {/*  style={[commonStyles.submitBtn, commonStyles.firstBtn]}*/}
            {/*>*/}
            {/*  <Text style={commonStyles.submitBtnText}>Log Out</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity
              onPress={this.handleSubmitForm}
              style={ isEnabled
                ? [commonStyles.submitBtn, commonStyles.firstBtn]
                : [commonStyles.submitBtn, commonStyles.firstBtn, commonStyles.disabledSubmitBtn]}
              disabled={!isEnabled}
            >
              <Text style={ isEnabled
                ? commonStyles.submitBtnText
                : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}>СОХРАНИТЬ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handlePassBtn}
              style={[commonStyles.captionBtn]}
            >
              <Text style={commonStyles.captionBtn__text}>ПРОПУСТИТЬ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>


      </SafeAreaView>
    )
  }

}


const styles = StyleSheet.create({

  bloodTypeBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginLeft: -14,
    marginRight: -14,
  },

  bloodTypeBlock__title: {
    marginTop: 60,
    fontSize:16,
    color: Colors.GRAY_TEXT
  },

  bloodTypeBtn: {
    marginTop: 16,
    width: 64,
    height: 64,
    backgroundColor: Colors.WHITE,
    borderRadius: 32,
    justifyContent: 'center',
    marginLeft: 14,
    marginRight: 14,


    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // shadowColor: Colors.BLACK_TITLE,
    // shadowOffset: { height: 0, width: 0 },
  },

  bloodTypeBtn__text: {
    color: Colors.GRAY_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  bloodTypeBtnActive: {
    backgroundColor: Colors.LIGHT_CARMINE_PINK
  },

  bloodTypeBtn__textActive:{
    color: Colors.WHITE
  },

  inlineBLock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inlineItem: {
    width: '47.5%',
  }

});
