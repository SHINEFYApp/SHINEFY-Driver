import React, {Component} from 'react';
import {
  View,
  Image,
  BackHandler,
  Keyboard,
  Text,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
import {validationprovider} from '../src/Provider/Validation_provider';

import CountDown from 'react-native-countdown-component';
import OTPTextInput from 'react-native-otp-textinput';

export default class Otp_verify extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      check: this.props.route.params.check,
      phone_number: '',
      user_id: '',
      device_type: config.device_type,
      player_id: '123456',
      user_otp: '',
      countshow: true,
      user_type: 2,
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
        this.setOTP();
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

  setOTP = async () => {
    let user_value = await localStorage.getItemObject('forgot_user_arr');
    this.setText(user_value.otp);
    this.setState({
      phone_number: user_value.phone_number,
      user_id: user_value.user_id,
    });
  };

  _OTPVerifyBtn = async () => {
    let {
      user_otp,
      device_type,
      player_id,
      phone_number,
      user_id,
      check,
      user_type,
    } = this.state;
    if (user_otp.length <= 0) {
      msgProvider.toast(Lang_chg.Otp_validation[config.language], 'center');
      return false;
    }
    if (user_otp.length <= 3) {
      msgProvider.toast(Lang_chg.Enter_otp[config.language], 'center');
      return false;
    }
    var data = new FormData();
    data.append('user_id', user_id);
    data.append('otp', user_otp);
    data.append('user_type', user_type);
    data.append('device_type', device_type);
    data.append('player_id', player_id);
    data.append('status', check);
    var url = config.baseURL + 'otp_verify';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          this.props.navigation.navigate('New_password');
        } else {
          if (obj.account_active_status[0] == 'deactivate') {
            config.checkUserDeactivate(this.props.navigation);
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
        } else {
          msgProvider.alert(
            Lang_chg.msgTitleServerNotRespond[config.language],
            Lang_chg.serverNotRespond[config.language],
            false,
          );
        }
      });
  };

  clearText = () => {
    this.otpInput.clear();
  };

  setText = otp => {
    this.otpInput.setValue(otp.toString());
  };

  _resendBtn = async () => {
    let {user_id, check} = this.state;
    var url = config.baseURL + 'resend_otp/' + user_id + '/' + check;
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          this.clearText();
          this.setText(obj.otp);
        } else {
          msgProvider.alert(
            Lang_chg.information[config.language],
            obj.msg[config.language],
            false,
          );
          if (obj.account_active_status == 'deactivate') {
            config.checkUserDeactivate(this.props.navigation);
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
        } else {
          msgProvider.alert(
            Lang_chg.msgTitleServerNotRespond[config.language],
            Lang_chg.serverNotRespond[config.language],
            false,
          );
        }
      });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 1}}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <SafeAreaView
            style={{backgroundColor: Colors.statusbar_color, flex: 0}}
          />
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.statusbarcolor}
            hidden={false}
            translucent={false}
          />
          <ImageBackground
            resizeMode="stretch"
            style={styles.logo}
            source={localimag.sucess1}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                alignItems: 'flex-start',
                marginTop: (mobileW * 13) / 100,
                alignSelf: 'center',
                width: (mobileW * 85) / 100,
              }}>
              <Image
                style={{
                  width: (mobileW * 5.5) / 100,
                  height: (mobileW * 5.5) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.goback}
              />
            </TouchableOpacity>
            <View style={{marginTop: (mobileW * 35) / 100}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: (mobileW * 5.6) / 100,
                    fontFamily: Font.fontsemibold,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.otp_verification[config.language]}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: (mobileW * 2) / 100,
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.2) / 100,
                    fontFamily: Font.fontmedium,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.otp_verification_msg[config.language]}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.5) / 100,
                    fontFamily: Font.fontmedium,
                    color: Colors.whiteColor,
                  }}>
                  +20 {this.state.phone_number}{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.fontbold,
                      color: Colors.whiteColor,
                      textDecorationLine: 'underline',
                    }}>
                    {Lang_chg.edit[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.container_otp}>
                <OTPTextInput
                  ref={e => (this.otpInput = e)}
                  containerStyle={styles.textInputContainer}
                  textInputStyle={styles.roundedTextInput}
                  handleTextChange={text => this.setState({user_otp: text})}
                  numberOfInputs={4}
                  cellTextLength={1}
                  tintColor="#FFFFFF"
                  offTintColor="#FFFFFF"
                  keyboardType={'number-pad'}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this._OTPVerifyBtn();
                }}
                style={{
                  flexDirection: 'row',
                  width: (mobileW * 60) / 100,
                  alignSelf: 'center',
                  marginTop: (mobileW * 6) / 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: (mobileW * 10) / 100,
                  paddingVertical: (mobileW * 2.8) / 100,
                  backgroundColor: Colors.whiteColor,
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.9) / 100,
                    color: Colors.appColor,
                    fontFamily: Font.fontsemibold,
                    textAlign: config.textAlign,
                    paddingLeft: 4,
                  }}>
                  {Lang_chg.verify[config.language]}
                </Text>
              </TouchableOpacity>
              {this.state.countshow == false ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    this._resendBtn(), this.setState({countshow: true});
                  }}
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: (mobileW * 1.5) / 100,
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.7) / 100,
                      fontFamily: Font.fontbold,
                      color: Colors.whiteColor,
                      textDecorationLine: 'underline',
                    }}>
                    {Lang_chg.resend[config.language]}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    borderRadius: (mobileW * 20) / 100,
                    marginTop: (mobileW * 3) / 100,
                  }}>
                  <CountDown
                    until={60 * 2}
                    size={15}
                    onFinish={() => {
                      this.setState({countshow: false});
                    }}
                    digitStyle={{
                      backgroundColor: '#FFF',
                      borderRadius: (mobileW * 9) / 100,
                      width: (mobileW * 9) / 100,
                    }}
                    digitTxtStyle={{color: Colors.appColor}}
                    timeLabelStyle={{color: '#eb133a', fontSize: 1}}
                    timeToShow={['M', 'S']}
                    separatorStyle={{
                      color: Colors.whiteColor,
                      paddingHorizontal: (mobileW * 1) / 100,
                    }}
                    timeLabels={{m: '', s: ''}}
                    showSeparator={true}
                  />
                </View>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    width: (mobileW * 100) / 100,
    height: (mobileH * 100) / 100,
  },
  container_otp: {
    width: (mobileW * 90) / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: (mobileW * 3) / 100,
  },
  textInputContainer: {
    alignSelf: 'center',
    width: (mobileW * 60) / 100,
  },
  roundedTextInput: {
    borderRadius: (mobileW * 6) / 100,
    borderWidth: 4,
    backgroundColor: Colors.whiteColor,
    color: Colors.main_font,
    height: (mobileW * 10) / 100,
    fontSize: (mobileW * 4.2) / 100,
    width: (mobileW * 10) / 100,
  },
});
