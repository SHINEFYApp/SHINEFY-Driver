import React from 'react';
//import OneSignal from 'react-native-onesignal';
import {config} from './configProvider';
import {localStorage} from './localStorageProvider';
import {consolepro} from './Messageconsolevalidationprovider/Consoleprovider';
// import { msgProvider, msgTitle, msgText } from './messageProvider';
import {notification} from './NotificationProvider';
import PushNotification from 'react-native-push-notification';
global.propsnavigation = '';
class Pushnotificationredirection {
  //----------------- message buttons
  constructor() {}

  //   redirectfun(props)
  //   {
  //     propsnavigation=props;
  //     OneSignal.setNotificationOpenedHandler(notification => {
  //       this.onOpened(notification)
  //   });
  //  }

  redirectfun = async props => {
    var userdata = await localStorage.getItemObject('user_arr');
    propsnavigation = props;

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {},

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        if (notification.userInteraction == true) {
          let mydata = notification.data;
          let action = mydata.action;
          let action_id = mydata.action_id;
          let user_id = mydata.user_id;
          let other_user_id = mydata.other_user_id;

          if (userdata != null) {
            if (action == 'booking') {
              props.navigation.navigate('Home');
            } else if (action == 'broadcast') {
              props.navigation.navigate('Notification');
            } else if (action == 'Rating') {
              props.navigation.navigate('Bookings_Details', {
                booking_id: action_id,
                customer_id: user_id,
              });
            }
          } else {
            props.navigation.navigate('Login');
          }
        }
      },
    });
  };

  onOpened = async openResult => {
    let navigation = propsnavigation;

    var datajson = openResult.notification.additionalData.action_json;
    var user_id = datajson.user_id;
    var other_user_id = datajson.other_user_id;
    var action_id = datajson.action_id;
    var action = datajson.action;
    var userdata = await localStorage.getItemObject('user_arr');

    if (userdata.user_id == other_user_id) {
      other_user_id = datajson.user_id;
    }

    // this.setState({loading:false})
    if (userdata != null) {
      if (action == 'broadcast') {
        navigation.navigate('Notification');
      } else if (action == 'booking') {
        navigation.navigate('Home');
      } else if (action == 'Rating') {
        navigation.navigate('Bookings_Details', {
          booking_id: action_id,
          customer_id: user_id,
        });
      }

      // }
    } else {
      navigation.navigation.navigate('Login');
    }
  };
  onIds(device) {
    player_id_me1 = device.userId;
  }
}

export const pushnotification = new Pushnotificationredirection();
