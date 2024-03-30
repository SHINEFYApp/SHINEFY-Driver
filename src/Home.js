import {
  Text,
  BackHandler,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  View,
  StyleSheet,
  Keyboard,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ScrollView,
  RadioButton,
  Button,
  TextInput,
} from 'react-native';
import React, {Component} from 'react';
// import { mobileH, mobileW, localimag, config, Colors, Font, Lang_chg, Cameragallery, mediaprovider,consolepro,consolelog } from '../src/Provider/utilslib/Utils'
import {
  Colors,
  Font,
  mobileH,
  mobileW,
  localimag,
  apifuntion,
  config,
  localStorage,
  consolepro,
  Lang_chg,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
} from './Provider/utilslib/Utils';
import Footer from './Provider/Footer';
import {Nodata_foundimage} from '../src/Provider/Nodata_foundimage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {notification} from './Provider/NotificationProvider';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {pushnotification} from './Provider/Pushnotificationredirection';
export default class Home extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      today_booking_arr: 'NA',
      booking_count: 0,
      home_arr: '',
      notification_count: 0,
      refresh: false,
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this.getnotification();
    pushnotification.redirectfun(this.props);
    this.props.navigation.addListener('focus', () => {
      setTimeout(() => {
        this.setHomeData(0);
      }, 500);
      this.getNotificationCount();
    });
    this.getNotificationCount();
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
    setTimeout(() => {
      this.setHomeData(0);
    }, 500);
  }

  //--------for notification get  start -------------
  getnotification = async () => {
    PushNotification.createChannel(
      {
        channelId: 'specialid', // (required)
        channelName: 'Special messasge', // (required)

        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => {}, // (optional) callback returns whether the channel was created, false means it already existed.
    );

    messaging().onMessage(async remoteMessage => {
      var isScheduled = remoteMessage.data.isScheduled;
      if (isScheduled == 'true') {
        var schedule_time = remoteMessage.data.scheduledTime;
        //----for local schedule start--------//
        PushNotification.localNotificationSchedule({
          channelId: 'specialid', //his must be same with channelid in createchannel
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
          data: remoteMessage.data,
          largeIcon: 'ic_launcher',
          date: new Date(schedule_time), // in 60 secs
          allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        });

        PushNotification.getDeliveredNotifications(res => {});
        //----for local schedule end--------//
      } else {
        //------for local start---------- //
        PushNotification.localNotification({
          channelId: 'specialid', //his must be same with channelid in createchannel
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
          data: remoteMessage.data,
          largeIcon: 'ic_launcher',
        });
        //------for local end-----------//
      }
    });
  };
  //--------for notification get  end -------------

  // ============================hansdle back press--------------------
  handleBackPress = () => {
    Alert.alert(
      Lang_chg.titleexitapp[config.language],
      Lang_chg.exitappmessage[config.language],
      [
        {
          text: Lang_chg.no_txt[config.language],
          onPress: () => {},
          style: 'Yes',
        },
        {
          text: Lang_chg.yes_txt[config.language],
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };
  // ----------------------------SET HOME DATE FUNCTION----------------------
  setHomeData = async page => {
    var user_arr = await localStorage.getItemObject('user_arr');
    let user_id = user_arr.user_id;
    var url = config.baseURL + 'get_driver_home/' + user_id;
    var driver_home = await localStorage.getItemObject('driver_home_data');
    if (driver_home == null) {
      apifuntion
        .getApi(url, page)
        .then(obj => {
          if (obj.success == 'true') {
            localStorage.setItemObject('user_arr', obj.user_details);
            localStorage.setItemObject('driver_home_data', obj.home_arr);
            localStorage.setItemObject('driver_avg_rating', obj.avg_rating);
            let data = obj.home_arr;
            this.setState({
              home_arr: data,
              booking_count: obj.home_arr.booking_count,
              today_booking_arr: obj.home_arr.booking_arr,
              refresh: false,
            });
          } else {
            if (obj.account_active_status[0] == 'deactivate') {
              config.checkUserDeactivate(this.props.navigation);
              return false;
            }
            if (obj.acount_delete_status[0] == 'deactivate') {
              config.checkUserDelete(this.props.navigation);
              return false;
            }

            return false;
          }
        })
        .catch(err => {
          if (err == 'noNetwork') {
            msgProvider.alert(
              Lang_chg.msgTitleNoNetwork[config.language],
              Lang_chg.noNetwork[config.language],
              false,
            );
            return false;
          } else {
            msgProvider.alert(
              Lang_chg.msgTitleServerNotRespond[config.language],
              Lang_chg.serverNotRespond[config.language],
              false,
            );
            return false;
          }
        });
    } else {
      this.setState({
        home_arr: driver_home,
        booking_count: driver_home.booking_count,
        today_booking_arr: driver_home.booking_arr,
      });
      apifuntion
        .getApi(url, 1)
        .then(obj => {
          if (obj.success == 'true') {
            this.setState({refresh: false});
            localStorage.setItemObject('user_arr', obj.user_details);
            localStorage.setItemObject('driver_home_data', obj.home_arr);
            localStorage.setItemObject('driver_avg_rating', obj.avg_rating);
          } else {
            if (obj.account_active_status[0] == 'deactivate') {
              config.checkUserDeactivate(this.props.navigation);
              return false;
            }
            if (obj.acount_delete_status[0] == 'deactivate') {
              config.checkUserDelete(this.props.navigation);
              return false;
            }

            return false;
          }
        })
        .catch(err => {
          if (err == 'noNetwork') {
            msgProvider.alert(
              Lang_chg.msgTitleNoNetwork[config.language],
              Lang_chg.noNetwork[config.language],
              false,
            );
            return false;
          } else {
            msgProvider.alert(
              Lang_chg.msgTitleServerNotRespond[config.language],
              Lang_chg.serverNotRespond[config.language],
              false,
            );
            return false;
          }
        });
    }
  };

  _onRefresh = () => {
    this.setState({refresh: true});
    this.setHomeData(1);
  };

  getNotificationCount = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details.user_id;
    let url = config.baseURL1 + 'get_notificationcount.php?user_id=' + user_id;
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        if (obj.success == 'true') {
          this.setState({notification_count: obj.notification_count});
        } else {
          if (
            obj.active_status == msgTitle.deactivate[config.language] ||
            obj.msg[config.language] == msgTitle.usernotexit[config.language]
          ) {
            usernotfound.loginFirst(this.props, obj.msg[config.language]);
          } else {
            msgProvider.alert(
              msgTitle.information[config.language],
              obj.msg[config.language],
              false,
            );
          }
          return false;
        }
      })
      .catch(error => {});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <SafeAreaView
            style={{backgroundColor: Colors.theme_color, flex: 0}}
          />
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.appColor}
            hidden={false}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />
          <ImageBackground
            source={localimag.bacKground1}
            resizeMode="stretch"
            style={{
              width: (mobileW * 100) / 100,
              height: (mobileH * 89) / 100,
            }}>
            <ImageBackground
              source={localimag.new_header}
              style={{
                width: (mobileW * 100) / 100,
                height: (mobileW * 20) / 100,
              }}>
              <View
                style={{
                  width: (mobileW * 95) / 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingVertical: (mobileW * 6) / 100,
                }}>
                <View style={{width: '90%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: Font.fontsemibold,
                      fontSize: (mobileW * 5.5) / 100,
                      color: Colors.whiteColor,
                      paddingLeft: (mobileW * 10) / 100,
                    }}>
                    {Lang_chg.Home[config.language]}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    justifyContent: 'center',
                    width: '10%',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('Notification');
                  }}>
                  {this.state.notification_count != 0 ? (
                    <Image
                      source={localimag.active_notifi_icon}
                      style={{
                        width: (mobileW * 8.5) / 100,
                        height: (mobileW * 8.5) / 100,
                      }}
                    />
                  ) : (
                    <Image
                      source={localimag.deactive_notifi_icon}
                      style={{
                        width: (mobileW * 8.5) / 100,
                        height: (mobileW * 8.5) / 100,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <View
              style={{
                width: (mobileW * 100) / 100,
                backgroundColor: '#FDE7CE',
                marginTop: (mobileW * 1.9) / 100,
                paddingVertical: (mobileW * 3.4) / 100,
              }}>
              <Text
                style={{
                  color: Colors.appColor,
                  fontFamily: Font.fontbold,
                  fontSize: (mobileW * 3.7) / 100,
                  paddingLeft: (mobileW * 3) / 100,
                  textAlign: config.textRotate,
                }}>
                {Lang_chg.today_Service_txt[config.language]} (
                {this.state.booking_count})
              </Text>
            </View>
            <KeyboardAwareScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refresh}
                  onRefresh={this._onRefresh}
                  tintColor="black"
                />
              }
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{paddingBottom: (mobileW * 20) / 100}}>
              <View>
                {this.state.today_booking_arr == 'NA' ? (
                  <Nodata_foundimage />
                ) : (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingBottom: (mobileW * 20) / 100,
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.today_booking_arr}
                    renderItem={({index, item}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Bookings_Details', {
                              booking_id: item.booking_id,
                            });
                          }}
                          activeOpacity={0.8}
                          style={{
                            width: (mobileW * 94) / 100,
                            elevation: 3,
                            marginTop: (mobileW * 3) / 100,
                            alignSelf: 'center',
                            backgroundColor: Colors.whiteColor,
                            shadowOffset: {width: 1, height: 1},
                            shadowColor: Colors.shadow_color,
                            shadowOpacity: 0.24,
                            shadowRadius: 2.22,
                            borderRadius: (mobileW * 1) / 100,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: '93%',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              borderBottomColor: Colors.appColor,
                              borderBottomWidth: (mobileW * 0.5) / 100,
                              paddingTop: (mobileW * 3) / 100,
                              paddingBottom: (mobileW * 1.5) / 100,
                            }}>
                            <View
                              style={{width: '50%', alignItems: 'flex-start'}}>
                              <Text style={styles.text_style}>
                                {Lang_chg.bookingid1_txt[config.language]} :{' '}
                                {item.booking_no}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: '50%',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: Font.fontsemibold,
                                  fontSize: (mobileW * 2.6) / 100,
                                  color: Colors.signup_placeholder_color,
                                }}>
                                {item.createtime}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              width: '93%',
                              paddingTop: (mobileW * 2) / 100,
                              flexDirection: 'row',
                              alignSelf: 'center',
                            }}>
                            <View
                              style={{
                                width: '23%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.appColor,
                                borderRadius: (mobileW * 1.5) / 100,
                                paddingVertical: (mobileW * 2.5) / 100,
                              }}>
                              <Image
                                source={{
                                  uri: config.img_url3 + item.vehicle_image,
                                }}
                                style={{
                                  height: (mobileW * 14) / 100,
                                  width: (mobileW * 16) / 100,
                                }}
                              />
                            </View>
                            <View style={{width: '27%', alignItems: 'center'}}>
                              <Text style={styles.text_style}>
                                {Lang_chg.service_txt[config.language]}
                              </Text>
                              <Text style={styles.text_style1}>
                                {item.service_name[config.language]}
                              </Text>
                            </View>
                            <View
                              style={{
                                borderRightWidth: (mobileW * 0.3) / 100,
                                borderRightColor: Colors.bottom_border,
                                height: (mobileW * 10) / 100,
                                marginTop: (mobileW * 2) / 100,
                              }}
                            />
                            <View style={{width: '25%', alignItems: 'center'}}>
                              <Text style={styles.text_style}>
                                {Lang_chg.time_slot[config.language]}
                              </Text>
                              <Text style={styles.text_style1}>
                                {item.booking_time[config.language]}
                              </Text>
                            </View>
                            <View
                              style={{
                                borderRightWidth: (mobileW * 0.3) / 100,
                                borderRightColor: Colors.bottom_border,
                                height: (mobileW * 10) / 100,
                                marginTop: (mobileW * 2) / 100,
                              }}
                            />
                            <View style={{width: '25%', alignItems: 'center'}}>
                              <Text style={styles.text_style}>
                                {Lang_chg.date_txt[config.language]}
                              </Text>
                              <Text style={styles.text_style1}>
                                {item.booking_date}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignSelf: 'center',
                              width: '93%',
                              paddingBottom: (mobileW * 3) / 100,
                            }}>
                            <View
                              style={{
                                width: '26%',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text style={styles.text_style}>
                                {item.plate_number}
                              </Text>
                            </View>
                            <View
                              style={{width: '30%', justifyContent: 'center'}}>
                              <Text style={styles.modal_name_style} />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '43%',
                                justifyContent: 'flex-end',
                              }}>
                              <Text style={styles.text_style}>
                                {Lang_chg.payment_txt1[config.language]}:{' '}
                              </Text>
                              <Text style={styles.text_style1}>
                                {item.payment_option[config.language]}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{width: '100%', backgroundColor: '#F5F5F5'}}>
                            <View
                              style={{
                                width: '93%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                              }}>
                              <View
                                style={{
                                  width: '70%',
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  paddingVertical: (mobileW * 3.5) / 100,
                                }}>
                                <View
                                  style={{
                                    width: '23%',
                                    justifyContent: 'center',
                                  }}>
                                  <Image
                                    source={
                                      item.user_image == 'NA'
                                        ? localimag.placeholder_icon
                                        : {
                                            uri:
                                              config.img_url3 + item.user_image,
                                          }
                                    }
                                    style={{
                                      height: (mobileW * 12) / 100,
                                      width: (mobileW * 12) / 100,
                                      borderRadius: (mobileW * 10) / 100,
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    width: '77%',
                                    alignSelf: 'flex-start',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 3) / 100,
                                      textAlign: config.textRotate,
                                    }}>
                                    {item.user_name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 2.7) / 100,
                                      color: Colors.signup_text_title,
                                      lineHeight: (mobileW * 3.3) / 100,
                                      textAlign: config.textRotate,
                                    }}>
                                    +20 {item.user_phone_number}
                                  </Text>
                                  {item.user_email != 'NA' && (
                                    <Text
                                      style={{
                                        fontFamily: Font.fontmedium,
                                        fontSize: (mobileW * 2.7) / 100,
                                        color: Colors.signup_text_title,
                                        lineHeight: (mobileW * 3.3) / 100,
                                        textAlign: config.textRotate,
                                      }}>
                                      {item.user_email}
                                    </Text>
                                  )}
                                </View>
                              </View>
                              <View
                                style={{
                                  width: '30%',
                                  justifyContent: 'center',
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                )}
              </View>
            </KeyboardAwareScrollView>
          </ImageBackground>

          <Footer
            activepage="Home"
            usertype={1}
            footerpage={[
              {
                name: 'Home',
                pagename: Lang_chg.home_txt[config.language],
                countshow: false,
                image: localimag.homeinactive1,
                activeimage: localimag.homeactive2,
              },
              {
                name: 'Booking',
                pagename: Lang_chg.bookings[config.language],
                countshow: false,
                image: localimag.service6,
                activeimage: localimag.service6,
              },
              {
                name: 'My_Earning',
                pagename: Lang_chg.myearnimg_txt[config.language],
                countshow: false,
                image: localimag.service5,
                activeimage: localimag.service5,
              },
              {
                name: 'Profile',
                pagename: Lang_chg.Profile_txt[config.language],
                countshow: false,
                image: localimag.profile3,
                activeimage: localimag.profile3,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: (mobileW * 6.5) / 100,
              height: (mobileW * 6) / 100,
              backgroundColor: Colors.theme_color,
              countcolor: 'black',
              countbackground: 'black',
            }}
            user_id={this.state.user_id}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  text_style: {
    fontFamily: Font.fontsemibold,
    fontSize: (mobileW * 3) / 100,
    paddingTop: (mobileW * 1.5) / 100,
  },
  text_style1: {
    fontFamily: Font.fontsemibold,
    fontSize: (mobileW * 3) / 100,
    color: Colors.appColor,
    paddingTop: (mobileW * 1.5) / 100,
  },
});
