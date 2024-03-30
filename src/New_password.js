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
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
  consolepro,
  Lang_chg,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
} from './Provider/utilslib/Utils';
import {validationprovider} from '../src/Provider/Validation_provider';

export default class Change_password extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      securepass3: true,
      securepass2: true,
      new_password: '',
      con_password: '',
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

  resetBtn = async () => {
    Keyboard.dismiss();
    let {con_password, new_password} = this.state;

    //--------------------new password------------------
    if (new_password.indexOf(' ') != -1) {
      msgProvider.toast(Lang_chg.PasswordSpace[config.language], 'center');
      return false;
    }

    if (new_password.length <= 0) {
      msgProvider.toast(Lang_chg.emptyNewPassword[config.language], 'center');
      return false;
    }
    if (new_password.length <= 5) {
      msgProvider.toast(
        Lang_chg.PasswordNewMinLength[config.language],
        'center',
      );
      return false;
    }
    if (new_password.length > 16) {
      msgProvider.toast(
        Lang_chg.PasswordNewMaxLength[config.language],
        'center',
      );
      return false;
    }
    //--------------------Confirm password------------------
    if (con_password.indexOf(' ') != -1) {
      msgProvider.toast(Lang_chg.PasswordSpace[config.language], 'center');
      return false;
    }

    if (con_password.length <= 0) {
      msgProvider.toast(Lang_chg.emptyConfirmNewPWD[config.language], 'center');
      return false;
    }
    if (con_password.length <= 5) {
      msgProvider.toast(
        Lang_chg.ConfirmPWDMinLength[config.language],
        'center',
      );
      return false;
    }
    if (con_password.length > 16) {
      msgProvider.toast(
        Lang_chg.ConfirmPWDMaxLength[config.language],
        'center',
      );
      return false;
    }
    if (con_password !== new_password) {
      msgProvider.toast(Lang_chg.ConfirmPWDMatch[config.language], 'center');
      return false;
    }
    var user_value = await localStorage.getItemObject('forgot_user_arr');
    var user_id = user_value.user_id;
    var data = new FormData();
    data.append('new_password', new_password);
    data.append('user_id', user_id);
    let url = config.baseURL + 'set_fogot_password';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          msgProvider.toast(
            Lang_chg.successUpdatePass[config.language],
            'center',
          );
          localStorage.clear();
          this.props.navigation.navigate('Login');
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
      <View style={Styles.container}>
        <View style={Styles.container}>
          <SafeAreaView
            style={{backgroundColor: Colors.theme_color, flex: 0}}
          />
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.statusbar_color}
            hidden={false}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />
          <ImageBackground
            source={localimag.new_header}
            style={{
              width: (mobileW * 100) / 100,
              height: (mobileW * 20) / 100,
            }}>
            <View
              style={{
                width: (mobileW * 100) / 100,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: (mobileW * 6) / 100,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  justifyContent: 'center',
                  width: '20%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Image
                  source={localimag.goback}
                  style={{
                    width: (mobileW * 5.5) / 100,
                    height: (mobileW * 5.5) / 100,
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: '80%',
                  alignItems: 'center',
                  paddingRight: (mobileW * 10) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.New_password_placeholder[config.language]}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <View
            style={{
              flexDirection: 'row',
              marginTop: (mobileW * 6) / 100,
              width: (mobileW * 85) / 100,
              alignSelf: 'center',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: Colors.pass_bottom_border,
            }}>
            <View style={{width: '10%'}}>
              <Image
                source={localimag.padlock1}
                resizeMode="contain"
                style={{
                  height: (mobileW * 4.5) / 100,
                  width: (mobileW * 4.5) / 100,
                  paddingLeft: (mobileW * 5) / 100,
                }}
              />
            </View>
            <TextInput
              style={{
                fontFamily: Font.fontmedium,
                fontSize: (mobileW * 3.8) / 100,
                paddingLeft: (mobileW * 1) / 100,
                width: '75%',
                color: Colors.black_color,
                paddingVertical:
                  Platform.OS == 'ios'
                    ? (mobileW * 3) / 100
                    : (mobileW * 1) / 100,
              }}
              placeholder={Lang_chg.newpassword_txt[config.language]}
              placeholderTextColor={Colors.black_color}
              value={this.state.new_password}
              keyboardType="default"
              secureTextEntry={this.state.securepass2}
              maxLength={16}
              returnKeyLabel="done"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              autoCompleteType="off"
              onChangeText={txt => {
                this.setState({new_password: txt});
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({securepass2: !this.state.securepass2});
              }}
              style={{width: '15%'}}>
              {this.state.securepass2 == true ? (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  Show
                </Text>
              ) : (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  Hide
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: (mobileW * 6) / 100,
              width: (mobileW * 85) / 100,
              alignSelf: 'center',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: Colors.pass_bottom_border,
            }}>
            <View style={{width: '10%'}}>
              <Image
                source={localimag.padlock1}
                resizeMode="contain"
                style={{
                  height: (mobileW * 4.5) / 100,
                  width: (mobileW * 4.5) / 100,
                  paddingLeft: (mobileW * 5) / 100,
                }}
              />
            </View>
            <TextInput
              style={{
                fontFamily: Font.fontmedium,
                fontSize: (mobileW * 3.8) / 100,
                paddingLeft: (mobileW * 1) / 100,
                width: '75%',
                color: Colors.black_color,
                paddingVertical:
                  Platform.OS == 'ios'
                    ? (mobileW * 3) / 100
                    : (mobileW * 1) / 100,
              }}
              placeholder={Lang_chg.conformpassword_txt[config.language]}
              placeholderTextColor={Colors.black_color}
              value={this.state.con_password}
              keyboardType="default"
              secureTextEntry={this.state.securepass3}
              maxLength={16}
              returnKeyLabel="done"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              autoCompleteType="off"
              onChangeText={txt => {
                this.setState({con_password: txt});
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({securepass3: !this.state.securepass3});
              }}
              style={{width: '15%'}}>
              {this.state.securepass3 == true ? (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  Show
                </Text>
              ) : (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  Hide
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: Colors.appColor,
              width: (mobileW * 80) / 100,
              borderRadius: 25,
              marginTop: (mobileH * 5) / 100,
              alignSelf: 'center',
            }}
            onPress={() => {
              this.resetBtn();
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                alignSelf: 'center',
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.fontmedium,
                paddingVertical: (mobileW * 2.5) / 100,
              }}>
              {Lang_chg.resetpassword_txt[config.language]}
            </Text>
          </TouchableOpacity>
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
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
