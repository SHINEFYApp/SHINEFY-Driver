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
import {Nodata_foundimage} from '../src/Provider/Nodata_foundimage';
import CalendarPicker from 'react-native-calendar-picker';
export default class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Flat_list_arr1: [
        {time: '08:00 AM'},
        {time: '10:00 AM'},
        {time: '12:00 PM'},
        {time: '02:00 PM'},
      ],
      month: 'NA',
      booking_arr: 'NA',
      month_name: 'NA',
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
        this.getData('NA');
      }, 500);
    });
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }

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
    var selected_date_arr = date._d;
    var getDate = selected_date_arr.getDate();
    var getMonth = selected_date_arr.getMonth() + 1;
    var getYear = selected_date_arr.getFullYear();
    var start_date_time_2 = getDate + '/' + getMonth + '/' + getYear;
    this.setState({selected: start_date_time_2});
  };

  onMonthChange = async month => {
    this.setState({month_name: 'NA', booking_arr: 'NA'});
    var get_month = month._d;
    var getDate = get_month.getDate();
    var getMonth = get_month.getMonth() + 1;
    var getYear = get_month.getFullYear();
    var mydate = getYear + '-' + getMonth + '-' + getDate;
    this.setState({month: mydate});
    this.getData(mydate);
  };

  getData = async month => {
    var user_arr = await localStorage.getItemObject('user_arr');
    let user_id = user_arr.user_id;
    var url = config.baseURL + 'get_monthly_booking/' + user_id + '/' + month;
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          this.setState({
            booking_arr: obj.booking_arr,
            month_name: obj.month_name,
          });
        } else {
          msgProvider.alert(
            Lang_chg.information[config.language],
            obj.msg[config.language],
            false,
          );
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
          source={localimag.bacKground1}
          resizeMode="stretch"
          style={{width: (mobileW * 100) / 100, height: (mobileH * 97) / 100}}>
          {/* -----------------------------Header------------------------------------ */}
          <ImageBackground
            source={localimag.new_header}
            style={{
              width: (mobileW * 100) / 100,
              height: (mobileW * 20) / 100,
            }}>
            <View
              style={{
                alignItems: 'center',
                width: (mobileW * 100) / 100,
                flexDirection: 'row',
                paddingVertical: (mobileW * 6) / 100,
              }}>
              <TouchableOpacity
                style={{
                  width: (mobileW * 13) / 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: (mobileW * 5.3) / 100,
                    height: (mobileW * 5.3) / 100,
                    transform: [
                      config.textalign == 'right' ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                  source={localimag.goback}></Image>
              </TouchableOpacity>
              <View
                style={{
                  width: '72%',
                  alignItems: 'center',
                  paddingLeft: (mobileW * 5) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.cal_txt[config.language]}
                </Text>
              </View>
            </View>
          </ImageBackground>
          {/* -----------------------------End Header------------------------------------ */}

          <View>
            <CalendarPicker
              selectedDayColor={Colors.appColor}
              selectedDayTextColor={Colors.whiteColor}
              todayBackgroundColor={Colors.whiteColor}
              enableDateChange={false}
              onMonthChange={month => this.onMonthChange(month)}
              onDateChange={date => this.dateChange(date)}
              todayTextStyle={{color: 'black'}}
              textStyle={{
                fontFamily: 'Cochin',
                color: 'black',
              }}
              weekdays={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            />
          </View>
          <KeyboardAwareScrollView>
            {this.state.month_name != 'NA' && (
              <View
                style={{
                  width: '85%',
                  marginLeft: (mobileW * 2.8) / 100,
                  marginTop: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.appColor,
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>
                  {this.state.month_name} {Lang_chg.bookings[config.language]}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: mobileW * 0.02,
                marginTop: mobileH * 0.02,
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  width: '95%',
                  alignItems: 'center',
                }}>
                {/* --------------------Flat List Start---------------------- */}
                <View
                  style={{
                    paddingHorizontal: (mobileW * 0.2) / 100,
                    width: '98%',
                  }}>
                  {this.state.booking_arr == 'NA' ? (
                    <Nodata_foundimage />
                  ) : (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingBottom: (mobileW * 20) / 100,
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      data={this.state.booking_arr}
                      renderItem={({index, item}) => {
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <View
                              style={{
                                width: '20%',
                                borderRightWidth: (mobileW * 0.6) / 100,
                                borderColor: Colors.bordercolor,
                              }}>
                              <Text
                                style={{
                                  fontFamily: Font.fontsemibold,
                                  paddingVertical: (mobileW * 1) / 100,
                                  fontSize: (mobileW * 3.5) / 100,
                                }}>
                                {item.date}
                              </Text>
                            </View>
                            <FlatList
                              showsHorizontalScrollIndicator={false}
                              showsVerticalScrollIndicator={false}
                              horizontal={true}
                              contentContainerStyle={{
                                marginBottom: (mobileW * 2) / 100,
                              }}
                              keyExtractor={(item, index) => index.toString()}
                              data={item.bookings}
                              renderItem={({index, item}) => {
                                return (
                                  <View
                                    style={{
                                      backgroundColor: Colors.appColor,
                                      paddingHorizontal: (mobileW * 2) / 100,
                                      alignItems: 'center',
                                      marginLeft: (mobileW * 2.5) / 100,
                                      borderRadius: (mobileW * 1.5) / 100,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: Font.fontsemibold,
                                        color: Colors.whiteColor,
                                        fontSize: (mobileW * 3.2) / 100,
                                        paddingVertical: (mobileW * 1) / 100,
                                      }}>
                                      {item.booking_time}
                                    </Text>
                                  </View>
                                );
                              }}
                            />
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
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
  },
  clinicStatusTxt: {
    fontSize: mobileW * 0.03,
    fontFamily: Font.fontregular,
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
