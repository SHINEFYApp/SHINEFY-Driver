import React, {Component} from 'react';
//import OneSignal from 'react-native-onesignal';
import {config} from './configProvider';

class NotificationProvider {
  notification_arr(notification_arr) {
    for (let i = 0; i < notification_arr.length; i++) {
      let message = notification_arr[i].message;
      let player_id = notification_arr[i].player_id;
      let action_json = notification_arr[i].action_json;
      let title = notification_arr[i].title;
      // this.notificationfunction(message, action_json, player_id, title)
      this.notificationfirebasesend(message, action_json, player_id, title);
    }
  }

  notificationfirebaseCustomersend = (
    massege,
    action_json,
    playerid,
    title,
  ) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAA2A_OxE4:APA91bHeV1n1vM62ONqy1w4VvfH0ntmONK6YIFGQdw1hSTK1awNbvQpkiP8rffcg55jV5dVTIM_-kRJ3VGc6PQB5RcWEfvJOggyXaN2vgiQ-UWAMPNPi5V4nX7RPJbqpfaa2BY3OTIaJ',
    });
    var raw = {
      data: action_json,
      notification: {
        body: massege,
        title: title,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      registration_ids: [playerid],
    };
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(raw),
    })
      .then(response => response.text())
      .then(res => {})
      .catch(err => {});
  };

  //-----------------------------------------------end-------------------------------

  //--------------------------------------DriverSendNotification-----------------------------

  notificationfirebasesend = (massege, action_json, playerid, title) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAgvQiwnI:APA91bF-qqeFiMxlqUqlFhlFPAp8iJpFD2KEzTe-VWSGIZ5o-Sb2GfOYUXWK9c9Xe04IWlNDo1HF9huLeE-0L0-FSq_aeSx3K5EIxkfWNy4HLCrEP_FxOlbL-zjlghUSoyb9U94YpZKe',
    });
    var raw = {
      data: action_json,
      notification: {
        body: massege,
        title: title,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      registration_ids: [playerid],
    };
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(raw),
    })
      .then(response => response.text())
      .then(res => {})
      .catch(err => {});
  };

  //----------------------------------------end--------------------------------------------------

  notificationfunction(massege, action_json, playerid, title) {
    let contents = {en: massege};
    let data = {action_json: action_json};
    let playerIds = [playerid];
    var other = {
      headings: {en: title},
      group: 10,
      priority: 10,
    };

    var collapse_id = data.action_id;
    var dataPost = {
      app_id: config.onesignalappid,
      contents: {en: massege},
      headings: {en: title},
      //"included_segments":["All"],
      include_player_ids: [playerid],
      data: {action_json: data},
      ios_badgeType: 'Increase',
      ios_badgeCount: 1,
      priority: 10,
      collapse_id: collapse_id,
      // "send_after":time
    };
    fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + config.oneSignalAuthorization,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPost),
    })
      .then(response => response.json())
      .then(obj => {
        // global.props.hideLoader();
      })
      .catch(error => {
        // global.props.hideLoader();
        reject(error);
      });
  }

  //---------------for schedule notification start ------------//

  notification_arr_schedule(notification_arr) {
    for (let i = 0; i < notification_arr.length; i++) {
      let message = notification_arr[i].message;
      let player_id = notification_arr[i].player_id;
      let action_json = notification_arr[i].action_json;
      let title = notification_arr[i].title;
      // let time = notification_arr[i].time
      // this.notificationfunctionSchedule(message, action_json, player_id, title)
      this.notificationfirebaseCustomersend(
        message,
        action_json,
        player_id,
        title,
      );
    }
  }

  notificationfunctionSchedule(message, jsonData, player_id_arr, title) {
    var collapse_id = jsonData.action_id;
    var dataPost = {
      app_id: config.customeronesignalappid,
      contents: {en: message},
      headings: {en: title},
      //"included_segments":["All"],
      include_player_ids: [player_id_arr],
      data: {action_json: jsonData},
      ios_badgeType: 'Increase',
      ios_badgeCount: 1,
      priority: 10,
      collapse_id: collapse_id,
      // "send_after":time
    };
    fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + config.customeroneSignalAuthorization,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPost),
    })
      .then(response => response.json())
      .then(obj => {
        // global.props.hideLoader();
      })
      .catch(error => {
        // global.props.hideLoader();
        reject(error);
      });
  }

  // notificationfunctionSchedule(massege, action_json, playerid, title,time) {
  //   let contents = { 'en': massege[config.language] };
  //   let data = { 'action_json': action_json };
  //   let playerIds = [playerid];
  //   var other = {
  //     headings: { en: title[config.language] },
  //     group: 10,
  //     priority: 10,
  //     send_after:time
  //   };
  //   OneSignal.postNotification(contents, data, playerIds, other);
  // }

  //---------------for schedule notification end  ------------//

  Chatnotificationfunction(massege, action_json, playerid, title) {
    let contents = {en: massege};
    let data = {action_json: action_json};
    let playerIds = [playerid];
    var other = {
      headings: {en: title},
      group: 10,
      priority: 10,
    };
    // OneSignal.postNotification(contents, data, playerIds, other);
  }

  oneSignalNotificationSendUser(message, jsonData, player_id_arr, title) {
    console.lo('oneSignalNotificationSendUser');
    var collapse_id = jsonData.action_id;
    var dataPost = {
      app_id: config.customeronesignalappid,
      contents: {en: message},
      headings: {en: title},
      //"included_segments":["All"],
      include_player_ids: [player_id_arr],
      data: {action_json: jsonData},
      ios_badgeType: 'Increase',
      ios_badgeCount: 1,
      priority: 10,
      collapse_id: collapse_id,
    };
    fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + config.customeroneSignalAuthorization,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPost),
    })
      .then(response => response.json())
      .then(obj => {})
      .catch(error => {
        reject(error);
      });
    // $.ajax({
    //   url: "https://onesignal.com/api/v1/notifications",
    //   headers: {
    //   'Authorization':'Basic '+config.oneSignalAuthorizationDriver,
    //   'Content-Type':'application/json'
    //   },
    //   type: "POST",
    //   data: JSON.stringify(dataPost),
    //   dataType: "application/json",
    //   success: function(data) {
    //   },
    //   error: function (xhr, ajaxOptions, thrownError) {
    //   }
    // });
  }
}

export const notification = new NotificationProvider();
