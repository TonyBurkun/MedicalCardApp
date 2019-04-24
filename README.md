## MedicalCard App <img align="left" src="https://firebasestorage.googleapis.com/v0/b/medicalcard-30ec0.appspot.com/o/project-logo%2Fheart.png?alt=media&token=1f3df019-eadb-45e9-8d24-fe802d0fa664" width="180px">




A basic react native app with [`react-native-firebase`](https://github.com/invertase/react-native-firebase) pre-integrated  to get you started quickly.



### Getting Started


#### 1) Clone & Install Dependencies

- 1.1) `git clone https://github.com/TonyBurkun/MedicalCardApp.git`
- 1.2) `cd MedicalCard` - cd into your newly created project directory.
- 1.3) Install NPM packages with your package manager of choice - i.e run `yarn` or `npm install`
- 1.4) **[iOS]** `cd ios` and run `pod install` - if you don't have CocoaPods you can follow [these instructions](https://guides.cocoapods.org/using/getting-started.html#getting-started) to install it.
- 1.5) **[Android]** No additional steps for android here.


  
#### 2) Start your app

- 2.1) Start the react native packager, run `yarn run start` or `npm start` from the root of your project.
- 2.2) **[iOS]** Build and run the iOS app, run `npm run ios` or `yarn run ios` from the root of your project. The first build will take some time. This will automatically start up a simulator also for you on a successful build if one wasn't already started.
- 2.3) **[Android]** If you haven't already got an android device attached/emulator running then you'll need to get one running (make sure the emulator is with Google Play / APIs). When ready run `npm run android` or `yarn run android` from the root of your project.

  
## Contributors

This project exists thanks to all the people who contribute. [[Contribute]](https://github.com/invertase/react-native-firebase/blob/master/CONTRIBUTING.md).
<a href="graphs/contributors"><img src="https://opencollective.com/react-native-firebase/contributors.svg?width=890" /></a>



## Troubleshooting

`npm start` could not be run correctly because node_modules can contain duplicate path to the react-native module.
**[ANSWER]** Need to remove `react-native` folder from `node_modules/react-native-twitter-signin/node-modules`

### License

- See [LICENSE](/LICENSE)
