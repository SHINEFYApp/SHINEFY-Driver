import React, {Component} from 'react';
import {
  Modal,
  FlatList,
  Text,
  BackHandler,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  config,
  localStorage,
  apifuntion,
  msgProvider,
  msgText,
  consolepro,
  Lang_chg,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
} from './Provider/utilslib/Utils';
import StarRating from 'react-native-star-rating';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Nodata_foundimage} from './Provider/Nodata_foundimage';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification_arr: 'NA',
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.get_notification(0);
    });
    this.get_notification(0);
  }
  get_notification = async page => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details.user_id;
    let url = config.baseURL1 + 'get_notification?user_id=' + user_id;

    apifuntion
      .getApi(url, page)
      .then(obj => {
        if (obj.success == 'true') {
          this.setState({
            notification_arr: obj.notification_arr,
            refresh: false,
          });
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
  notification_delete_click = async (item, index) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details.user_id;
    let notification_message_id = item.notification_message_id;
    let url =
      config.baseURL1 +
      'delete_single_notification.php?user_id=' +
      user_id +
      '&notification_message_id=' +
      notification_message_id;

    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          let data = this.state.notification_arr;
          data.splice(index, 1);
          if (data.length <= 0) {
            data = 'NA';
          }
          this.setState({notification_arr: data});
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
  delete_all_notification_click = async (item, index) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details.user_id;
    let url =
      config.baseURL1 + 'delete_all_notification.php?user_id=' + user_id;
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          this.get_notification();
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

  data_delete() {
    Alert.alert(
      Lang_chg.Clear[config.language],
      Lang_chg.clear_notification_detail[config.language],
      [
        {
          text: Lang_chg.No[config.language],
        },
        {
          text: Lang_chg.Yes[config.language],
          onPress: () => this.delete_all_notification_click(),
        },
      ],
      {cancelable: false},
    );
  }

  data_delete_single(item, index) {
    Alert.alert(
      Lang_chg.delete[config.language],
      Lang_chg.delete_noti_detail[config.language],
      [
        {
          text: Lang_chg.No[config.language],
        },
        {
          text: Lang_chg.Yes[config.language],
          onPress: () => this.notification_delete_click(item, index),
        },
      ],
      {cancelable: false},
    );
  }
  myactionfunction = (item, index) => {
    if (item.action == 'booking') {
      this.props.navigation.navigate('Bookings_Details', {
        booking_id: item.action_id,
        customer_id: item.user_id,
      });
    } else if (item.action == 'Rating') {
      this.props.navigation.navigate('Bookings_Details', {
        booking_id: item.action_id,
        customer_id: item.user_id,
      });
    }
  };
  _onRefresh = () => {
    this.setState({refresh: true});
    this.get_notification(1);
  };
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.flexStyle} />
        <StatusBar
          hidden={false}
          backgroundColor={Colors.themecolor1}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <ImageBackground
          source={localimag.new_header}
          style={{width: (mobileW * 100) / 100, height: (mobileW * 20) / 100}}>
          <View
            style={{
              width: (mobileW * 100) / 100,
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingVertical: (mobileW * 6) / 100,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                justifyContent: 'center',
                width: '12%',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Image
                source={localimag.goback}
                style={{
                  width: (mobileW * 5.3) / 100,
                  height: (mobileW * 5.3) / 100,
                  transform: [
                    config.textalign == 'right' ? {scaleX: -1} : {scaleX: 1},
                  ],
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '68%',
                alignItems: 'center',
                alignSelf: 'center',
                paddingLeft: (mobileW * 5) / 100,
              }}>
              <Text
                style={{
                  fontFamily: Font.fontmedium,
                  fontSize: (mobileW * 5.6) / 100,
                  color: Colors.whiteColor,
                }}>
                {Lang_chg.notification_txt[config.language]}
              </Text>
            </View>
            {this.state.notification_arr != 'NA' && (
              <TouchableOpacity
            
                activeOpacity={0.7}
                onPress={() => {
                  this.data_delete();
                }}
                style={{
                  fontFamily: Font.fontregular,
                  fontSize: (mobileW * 4) / 100,
                  color: Colors.whiteColor,
                  width: '20%', alignItems: 'center'
                }}>
                {Lang_chg.clearAll[config.language]}
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
              tintColor="black"
            />
          }>
          {this.state.notification_arr == 'NA' && <Nodata_foundimage />}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: mobileW * 0.02,
              alignSelf: 'center',
              marginTop: mobileH * 0.02,
            }}>
            <FlatList
              data={this.state.notification_arr}
              renderItem={({item, index}) => {
                if (this.state.notification_arr != 'NA') {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.myactionfunction(item, index);
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: mobileH * 0.03,
                        }}>
                        <Image
                          source={localimag.notification_logo}
                          style={{
                            width: mobileW * 0.1,
                            height: mobileW * 0.1,
                            resizeMode: 'cover',
                            borderRadius: mobileW * 0.06,
                          }}
                        />
                        {/* clinic name, status of clinic */}
                        <View
                          style={{
                            marginLeft: mobileW * 0.02,
                            width: mobileW * 0.82,
                          }}>
                          {/* clinic name and date and time */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.clinicName}>
                              {Lang_chg.app_name[config.language]}
                            </Text>
                            <Text style={styles.dateNtime}>
                              {item.createtime}
                            </Text>
                          </View>

                          {/* clinic status and cross logo */}
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                this.data_delete_single(item, index);
                              }}>
                              <Image
                                source={localimag.cancel}
                                style={{
                                  width: mobileW * 0.037,
                                  height: mobileW * 0.037,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {/* dashed */}
                        <View
                          style={{
                            backgroundColor: '#ddd',
                            height: mobileH * 0.002,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  clearAllTxt: {
    fontFamily: Font.fontbold,
    fontSize: mobileW * 0.038,
    color: Colors.whiteColor,
  },
  backSpace: {
    width: mobileW * 0.18,
  },
  clinicName: {
    fontSize: mobileW * 0.04,
    fontFamily: Font.fontregular,
    textAlign: config.textRotate,
  },
  clinicStatusTxt: {
    fontSize: mobileW * 0.03,
    fontFamily: Font.fontregular,
    textAlign: config.textRotate,
  },
  clinicStatusTxt11: {
    fontSize: mobileW * 0.03,
    fontFamily: Font.fontsemibold,
    color: Colors.themecolor1,
    textDecorationLine: 'underline',
  },
  dateNtime: {
    fontSize: mobileW * 0.028,
    fontFamily: Font.fontregular,
  },
});
