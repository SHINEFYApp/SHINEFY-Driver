import React, {Component} from 'react';
import {View, StatusBar, ImageBackground, StyleSheet} from 'react-native';
import {
  Colors,
  mobileH,
  mobileW,
  localimag,
  config,
  localStorage,
} from './Provider/utilslib/Utils';
import messaging from '@react-native-firebase/messaging';
global.player_id_me1 = '123456';
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export default class Splash extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      device_type: config.device_type,
      player_id: '123456',
      user_type: 2,
      login_type: 'app',
      loanguage: 1,
    };
    /* O N E S I G N A L   S E T U P */
    // OneSignal.setAppId(config.onesignalappid);
    // OneSignal.setLogLevel(6, 0);
    // OneSignal.setRequiresUserPrivacyConsent(false);
    // OneSignal.promptForPushNotificationsWithUserResponse(response => {

    //     ("Prompt response:", response);
    // });
  }

  async componentDidMount() {
    this.getfcmtoken();
    this.language_fun();
    //  firebaseprovider.getAllUsers()

    // OneSignal.addEmailSubscriptionObserver((event) => {
    //     this.OSLog("OneSignal: email subscription changed: ", event);
    // });
    // OneSignal.addSubscriptionObserver(event => {
    //     this.OSLog("OneSignal: subscription changed:", event);
    //     this.setState({ isSubscribed: event.to.isSubscribed })
    // });
    // OneSignal.addPermissionObserver(event => {
    //     this.OSLog("OneSignal: permission changed:", event);
    // });
    // var interval = setInterval(async () => {
    //     await OneSignal.getDeviceState().then(state => {
    //         ({ state })
    //         if (state.isSubscribed == true) {
    //             clearInterval(interval);
    //         }
    //         player_id_me1 = state.userId

    //     }).catch(error => {
    //     })
    // }, 500);

    setTimeout(() => {
      this.autoLogin();
    }, 2000);
  }
  // OSLog = (message, optionalArg) => {
  //     if (optionalArg) {
  //         message = message + JSON.stringify(optionalArg);
  //     }
  //     let consoleValue;
  //     if (this.state.consoleValue) {
  //         consoleValue = this.state.consoleValue + "\n" + message
  //     } else {
  //         consoleValue = message;
  //     }
  //     this.setState({ consoleValue });
  // }

  getfcmtoken = async () => {
    if (await requestUserPermission()) {
      messaging()
        .getToken()
        .then(fcmToken => {
          this.setState({
            player_id: fcmToken,
          });
          player_id_me1 = fcmToken;
          config.GetPlayeridfunctin(fcmToken);
        });
    }
  };

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  }

  language_fun = async () => {
    let textalign = await localStorage.getItemObject('language');
    if (textalign != null) {
      if (textalign == 1) {
        config.textalign = 'right';

        config.language = 1;
        localStorage.setItemObject('languagesetenglish', 3);
        localStorage.setItemObject('languagecathc', 0);
        this.setState({loanguage: 1});
      } else {
        config.textalign = 'left';
        config.language = 0;
      }
    } else {
      config.textalign = 'left';
      config.language = 0;
      localStorage.setItemObject('language', 0);
    }
  };

  autoLogin = async () => {
    let user_value = await localStorage.getItemObject('user_value');
    if (user_value == null) {
      const timer = setTimeout(() => {
        this.props.navigation.navigate('Login');
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      this.props.navigation.navigate('Home');
      // let {player_id, device_type, user_type, login_type} = this.state;
      // let password = user_value.password;
      // var data = new FormData();
      // data.append('phone_number', user_value.phone_number);
      // data.append('password', user_value.password);
      // data.append('player_id', player_id_me1);
      // data.append('device_type', device_type);
      // data.append('login_type', login_type);
      // data.append('user_type', user_type);

      // let url = config.baseURL + 'Login';
      // apifuntion
      //   .NoLoaderpostApi(url, data)
      //   .then(obj => {
      //     if (obj.success == 'true') {

      //       var user_arr = obj.user_details;
      //       let user_id = user_arr.user_id;
      //       let phone_number = user_arr.phone_number;
      //       let user_value = {
      //         user_id: user_id,
      //         phone_number: phone_number,
      //         password: password,
      //         user_type: user_type,
      //       };
      //       localStorage.setItemObject('user_arr', user_arr);
      //       localStorage.setItemObject('user_value', user_value);
      //       localStorage.setItemObject('user_pass', password);
      //       this.props.navigation.navigate('Home');
      //     }
      //   })
      //   .catch(err => {
      //     this.setState({loading: false});
      //     this.props.navigation.navigate('Login');
      //   });
    }
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar
          hidden={false}
          StatusBarStyle="light-content"
          backgroundColor={Colors.statusbarcolor}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle="light-content"
        />

        <View>
          <ImageBackground
            resizeMode="stretch"
            style={styles.logo}
            source={localimag.splashnew}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  logo: {
    width: (mobileW * 100) / 100,
    height: (mobileH * 100) / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: (mobileW * 48) / 100,
    width: (mobileW * 48) / 100,
  },
});
