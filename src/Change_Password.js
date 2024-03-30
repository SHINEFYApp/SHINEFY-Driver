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
      securepass1: true,
      old_password: '',
      new_password: '',
      con_password: '',
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
  _updatePassword = async () => {
    Keyboard.dismiss();
    let {old_password, con_password, new_password, user_type} = this.state;

    //--------------------old password------------------
    if (old_password.indexOf(' ') != -1) {
      msgProvider.toast(Lang_chg.PasswordSpace[config.language], 'center');
      return false;
    }
    if (old_password.length <= 0) {
      msgProvider.toast(Lang_chg.emptyoldPassword[config.language], 'center');
      return false;
    }
    if (old_password.length <= 5) {
      msgProvider.toast(
        Lang_chg.PasswordoldMinLength[config.language],
        'center',
      );
      return false;
    }
    if (old_password.length > 16) {
      msgProvider.toast(
        Lang_chg.PasswordoldMaxLength[config.language],
        'center',
      );
      return false;
    }
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
    if (old_password == new_password) {
      msgProvider.toast(Lang_chg.diffrentPassword[config.language], 'center');
      return false;
    }
    //--------------------Confirm password------------------
    if (con_password.indexOf(' ') != -1) {
      msgProvider.toast(Lang_chg.PasswordSpace[config.language], 'center');
      return false;
    }

    if (con_password.length <= 0) {
      msgProvider.toast(Lang_chg.emptyConfirmPWD[config.language], 'center');
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

    var user_arr = await localStorage.getItemObject('user_arr');
    var user_id = user_arr.user_id;
    var data = new FormData();
    data.append('old_password', old_password);
    data.append('new_password', new_password);
    data.append('user_type', user_type);
    data.append('user_id', user_id);
    let url = config.baseURL + 'change_password';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          var user_arr = obj.user_details;
          localStorage.setItemObject('user_arr', obj.user_details);
          localStorage.setItemString('password', new_password);
          var userValue = {
            name: user_arr.name,
            phone_number: user_arr.phone_number,
            password: new_password,
            user_id: user_arr.user_id,
            login_type: 'app',
            user_type: 1,
          };
          localStorage.setItemObject('user_value', userValue);

          msgProvider.toast(obj.msg[config.language], 'center');
          this.props.navigation.goBack();
        } else {
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
                    transform: [
                      config.textalign == 'right' ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: '80%',
                  alignItems: 'center',
                  paddingRight: (mobileW * 13) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.changepassword_txt[config.language]}
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View
            style={{
              flexDirection: 'row',
              marginTop: (mobileW * 10) / 100,
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
                textAlign: config.textalign,
                fontSize: (mobileW * 4) / 100,
                paddingLeft: (mobileW * 1) / 100,
                width: '75%',
                color: Colors.black_color,
                paddingVertical:
                  Platform.OS == 'ios' ? (mobileW * 3) / 100 : null,
              }}
              placeholder={Lang_chg.oldPassword_txt[config.language]}
              placeholderTextColor={Colors.black_color}
              value={this.state.old_password}
              keyboardType="default"
              secureTextEntry={this.state.securepass1}
              maxLength={16}
              returnKeyLabel="done"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              autoCompleteType="off"
              onChangeText={txt => {
                this.setState({old_password: txt});
              }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({securepass1: !this.state.securepass1});
              }}
              style={{width: '15%'}}>
              {this.state.securepass1 == true ? (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  {Lang_chg.show[config.language]}
                </Text>
              ) : (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  {Lang_chg.Hide[config.language]}
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
                fontSize: (mobileW * 4) / 100,
                textAlign: config.textalign,
                paddingLeft: (mobileW * 1) / 100,
                width: '75%',
                color: Colors.black_color,
                paddingVertical:
                  Platform.OS == 'ios' ? (mobileW * 3) / 100 : null,
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
                  {Lang_chg.show[config.language]}
                </Text>
              ) : (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  {Lang_chg.Hide[config.language]}
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
                textAlign: config.textalign,
                fontSize: (mobileW * 4) / 100,
                paddingLeft: (mobileW * 1) / 100,
                width: '75%',
                color: Colors.black_color,
                paddingVertical:
                  Platform.OS == 'ios' ? (mobileW * 3) / 100 : null,
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
                  {Lang_chg.show[config.language]}
                </Text>
              ) : (
                <Text
                  style={{
                    color: Colors.black_color,
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.4) / 100,
                  }}>
                  {Lang_chg.Hide[config.language]}
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
              this._updatePassword();
            }}>
            <Text
              style={{
                color: Colors.whiteColor,
                alignSelf: 'center',
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.fontmedium,
                paddingVertical: (mobileW * 2) / 100,
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
