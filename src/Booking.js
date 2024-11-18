import {
  Text,
  BackHandler,
  RefreshControl,
  SafeAreaView,
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
import {Nodata_foundimage} from '../src/Provider/Nodata_foundimage';
import Footer from './Provider/Footer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
export default class Booking extends Component {
  _didFocusSubscription;

  _willBlurSubscription;
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      inprogress_arr: 'NA',
      completed_arr: 'NA',
      booking_id: 'NA',
      refresh: false,
      pending_arr: 'NA',
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      setTimeout(() => {
        this.setBookingData(0);
      }, 500);
    });
    setTimeout(() => {
      this.setBookingData(0);
    }, 500);
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }
  setBookingData = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    let user_id = user_arr.user_id;
    var url =
      config.baseURL +
      'get_driver_booking/' +
      user_id +
      '/' +
      this.state.booking_id;
      var booking_arr = await localStorage.getItemObject('get_booking_arr');
      if (booking_arr == null) {
 
        apifuntion
        .getApi(url)
        .then(obj => {
          if (obj.success == 'true') {
            localStorage.setItemObject('user_arr', obj.user_details);
            localStorage.setItemObject('get_booking_arr', obj.booking_arr);
            let data = obj.booking_arr;
            this.setState({
              inprogress_arr: data.inprogress_booking,
              pending_arr: data.pending_booking,
              completed_arr: data.completed_booking,
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
        inprogress_arr: booking_arr.inprogress_booking,
        completed_arr: booking_arr.completed_booking,
        pending_arr: booking_arr.pending_booking,
      });
      apifuntion
        .getApi(url, 1)
        .then(obj => {

          if (obj.success == 'true') {
            this.setState({refresh: false});
            localStorage.setItemObject('user_arr', obj.user_details);
            localStorage.setItemObject('get_booking_arr', obj.booking_arr);
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
    this.setBookingData(1);
  };

  // ============================hansdle back press--------------------
  handleBackPress = () => {
    this.props.navigation.navigate('Home');
    return true;
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
            {/* ------------------------------------Header------------------------------- */}

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
                    {Lang_chg.mybookings_txt[config.language]}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    justifyContent: 'center',
                    width: '10%',
                    alignItems: 'center',
                  }}
                  onPress={() => this.props.navigation.navigate('Calender')}>
                  <Image
                    source={localimag.celender2}
                    style={{
                      width: (mobileW * 5.5) / 100,
                      height: (mobileW * 5.5) / 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>

            <View
              style={{
                width: (mobileW * 96) / 100,
                alignSelf: 'center',
                flexDirection: 'row',
                borderRadius: (mobileW * 50) / 100,
                marginTop: (mobileW * 4) / 100,
                elevation: 5,
                backgroundColor: Colors.whiteColor,
                shadowOffset: {width: 1, height: 1},
                shadowColor: '#000',
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({activePage: 1})}
                style={
                  this.state.activePage != 1 ? styles.tab_bar : styles.tab_bar1
                }>
                <Text
                  style={
                    this.state.activePage != 1
                      ? styles.tab_bar_txt
                      : styles.tab_bar_txt1
                  }>
                  {Lang_chg.pending_txt[config.language]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({activePage: 2})}
                style={
                  this.state.activePage != 2 ? styles.tab_bar : styles.tab_bar1
                }>
                <Text
                  style={
                    this.state.activePage != 2
                      ? styles.tab_bar_txt
                      : styles.tab_bar_txt1
                  }>
                  {Lang_chg.inprogress_txt[config.language]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({activePage: 3})}
                style={
                  this.state.activePage != 3 ? styles.tab_bar : styles.tab_bar1
                }>
                <Text
                  style={
                    this.state.activePage != 3
                      ? styles.tab_bar_txt
                      : styles.tab_bar_txt1
                  }>
                  {Lang_chg.completed_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
            {/* --------------------------- Status Header---------------------------------- */}

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
              contentContainerStyle={{paddingBottom: (mobileW * 15) / 100}}
              keyboardShouldPersistTaps="handled">
              <View style={{bottom: (mobileH * 0) / 100}}>
                {this.state.activePage == 1 && (
                  <View>
                    {this.state.pending_arr == 'NA' ? (
                      <Nodata_foundimage />
                    ) : (
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingBottom: (mobileW * 20) / 100,
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.pending_arr}
                        renderItem={({index, item}) => {
                          return (
                            <TouchableOpacity
                          
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'Bookings_Details',
                                  {
                                    booking_id: item.booking_id,
                                    customer_id: item.user_id,
                                  },
                                );
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
                                  style={{
                                    width: '50%',
                                    alignItems: 'flex-start',
                                  }}>
                                  <Text style={styles.text_style}>
                                    {Lang_chg.bookingid1_txt[config.language]} :{' '}
                                    {item?.booking_no ?? ''}
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
                                    {item?.createtime ?? ''}
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
                                <View
                                  style={{width: '27%', alignItems: 'center'}}>
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
                                <View
                                  style={{width: '25%', alignItems: 'center'}}>
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
                                <View
                                  style={{width: '25%', alignItems: 'center'}}>
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
                                    {item?.plate_number ?? ''}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: '30%',
                                    justifyContent: 'center',
                                  }}>
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
                                style={{
                                  width: '100%',
                                  backgroundColor: '#F5F5F5',
                                }}>
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
                                                  config.img_url3 +
                                                  item.user_image,
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
                                        {item?.user_name ?? ''}
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
                                          {item?.user_email ?? ''}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      width: '30%',
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.fontsemibold,
                                        fontSize: (mobileW * 3) / 100,
                                        color: Colors.red,
                                        paddingVertical: (mobileW * 4) / 100,
                                        textAlign: 'right',
                                      }}>
                                      {Lang_chg.pending_txt[config.language]}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}
                  </View>
                )}
                {this.state.activePage == 2 && (
                  <View>
                    {this.state.inprogress_arr == 'NA' ? (
                      <Nodata_foundimage />
                    ) : (
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingBottom: (mobileW * 20) / 100,
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.inprogress_arr}
                        renderItem={({index, item}) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'Bookings_Details',
                                  {
                                    booking_id: item.booking_id,
                                    customer_id: item.user_id,
                                  },
                                );
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
                                  style={{
                                    width: '50%',
                                    alignItems: 'flex-start',
                                  }}>
                                  <Text style={styles.text_style}>
                                    {Lang_chg.bookingid1_txt[config.language]} :{' '}
                                    {item?.booking_no ?? ''}
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
                                <View
                                  style={{width: '27%', alignItems: 'center'}}>
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
                                <View
                                  style={{width: '25%', alignItems: 'center'}}>
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
                                <View
                                  style={{width: '25%', alignItems: 'center'}}>
                                  <Text style={styles.text_style}>
                                    {Lang_chg.date_txt[config.language]}
                                  </Text>
                                  <Text style={styles.text_style1}>
                                    {item?.booking_date ?? ''}
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
                                    {item?.plate_number ?? ''}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: '30%',
                                    justifyContent: 'center',
                                  }}>
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
                                style={{
                                  width: '100%',
                                  backgroundColor: '#F5F5F5',
                                }}>
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
                                                  config.img_url3 +
                                                  item.user_image,
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
                                        {item?.user_name ?? ''}
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
                                          {item?.user_email ?? ''}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      width: '30%',
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.fontsemibold,
                                        fontSize: (mobileW * 3) / 100,
                                        color: '#2172B8',
                                        paddingVertical: (mobileW * 4) / 100,
                                        textAlign: 'right',
                                      }}>
                                      {Lang_chg.inprogress_txt[config.language]}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}
                  </View>
                )}

                {this.state.activePage == 3 && (
                  <View>
                    {this.state.completed_arr == 'NA' ? (
                      <Nodata_foundimage />
                    ) : (
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingBottom: (mobileW * 20) / 100,
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.completed_arr}
                        renderItem={({index, item}) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'Bookings_Details',
                                  {
                                    booking_id: item.booking_id,
                                    customer_id: item.user_id,
                                  },
                                );
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
                                  style={{
                                    width: '50%',
                                    alignItems: 'flex-start',
                                  }}>
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
                                <View
                                  style={{width: '27%', alignItems: 'center'}}>
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
                                <View
                                  style={{width: '25%', alignItems: 'center'}}>
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
                                <View
                                  style={{width: '25%', alignItems: 'center'}}>
                                  <Text style={styles.text_style}>
                                    {Lang_chg.date_txt[config.language]}
                                  </Text>
                                  <Text style={styles.text_style1}>
                                    {item?.booking_date ?? ''}
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
                                    {item?.plate_number ?? ''}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: '30%',
                                    justifyContent: 'center',
                                  }}>
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
                                style={{
                                  width: '100%',
                                  backgroundColor: '#F5F5F5',
                                }}>
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
                                                  config.img_url3 +
                                                  item.user_image,
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
                                        {item?.user_name ?? ''}
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
                                          {item?.user_email ?? ''}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      width: '30%',
                                      justifyContent: 'center',
                                    }}>
                                    {item.status == 2 ? (
                                      <Text
                                        style={{
                                          fontFamily: Font.fontsemibold,
                                          fontSize: (mobileW * 3) / 100,
                                          color: Colors.green,
                                          paddingVertical: (mobileW * 4) / 100,
                                          textAlign: 'right',
                                        }}>
                                        {
                                          Lang_chg.completed_txt[
                                            config.language
                                          ]
                                        }
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          fontFamily: Font.fontsemibold,
                                          fontSize: (mobileW * 3) / 100,
                                          color: Colors.red,
                                          paddingVertical: (mobileW * 4) / 100,
                                          textAlign: 'right',
                                        }}>
                                        {Lang_chg.cancel_txt[config.language]}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          </ImageBackground>

          <Footer
            activepage="Booking"
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
                activeimage: localimag.service2,
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
  aboutView: {
    backgroundColor: Colors.statusbarcolor,
    width: mobileW * 0.48,
    borderRadius: (mobileW * 25) / 100,
    paddingVertical: (mobileW * 3) / 100,
  },
  aboutView1: {
    width: mobileW * 0.48,
  },
  aboutTxt: {
    color: Colors.whiteColor,
    textAlign: 'center',
    fontFamily: Font.fontbold,
    fontSize: mobileW * 0.04,
  },
  aboutTxt1: {
    width: mobileW * 0.48,
    color: Colors.black_color,
    textAlign: 'center',
    fontFamily: Font.fontbold,
    fontSize: mobileW * 0.04,
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
  tab_bar: {
    width: (mobileW * 32) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tab_bar1: {
    width: (mobileW * 32) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.appColor,
    borderRadius: (mobileW * 20) / 100,
  },
  tab_bar_txt: {
    fontFamily: Font.fontbold,
    fontSize: (mobileW * 3.5) / 100,
    color: Colors.black_color,
    paddingVertical: (mobileW * 3.2) / 100,
  },
  tab_bar_txt1: {
    fontFamily: Font.fontbold,
    fontSize: (mobileW * 3.5) / 100,
    color: Colors.whiteColor,
    paddingVertical: (mobileW * 3.2) / 100,
  },
});
