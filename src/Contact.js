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

export default class Contact extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      phone_number: '',
      user_type: 2,
      editable: true,
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
        this.setMyProfile();
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

  setMyProfile = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    var email = '';
    var editable = true;
    if (user_arr.email != 'NA') {
      email = user_arr.email;
      editable = false;
    }
    this.setState({
      name: user_arr.name,
      email: email,
      user_id: user_arr.user_id,
      phone_number: user_arr.phone_number,
      editable: editable,
    });
  };

  _sendBtn = async () => {
    Keyboard.dismiss();
    let {name, phone_number, email, message, user_id, user_type} = this.state;
    //-------------------------email address----------------
    if (email.trim().length <= 0) {
      msgProvider.toast(Lang_chg.emptyEmail[config.language], 'center');
      return false;
    }
    if (email.trim().length > 100) {
      msgProvider.toast(Lang_chg.emailMaxLength[config.language], 'center');
      return false;
    }
    if ((await validationprovider.emailCheck(email)) != true) {
      msgProvider.toast(Lang_chg.validEmail[config.language], 'center');
      return false;
    }
    //-------------------------Message-------------------------
    if (message.trim().length <= 0) {
      msgProvider.toast(Lang_chg.emptyMessage[config.language], 'center');
      return false;
    }
    if (message.trim().length <= 2) {
      msgProvider.toast(Lang_chg.minlenMessage[config.language], 'center');
      return false;
    }
    if (message.trim().length > 250) {
      msgProvider.toast(Lang_chg.maxlenMessage[config.language], 'center');
      return false;
    }

    var data = new FormData();
    data.append('name', name);
    data.append('phone_number', phone_number);
    data.append('user_type', user_type);
    data.append('user_id', user_id);
    data.append('email', email);
    data.append('message', message);
    let url = config.baseURL + 'contact_us';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          localStorage.setItemObject('user_arr', obj.user_arr);
          msgProvider.alert(
            Lang_chg.information[config.language],
            obj.msg[config.language],
            false,
          );
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
                  width: '18%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Image
                  source={localimag.goback}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                    transform: [
                      config.textalign == 'right' ? {scaleX: -1} : {scaleX: 1},
                    ],
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: '82%',
                  alignItems: 'center',
                  paddingRight: (mobileW * 15) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.contactus_txt[config.language]}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{}}>
            <ImageBackground
              source={localimag.bacKground1}
              resizeMode="stretch"
              style={{
                width: (mobileW * 100) / 100,
                height: (mobileH * 100) / 100,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileW * 13) / 100,
                  width: (mobileW * 88) / 100,
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.pass_bottom_border,
                }}>
                <View style={{width: '10%', paddingLeft: (mobileW * 2) / 100}}>
                  <Image
                    source={localimag.user1}
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
                  placeholder={Lang_chg.name[config.language]}
                  placeholderTextColor={Colors.black_color}
                  value={this.state.name}
                  keyboardType="default"
                  maxLength={50}
                  editable={false}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  autoCompleteType="off"
                  onChangeText={txt => {
                    this.setState({name: txt});
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileW * 6) / 100,
                  width: (mobileW * 88) / 100,
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.pass_bottom_border,
                }}>
                <View style={{width: '10%', paddingLeft: (mobileW * 2) / 100}}>
                  <Image
                    source={localimag.email12}
                    resizeMode="contain"
                    style={{
                      height: (mobileW * 4.3) / 100,
                      width: (mobileW * 4.3) / 100,
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
                  placeholder={Lang_chg.email[config.language]}
                  placeholderTextColor={Colors.black_color}
                  value={this.state.email}
                  editable={this.state.editable == true ? true : false}
                  keyboardType="default"
                  maxLength={100}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  autoCompleteType="off"
                  onChangeText={txt => {
                    this.setState({email: txt});
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: (mobileW * 88) / 100,
                  marginTop: (mobileW * 6) / 100,
                  alignSelf: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.pass_bottom_border,
                }}>
                <View
                  style={{
                    width: '10%',
                    paddingLeft: (mobileW * 2) / 100,
                    paddingTop: (mobileW * 3) / 100,
                  }}>
                  <Image
                    source={localimag.pen1}
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
                    textAlignVertical: 'top',
                    paddingLeft: (mobileW * 1) / 100,
                    width: '75%',
                    color: Colors.black_color,
                    height: (mobileW * 30) / 100,
                  }}
                  placeholder={Lang_chg.message_txt[config.language]}
                  placeholderTextColor={Colors.black_color}
                  value={this.state.message}
                  keyboardType="default"
                  multiline={true}
                  secureTextEntry={this.state.securepass3}
                  maxLength={250}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  autoCompleteType="off"
                  onChangeText={txt => {
                    this.setState({message: txt});
                  }}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: Colors.appColor,
                  width: (mobileW * 80) / 100,
                  borderRadius: 25,
                  marginTop: (mobileH * 8) / 100,
                  alignSelf: 'center',
                }}
                onPress={() => {
                  this._sendBtn();
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    alignSelf: 'center',
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.fontmedium,
                    paddingVertical: (mobileW * 2.2) / 100,
                  }}>
                  {Lang_chg.Submit[config.language]}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </KeyboardAwareScrollView>
        </View>
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
