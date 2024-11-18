import React, {Component} from 'react';
import {
  View,
  Image,
  BackHandler,
  Keyboard,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  StatusBar,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScrollView} from 'react-native-gesture-handler';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import CalendarPicker from 'react-native-calendar-picker';
import {
  Colors,
  Font,
  mobileH,
  mobileW,
  localimag,
  apifuntion,
  config,
  localStorage,
  mediaprovider,
  consolepro,
  Lang_chg,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
} from './Provider/utilslib/Utils';
import {validationprovider} from '../src/Provider/Validation_provider';
import Footer from './Provider/Footer';
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class My_Earning extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 0,
      feature_arr: [
        {day: 'Mon', date: '28', status: 0},
        {day: 'Tue', date: '1', status: 0},
        {day: 'Wed', date: '2', status: 0},
        {day: 'Thu', date: '3', status: 1},
        {day: 'Fri', date: '4', status: 0},
        {day: 'Sat', date: '5', status: 0},
        {day: 'Sun', date: '6', status: 0},
      ],
      date: 'NA',
      type: 1,
      total_earning: 'NA',
      service_count: 0,
      extra_service_count: 0,
      extra_service_earning: 0,
      service_earning: 0,
      yearModal: false,
      monthModal: false,
      year_arr: [
        {year: '2023', status: false},
        {year: '2023', status: false},
        {year: '2023', status: false},
        {year: '2023', status: false},
        {year: '2023', status: false},
        {year: '2023', status: false},
      ],
      today: new Date(),
      month: 'NA',
      sendmonth: 0,
      year: 'NA',
      month_arr: [
        {month: '01', monthName: 'January', status: false},
        {month: '02', monthName: 'February', status: false},
        {month: '03', monthName: 'March', status: false},
        {month: '04', monthName: 'April', status: false},
        {month: '05', monthName: 'May', status: false},
        {month: '06', monthName: 'June', status: false},
        {month: '07', monthName: 'July', status: false},
        {month: '08', monthName: 'August', status: false},
        {month: '09', monthName: 'September', status: false},
        {month: '10', monthName: 'October', status: false},
        {month: '11', monthName: 'November', status: false},
        {month: '12', monthName: 'December', status: false},
      ],
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getmonth();
      //     setTimeout( () => {
      //         this.setEarning();

      //    },500);
    });
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
    this.getmonth();
    // setTimeout( () => {
    //        this.setEarning();
    //    },500);
  }
  getmonth() {
    let date = this.state.today;
    var getMonth = date.getMonth() + 1;
    var getYear = date.getFullYear();
    var getDate = date.getDate();
    let monthName = months[date.getMonth()];
    this.setState({year: getYear, month: monthName});
    let data = this.state.year_arr;

    for (let i = 0; i < data.length; i++) {
      (data[5].year = getYear - 5), (data[5].status = false);
      (data[4].year = getYear - 4), (data[4].status = false);
      (data[3].year = getYear - 3), (data[3].status = false);
      (data[2].year = getYear - 2), (data[2].status = false);
      (data[1].year = getYear - 1), (data[1].status = false);
      (data[0].year = getYear), (data[0].status = true);
    }
    this.setState({year_arr: data});
    let monthdata = this.state.month_arr;
    let sendmonth = '';
    let mymonth = '';
    for (let j = 0; j < monthdata.length; j++) {
      if (monthdata[j].month == getMonth) {
        monthdata[j].status = true;
        sendmonth = monthdata[j].month;
        mymonth = monthdata[j].monthName;
      } else {
        monthdata[j].status = false;
      }
    }
    if (getMonth < 10) {
      getMonth = '0' + getMonth;
    } else {
      getMonth = getMonth;
    }

    if (this.state.activePage == 1) {
      var senddate = getYear + '-' + getMonth;
    } else {
      senddate = getYear + '-' + getMonth + '-' + getDate;
    }

    this.setState({
      month_arr: monthdata,
      sendmonth: sendmonth,
      month: mymonth,
      date: senddate,
    });

    setTimeout(() => {
      this.setEarning();
    }, 300);
  }

  checkyear = (item, index) => {
    let data = this.state.year_arr;
    for (let i = 0; i < data.length; i++) {
      data[i].status = false;
    }
    data[index].status = true;
    this.setState({year: data[index].year, year_arr: data, yearModal: false});

    var sendmonth = this.state.sendmonth;
    var year = data[index].year;

    let senddate = year + '-' + sendmonth;
    this.setState({date: senddate});
  };

  checkmonth = (item, index) => {
    let data = this.state.month_arr;
    for (let i = 0; i < data.length; i++) {
      data[i].status = false;
    }
    data[index].status = true;
    this.setState({
      month: data[index].monthName,
      sendmonth: data[index].month,
      month_arr: data,
      monthModal: false,
    });
    setTimeout(() => {}, 300);

    var year = this.state.year;
    var sendmonth = data[index].month;

    let senddate = year + '-' + sendmonth;
    this.setState({date: senddate});
  };

  setEarning = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    let date = this.state.date;
    let type = this.state.type;
    let user_id = user_arr.user_id;
    this.setState({user_id: user_id});
    var url =
      config.baseURL + 'get_earning/' + user_id + '/' + date + '/' + type;

    apifuntion
      .getApi(url)
      .then(obj => {

        if (obj.success == 'true') {
          this.setState({
            total_earning: obj.total_earning,
            service_count: obj.service_count,
            extra_service_count: obj.extra_service_count,
            service_earning: obj.service_earning,
            extra_service_earning: obj.extra_service_earning,
          });
          // this.nanigationFun();
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
  };

  // ============================hansdle back press--------------------
  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  dateChange = date => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    var selected_date_arr = date;
    var getDate = selected_date_arr?.getDate();
    var getMonth = selected_date_arr?.getMonth() + 1;
    var getYear = selected_date_arr?.getFullYear();
    if (getMonth < 10) {
      getMonth = '0' + getMonth;
    } else {
      getMonth = getMonth;
    }
    if (getDate < 10) {
      getDate = '0' + getDate;
    } else {
      getDate = getDate;
    }
    var start_date_time_2 = getYear + '-' + getMonth + '-' + getDate;
    this.setState({date: start_date_time_2});
    setTimeout(() => {
      this.setEarning();
    }, 500);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.total_earning != 'NA' && (
          <View style={styles.container}>
            <SafeAreaView
              style={{backgroundColor: Colors.theme_color, flex: 0}}
            />
            {/*----------------------------year modal------------------------------------------- */}
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={this.state.yearModal}
              onRequestClose={() => {
                this.setState({yearModal: false});
              }}>
              <View style={{backgroundColor: '#00000070', flex: 1}}>
                <View
                  style={{
                    borderRadius: 20,
                    position: 'absolute',
                    top: (mobileH * 40) / 100,
                    width: (mobileW * 90) / 100,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      width: (mobileW * 90) / 100,
                      alignSelf: 'center',
                      borderRadius: 15,
                      backgroundColor: 'white',
                      paddingVertical: (mobileW * 1) / 100,
                    }}>
                    <FlatList
                      data={this.state.year_arr}
                      renderItem={({item, index}) => {
                        if (this.state.year_arr != 'NA') {
                          return (
                            <View>
                              <TouchableOpacity
                                onPress={() => {
                                  this.checkyear(item, index);
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    width: '90%',
                                    alignSelf: 'center',
                                    marginTop: (mobileW * 5) / 100,
                                    alignItems: 'center',
                                    padding: (mobileW * 1) / 100,
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Font.fontmedium,
                                      fontSize: (mobileW * 3.5) / 100,
                                      color: Colors.textInput_color,
                                      padding: (mobileW * 1) / 100,
                                      width: (mobileW * 80) / 100,
                                    }}>
                                    {item.year}
                                  </Text>
                                  <View style={{width: (mobileW * 6) / 100}}>
                                    {item.status == false && (
                                      <Image
                                        style={{
                                          height: (mobileW * 4.5) / 100,
                                          resizeMode: 'contain',
                                          width: (mobileW * 4.5) / 100,
                                        }}
                                        source={localimag.checkbox1}
                                      />
                                    )}
                                    {item.status == true && (
                                      <Image
                                        style={{
                                          height: (mobileW * 4.5) / 100,
                                          resizeMode: 'contain',
                                          width: (mobileW * 4.5) / 100,
                                        }}
                                        source={localimag.checked}
                                      />
                                    )}
                                  </View>
                                </View>
                              </TouchableOpacity>
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: Colors.theme_color,
                                  width: '92%',
                                  alignSelf: 'center',
                                }}
                              />
                              ;
                            </View>
                          );
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {/*----------------------------year modal------------------------------------------- */}
            {/*----------------------------month modal------------------------------------------- */}
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={this.state.monthModal}
              onRequestClose={() => {
                this.setState({monthModal: false});
              }}>
              <View style={{backgroundColor: '#00000070'}}>
                <View
                  style={{
                    borderRadius: 20,
                    marginTop: (mobileH * 10) / 100,
                    width: (mobileW * 90) / 100,
                    alignSelf: 'center',
                  }}>
                  <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <View
                      style={{
                        width: (mobileW * 90) / 100,
                        alignSelf: 'center',
                        borderRadius: 15,
                        backgroundColor: 'white',
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <FlatList
                        data={this.state.month_arr}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingBottom: (mobileH * 10) / 100,
                        }}
                        renderItem={({item, index}) => {
                          if (this.state.month_arr != 'NA') {
                            return (
                              <View>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.checkmonth(item, index);
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      width: '90%',
                                      alignSelf: 'center',
                                      marginTop: (mobileW * 5) / 100,
                                      alignItems: 'center',
                                      padding: (mobileW * 1) / 100,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.fontmedium,
                                        fontSize: (mobileW * 3.5) / 100,
                                        color: Colors.textInput_color,
                                        padding: (mobileW * 1) / 100,
                                        width: (mobileW * 80) / 100,
                                      }}>
                                      {item.monthName}
                                    </Text>
                                    <View style={{width: (mobileW * 6) / 100}}>
                                      {item.status == false && (
                                        <Image
                                          style={{
                                            height: (mobileW * 4.5) / 100,
                                            resizeMode: 'contain',
                                            width: (mobileW * 4.5) / 100,
                                          }}
                                          source={localimag.checkbox1}
                                        />
                                      )}
                                      {item.status == true && (
                                        <Image
                                          style={{
                                            height: (mobileW * 4.5) / 100,
                                            resizeMode: 'contain',
                                            width: (mobileW * 4.5) / 100,
                                          }}
                                          source={localimag.checked}
                                        />
                                      )}
                                    </View>
                                  </View>
                                </TouchableOpacity>

                                <View
                                  style={{
                                    borderWidth: 1,
                                    borderColor: Colors.theme_color,
                                    width: '92%',
                                    alignSelf: 'center',
                                  }}
                                />
                              </View>
                            );
                          }
                        }}
                      />
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </View>
            </Modal>

            {/*----------------------------month modal------------------------------------------- */}
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
              <KeyboardAwareScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: (mobileW * 10) / 100}}>
                {/* -----------------------------Header------------------------------------ */}
                <ImageBackground
                  style={{
                    width: (mobileW * 100) / 100,
                    paddingVertical: (mobileH * 2) / 100,
                    alignItems: 'center',
                  }}
                  source={localimag.forgotop}>
                  <View
                    style={{
                      width: (mobileW * 100) / 100,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      paddingVertical: (mobileW * 6) / 100,
                    }}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 5.3) / 100,
                          color: Colors.whiteColor,
                        }}>
                        {Lang_chg.mywallet_txt[config.language]}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: (mobileW * 100) / 100,
                      paddingBottom: (mobileW * 15) / 100,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 12) / 100,
                        }}>
                        {this.state.total_earning}
                      </Text>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 6) / 100,
                        }}>
                        {' '}
                        EGP
                      </Text>
                    </View>
                    <View style={{alignSelf: 'center'}}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 3.5) / 100,
                        }}>
                        {Lang_chg.total_earning_txt[config.language]}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
                {/* -----------------------------End Header------------------------------------ */}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: (mobileW * 95) / 100,
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: mobileW * 0.02,
                    backgroundColor: Colors.white_color,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.light_grey,
                    borderTopColor: Colors.light_grey,
                    padding: (mobileW * 1) / 100,
                  }}>
                  <View
                    style={{
                      width: (mobileW * 50) / 100,
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRightWidth: 1,
                      borderColor: Colors.light_grey,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({activePage: 0, type: 1}),
                          setTimeout(() => {
                            this.getmonth();
                          }, 300);
                      }}>
                      <Text
                        style={
                          this.state.activePage == 0
                            ? styles.aboutTxt
                            : styles.aboutTxt1
                        }>
                        {Lang_chg.daily[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      width: (mobileW * 50) / 100,
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({activePage: 1, type: 0}),
                          setTimeout(() => {
                            this.getmonth();
                          }, 300);
                      }}
                      style={
                        this.state.activePage == 1
                          ? styles.aboutTxt
                          : styles.aboutTxt1
                      }>
                      <Text>{Lang_chg.month[config.language]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.activePage == 1 && (
                  <View
                    style={{
                      backgroundColor: Colors.whiteColor,
                      flex: 1,
                      alignItems: 'center',
                      marginTop: (mobileH * 5) / 100,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '80%',
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          this.setState({monthModal: false, yearModal: true});
                        }}
                        style={{
                          width: '40%',
                          borderWidth: 2,
                          borderRadius: (mobileW * 1.5) / 100,
                          borderColor: Colors.theme_color,
                          paddingVertical: (mobileH * 1) / 100,
                        }}>
                        <Text
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: (mobileW * 4) / 100,
                            fontFamily: Font.fontsemibold,
                            color: Colors.black_color,
                          }}>
                          {this.state.year}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({yearModal: false, monthModal: true});
                        }}
                        style={{
                          width: '40%',
                          borderWidth: 2,
                          borderRadius: (mobileW * 1.5) / 100,
                          borderColor: Colors.theme_color,
                          paddingVertical: (mobileH * 1) / 100,
                        }}>
                        <Text
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: (mobileW * 4) / 100,
                            fontFamily: Font.fontsemibold,
                            color: Colors.black_color,
                          }}>
                          {this.state.month}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setEarning();
                      }}
                      style={{
                        width: '40%',
                        backgroundColor: Colors.theme_color,
                        borderRadius: (mobileW * 1.5) / 100,
                        alignSelf: 'center',
                        paddingVertical: (mobileH * 1.5) / 100,
                        marginTop: (mobileH * 6) / 100,
                        marginBottom: (mobileW * 2) / 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 4) / 100,
                          textAlign: 'center',
                          color: Colors.whiteColor,
                        }}>
                        {Lang_chg.search_txt[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {this.state.activePage == 0 && (
                  <View
                    style={{
                      alignSelf: 'center',
                      marginTop: (mobileW * 5) / 100,
                    }}>
                    <CalendarPicker
                      width={(mobileW * 95) / 100}
                      selectedDayColor={Colors.green}
                      selectedDayTextColor={Colors.whiteColor}
                      todayBackgroundColor={Colors.appColor}
                      todayTextStyle={{fontFamily: 'Cochin', color: 'white'}}
                      maxDate={new Date()}
                      onDateChange={date => this.dateChange(date)}
                      textStyle={{
                        fontFamily: 'Cochin',
                        color: Colors.black_color,
                      }}
                      weekdays={[
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                      ]}
                    />
                  </View>
                )}

                {/* ------------------------------------ Cards ------------------------------ */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 93) / 100,
                    marginTop: (mobileW * 5) / 100,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      width: '49%',
                      backgroundColor: Colors.appColor,
                      flexDirection: 'row',
                      borderRadius: (mobileW * 2) / 100,
                      height: (mobileW * 22) / 100,
                    }}>
                    <View
                      style={{
                        width: '40%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={localimag.compact4}
                        style={{
                          height: (mobileW * 9) / 100,
                          width: (mobileW * 9) / 100,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        borderRightColor: 'white',
                        borderRightWidth: (mobileW * 0.3) / 100,
                        height: (mobileW * 15.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: '60%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 2.8) / 100,
                        }}>
                        {Lang_chg.total_txt[config.language]}
                      </Text>
                      <Text
                        style={{
                          paddingTop: (mobileW * 2) / 100,
                          color: Colors.whiteColor,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 4.1) / 100,
                        }}>
                        {this.state.service_count}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '49%',
                      backgroundColor: Colors.appColor,
                      flexDirection: 'row',
                      borderRadius: (mobileW * 2) / 100,
                      marginLeft: (mobileW * 2.5) / 100,
                      alignSelf: 'center',
                      height: (mobileW * 22) / 100,
                    }}>
                    <View
                      style={{
                        width: '40%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={localimag.offer}
                        style={{
                          height: (mobileW * 9) / 100,
                          width: (mobileW * 9) / 100,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        borderRightColor: 'white',
                        borderRightWidth: (mobileW * 0.3) / 100,
                        height: (mobileW * 15.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: '60%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 2.8) / 100,
                        }}>
                        {Lang_chg.commision_txt[config.language]}
                      </Text>
                      <Text
                        style={{
                          paddingTop: (mobileW * 2) / 100,
                          color: Colors.whiteColor,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 4.3) / 100,
                        }}>
                        {this.state.service_earning} EGP
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 93) / 100,
                    alignSelf: 'center',
                    paddingVertical: (mobileH * 2) / 100,
                    marginBottom:
                      config.device_type == 'ios'
                        ? (mobileH * 3) / 100
                        : (mobileH * -4) / 100,
                  }}>
                  <View
                    style={{
                      width: '49%',
                      backgroundColor: Colors.appColor,
                      flexDirection: 'row',
                      borderRadius: (mobileW * 2) / 100,
                    }}>
                    <View
                      style={{
                        width: '40%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={localimag.repair}
                        style={{
                          height: (mobileW * 9) / 100,
                          width: (mobileW * 9) / 100,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        borderRightColor: 'white',
                        borderRightWidth: (mobileW * 0.3) / 100,
                        height: (mobileW * 15.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: '60%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 2.8) / 100,
                        }}>
                        {Lang_chg.Eservice_txt[config.language]}
                      </Text>
                      <Text
                        style={{
                          paddingTop: (mobileW * 2) / 100,
                          color: Colors.whiteColor,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 4.1) / 100,
                        }}>
                        {this.state.extra_service_count}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '49%',
                      backgroundColor: Colors.appColor,
                      flexDirection: 'row',
                      borderRadius: (mobileW * 2) / 100,
                      marginLeft: (mobileW * 2.5) / 100,
                      alignSelf: 'center',
                      height: (mobileW * 22) / 100,
                    }}>
                    <View
                      style={{
                        width: '40%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={localimag.bonus}
                        style={{
                          height: (mobileW * 9) / 100,
                          width: (mobileW * 9) / 100,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        borderRightColor: 'white',
                        borderRightWidth: (mobileW * 0.3) / 100,
                        height: (mobileW * 15.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: '60%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 2.8) / 100,
                          textAlign: 'center',
                        }}>
                        {Lang_chg.ServicesBonus_txt[config.language]}
                      </Text>
                      <Text
                        style={{
                          paddingTop: (mobileW * 0.5) / 100,
                          color: Colors.whiteColor,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 4.3) / 100,
                        }}>
                        {this.state.extra_service_earning} EGP
                      </Text>
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </ImageBackground>
          </View>
        )}
        {this.state.total_earning != 'NA' && (
          <Footer
            activepage="My_Earning"
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
                activeimage: localimag.earning_fill,
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
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  aboutTxt: {
    backgroundColor: Colors.white_color,
    width: mobileW * 0.48,
    color: Colors.appColor,
    textAlign: 'center',
    fontFamily: Font.fontbold,
    fontSize: mobileW * 0.04,

    paddingVertical: (mobileW * 2) / 100,
  },
  aboutTxt1: {
    width: mobileW * 0.48,
    color: Colors.black_color,
    textAlign: 'center',
    fontFamily: Font.fontbold,
    fontSize: mobileW * 0.04,
  },
});
