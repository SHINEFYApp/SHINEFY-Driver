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

export default class Forgot extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      phone_number: '',
      user_type: 2,
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {});
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

  _sendForgotBtn = async () => {
    Keyboard.dismiss();
    let {phone_number, user_type} = this.state;

    //-----------------mobile number--------------------
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
    var data = new FormData();
    data.append('phone_number', phone_number);

    data.append('user_type', user_type);
    let url = config.baseURL + 'forgot_password';
    apifuntion
      .postApi(url, data)
      .then(obj => {

        if (obj.success == 'true') {
          var user_value = {
            user_id: obj.user_id,
            phone_number: phone_number,
          };
          localStorage.setItemObject('forgot_user_arr', user_value);
          this.props.navigation.navigate('Otp_verify', {check: 2});
        } else {
          setTimeout(() => {
            msgProvider.alert(
              Lang_chg.information[config.language],
              obj.msg[config.language],
              false,
            );
          }, 200);
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
      <View style={{flex: 1}}>
        <SafeAreaView
          style={{backgroundColor: Colors.statusbar_color, flex: 0}}
        />
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.statusbarcolor}
          hidden={false}
          translucent={false}
        />
        <KeyboardAwareScrollView>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <ImageBackground
              resizeMode="stretch"
              style={styles.logo}
              source={localimag.forgot_pass_background}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  alignItems: 'flex-start',
                  marginTop: (mobileW * 15) / 100,
                  alignSelf: 'center',
                  width: (mobileW * 85) / 100,
                }}>
                <Image
                  style={{
                    width: (mobileW * 5.5) / 100,
                    height: (mobileW * 5.5) / 100,
                    resizeMode: 'contain',
                    transform: [
                      config.textalign == 'right' ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                  source={localimag.goback}
                />
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: (mobileW * -7) / 100,
                }}>
                <Image
                  style={{
                    height: (mobileW * 45) / 100,
                    width: (mobileW * 45) / 100,
                  }}
                  source={localimag.splash}
                />
              </View>

              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: (mobileW * 85) / 100,
                  paddingVertical: (mobileW * 2) / 100,
                  borderRadius: (mobileW * 3) / 100,
                  backgroundColor: Colors.whiteColor,
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: Colors.shadow_color,
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  marginTop:
                    Platform.OS == 'ios'
                      ? (mobileW * 15) / 100
                      : (mobileW * 3) / 100,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 75) / 100,
                    marginLeft: (mobileW * 1) / 100,
                    marginTop: (mobileW * 11) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.fontbold,
                      fontSize: (mobileW * 3.9) / 100,
                      color: Colors.black_color,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.forgot[config.language]}
                  </Text>
                </View>
                <View
                  style={{
                    width: (mobileW * 75) / 100,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: (mobileW * 7) / 100,
                  }}>
                  <View
                    style={{
                      width: (mobileW * 70) / 100,
                      marginLeft: (mobileW * 1) / 100,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.fontmedium,
                        fontSize: (mobileW * 3.8) / 100,
                        color: Colors.black_color,
                        textAlign: config.textRotate,
                      }}>
                      {Lang_chg.mobile[config.language]}
                    </Text>
                  </View>
                  <View style={styles.ViewText}>
                    <View style={styles.ImageView}>
                      <Image
                        style={{
                          height: (mobileW * 5.5) / 100,
                          width: (mobileW * 5.5) / 100,
                        }}
                        source={localimag.call1}
                      />
                    </View>
                    <View
                      style={{
                        borderRightColor: Colors.bottom_border,
                        borderRightWidth: 1,
                        paddingHorizontal: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 3.9) / 100,
                          color: Colors.black_color,
                          width: (mobileW * 9) / 100,
                          alignSelf: 'center',
                        }}>
                        +20
                      </Text>
                    </View>
                    <TextInput
                      style={styles.textInputView}
                      onChangeText={txt => {
                        this.setState({phone_number: txt});
                      }}
                      maxLength={15}
                      value={this.state.phone_number}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      keyboardType="number-pad"
                      placeholderTextColor={Colors.textColors}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      placeholder={Lang_chg.mobile_txt[config.language]}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    this._sendForgotBtn();
                  }}
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 50) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 6) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: (mobileW * 6) / 100,
                    paddingVertical: (mobileW * 2.8) / 100,
                    backgroundColor: Colors.appColor,
                    marginBottom: (mobileW * 14) / 100,
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.9) / 100,
                      color: Colors.whiteColor,
                      fontFamily: Font.fontmedium,
                      textAlign: config.textAlign,
                      paddingLeft: 4,
                    }}>
                    {Lang_chg.send[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  logo: {
    width: (mobileW * 100) / 100,
    height: (mobileH * 100) / 100,
  },
  imageView: {
    height: (mobileW * 3.5) / 100,
    width: (mobileW * 9) / 100,
    resizeMode: 'contain',
  },
  ViewText: {
    flexDirection: config.textalign == 'left' ? 'row' : 'row-reverse',
    width: (mobileW * 76) / 100,
    borderBottomColor: Colors.textColors,
    borderBottomWidth: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (mobileW * 2.5) / 100,
  },
  textInputView: {
    width: '70%',
    justifyContent: 'center',

    alignSelf: 'center',
    fontFamily: Font.fontmedium,
    color: Colors.black_color,
    fontSize: (mobileW * 3.9) / 100,
    paddingLeft: (mobileW * 1.5) / 100,
    textAlign: 'left',
  },
  ImageView: {
    paddingVertical: (mobileW * 1) / 100,
    width: '9%',
  },
  img: {
    height: (mobileW * 47) / 100,
    width: (mobileW * 47) / 100,
  },
});
