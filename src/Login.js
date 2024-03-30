import React, {Component} from 'react';
import {
  View,
  Image,
  StatusBar,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TextInput,
  ImageBackground,
  check,
  BackHandler,
  Alert,
} from 'react-native';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {validationprovider} from '../src/Provider/Validation_provider';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone_number: '',
      btn: true,
      securetext: true,
      remember_me: false,
      player_id: config.player_id,
      device_type: config.device_type,
      login_type: 'app',
      user_type: 2,
      password: '',
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }
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
    ); // works best when the goBack is async

    return true;
  };
  //--------- hide show password funtion-------------//
  eyepress = () => {
    if (this.state.securetext) {
      this.setState({securetext: false});
    } else {
      this.setState({securetext: true});
    }
  };

  _loginBtn = async () => {
    Keyboard.dismiss();
    let {
      phone_number,
      password,
      player_id,
      device_type,
      login_type,
      user_type,
    } = this.state;
    //-----------------phone number--------------------
    if (phone_number.length <= 0) {
      msgProvider.toast(Lang_chg.emptyMobile[config.language], 'center');
      return false;
    }
    if (phone_number.length < 7) {
      msgProvider.toast(Lang_chg.MobileMinLength[config.language], 'center');
      return false;
    }
    if (phone_number.length > 15) {
      msgProvider.toast(Lang_chg.MobileMaxLength[config.language], 'center');
      return false;
    }
    if ((await validationprovider.digitCheck(phone_number)) != true) {
      msgProvider.toast(Lang_chg.validMobile[config.language], 'center');
      return false;
    }
    //----------------password---------------------------
    if (password.indexOf(' ') != -1) {
      msgProvider.toast(Lang_chg.PasswordSpace[config.language], 'center');
      return false;
    }
    if (password.length <= 0) {
      msgProvider.toast(Lang_chg.emptyPassword[config.language], 'center');
      return false;
    }
    if (password.length <= 5) {
      msgProvider.toast(Lang_chg.PasswordMinLength[config.language], 'center');
      return false;
    }
    if (password.length > 16) {
      msgProvider.toast(Lang_chg.PasswordMaxLength[config.language], 'center');
      return false;
    }

    var data = new FormData();
    data.append('phone_number', phone_number);
    data.append('password', password);
    data.append('player_id', player_id_me1);
    data.append('device_type', device_type);
    data.append('login_type', login_type);
    data.append('user_type', user_type);
    let url = config.baseURL + 'Login';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          var user_arr = obj.user_details;
          let user_id = user_arr.user_id;
          let user_value = {
            user_id: user_id,
            phone_number: phone_number,
            password: password,
            user_type: user_type,
          };
          localStorage.setItemObject('user_arr', user_arr);
          localStorage.setItemObject('user_value', user_value);
          localStorage.setItemObject('user_pass', password);
          this.setState({phone_number: '', password: ''});
          this.props.navigation.navigate('Home');
        } else {
          setTimeout(() => {
            msgProvider.alert(
              Lang_chg.information[config.language],
              obj.msg[config.language],
              false,
            );
          }, 200);
          if (obj.account_active_status[0] == 'deactivate') {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          return false;
        }
      })
      .catch(err => {
        this.setState({loading: false});
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
        <SafeAreaView style={{backgroundColor: Colors.theme_color, flex: 0}} />
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.statusbar_color}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: (mobileH * 45) / 100,
              borderBottomRightRadius: (mobileW * 8) / 100,
              borderBottomLeftRadius: (mobileW * 8) / 100,
              backgroundColor: Colors.themecolor1,
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{
                height: (mobileW * 47) / 100,
                width: (mobileW * 47) / 100,
                marginTop: (mobileW * 8) / 100,
              }}
              source={localimag.logo}
            />
          </View>
          <View>
            {/* ------------------------Login Details Box---------------------- */}
            <View
              style={{
                width: (mobileW * 88) / 100,
                paddingVertical: (mobileH * 4) / 100,
                elevation: 3,
                backgroundColor: Colors.white_color,
                alignSelf: 'center',
                marginTop: (mobileW * -29) / 100,
                borderRadius: (mobileW * 3) / 100,
                hadowOffset: {width: 1, height: 1},
                shadowColor: Colors.shadow_color,
                shadowOpacity: 0.24,
                shadowRadius: 2.22,
              }}>
              <View
                style={{
                  width: (mobileW * 80) / 100,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                {/* ---------------Login Text---------------------------- */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 65) / 100,
                    paddingLeft: (mobileW * 4) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.fontsemibold,
                      fontSize: (mobileW * 4.3) / 100,
                      color: Colors.black_color,
                      textAlign: config.textalign,
                    }}>
                    {Lang_chg.login1[config.language]}
                  </Text>
                </View>

                {/* ---------------------Mobile---------------------- */}

                <View
                  style={{
                    width: (mobileW * 75) / 100,
                    paddingLeft: (mobileW * 4) / 100,
                    marginTop: (mobileW * 6) / 100,
                  }}>
                  {config.language == 0 && (
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 3.8) / 100,
                        color: Colors.black_color,
                        textAlign: config.textRotate,
                      }}>
                      {Lang_chg.mobile[config.language]}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    width: (mobileW * 74) / 100,
                    borderBottomWidth: 2,
                    borderBottomColor: Colors.bordercolor,
                    alignSelf: 'center',
                    flexDirection:
                      config.textalign == 'left' ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    marginTop: (mobileW * 2) / 100,
                    justifyContent: 'space-between',
                    paddingBottom:
                      Platform.OS == 'ios' ? (mobileW * 2) / 100 : null,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: (mobileW * 5.7) / 100,
                      height: (mobileW * 5.7) / 100,
                      marginLeft: (mobileW * 0.5) / 100,
                    }}
                    source={localimag.call1}
                  />

                  <Text
                    style={{
                      paddingLeft: (mobileW * 2) / 100,
                      color: Colors.black_color,
                      fontFamily: Font.fontregular,
                      fontSize: (mobileW * 3.6) / 100,
                    }}>
                    {Lang_chg.twenty_txt[config.language]}
                  </Text>

                  <View
                    style={{
                      width: (mobileW * 0.9) / 100,
                      height: (mobileW * 6) / 100,
                      borderRightWidth: (mobileW * 0.3) / 100,
                      borderRightColor: Colors.bordercolor,
                      flexDirection: 'row',
                      marginLeft: (mobileW * 2) / 100,
                      paddingTop: (mobileW * 0.2) / 100,
                    }}
                  />
                  <TextInput
                    maxLength={16}
                    value={this.state.phone_number}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    placeholderTextColor={Colors.textColors}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    placeholder={Lang_chg.mobile[config.language]}
                    onChangeText={txt => {
                      this.setState({phone_number: txt});
                    }}
                    style={{
                      width: (mobileW * 55) / 100,
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 3.5) / 100,
                      textAlign: 'left',
                      color: Colors.black_color,
                    }}
                  />
                </View>
              </View>

              {/* --------------------Password------------- */}
              <View
                style={{
                  flexDirection: 'row',
                  width: (mobileW * 65) / 100,
                  paddingLeft: (mobileW * 9) / 100,
                  marginTop: (mobileW * 7) / 100,
                  textAlign: config.textalign,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.9) / 100,
                    color: Colors.black_color,
                  }}>
                  {Lang_chg.password[config.language]}
                </Text>
              </View>
              <View
                style={{
                  width: (mobileW * 71) / 100,
                  borderBottomWidth: 2,
                  borderBottomColor: Colors.bordercolor,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: (mobileW * 2) / 100,
                  paddingBottom:
                    Platform.OS == 'ios' ? (mobileW * 2) / 100 : null,
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: (mobileW * 5.7) / 100,
                    height: (mobileW * 5.7) / 100,
                    marginLeft: (mobileW * 0.5) / 100,
                  }}
                  source={localimag.padlock4}
                />
                {/* --------------------------Vertical Line-------------------------- */}
                <TextInput
                  placeholder={Lang_chg.password[config.language]}
                  placeholderTextColor={Colors.textColors}
                  value={this.state.password}
                  keyboardType="default"
                  secureTextEntry={this.state.securetext}
                  maxLength={16}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  autoCompleteType="off"
                  onChangeText={txt => {
                    this.setState({password: txt});
                  }}
                  style={{
                    width: (mobileW * 52) / 100,
                    marginLeft: (mobileW * 1) / 100,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.7) / 100,
                    textAlign: config.textalign,
                    color: Colors.black_color,
                  }}
                />
                {/* ------------------------Password Show hide-------------------------- */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.setState({securetext: !this.state.securetext});
                  }}
                  style={{
                    width: '17%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {this.state.securetext ? (
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 1) / 100,
                      }}>
                      {Lang_chg.show[config.language]}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 1) / 100,
                      }}>
                      {Lang_chg.Hide[config.language]}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* ------------------------ Login Button -------------------------- */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: (mobileW * 50) / 100,
                  height: (mobileW * 11) / 100,
                  backgroundColor: Colors.statusbarcolor,
                  alignSelf: 'center',
                  marginTop: (mobileW * 5.5) / 100,
                  borderRadius: (mobileW * 6) / 100,
                }}
                onPress={() => {
                  {
                    this._loginBtn();
                  }
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 4.5) / 100,
                    color: Colors.white_color,
                    fontFamily: Font.fontmedium,
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  {Lang_chg.login1[config.language]}
                </Text>
              </TouchableOpacity>

              {/* ----------------------------Forgot Password----------------------------- */}
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Forgot'),
                    this.setState({phone_number: '', password: ''});
                }}
                style={{
                  width: (mobileW * 36) / 100,
                  alignSelf: 'center',
                  alignItems: 'center',
                  paddingTop: (mobileW * 2) / 100,
                  borderBottomWidth: (mobileW * 0.14) / 100,
                  justifyContent: 'center',
                  paddingVertical: (mobileW * 0.5) / 100,
                  borderBottomColor: Colors.statusbarcolor,
                  marginTop: (mobileW * 2) / 100,
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.fontbold,
                    color: Colors.black_color,
                  }}>
                  {' '}
                  {Lang_chg.forget_password_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <HideWithKeyboard>
            <ImageBackground
              source={localimag.bottom_logo}
              style={{
                height: (mobileW * 65) / 100,
                width: (mobileW * 100) / 100,
                bottom: 0,
              }}
            />
          </HideWithKeyboard>
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
  flexStyle: {
    flex: 0,
    backgroundColor: Colors.themecolor,
  },

  icontext1: {
    fontSize: (mobileW * 4) / 100,
    fontFamily: Font.fontmedium,
    color: Colors.black_color,
    alignSelf: 'center',
  },
});
