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
import {ScrollView} from 'react-native-gesture-handler';
import {Shareratepro} from './Provider/Sharerateapp';
import {Switch} from 'react-native-switch';
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

export default class Setting extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      securepass: true,
      notification: true,
      login_type: 'app',
      modalstate: '',
      termsarr: [],
      social_type: 'app',
      user_value: 'NA',
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
        this.setMyProfile();
      }, 500);
      this.getContent();
    });
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
    this.getContent();
  }
  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  setMyProfile = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    this.setState({
      notification: user_arr.notification_status == 1 ? true : false,
    });
  };

  getContent = async () => {
    var url = config.baseURL + 'get_all_content/' + this.state.user_type;
    var socialData = await localStorage.getItemObject('socialdata');
    if (socialData != null) {
      this.setState({login_type: socialData.logintype, userValue: socialData});
    }
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        if (obj.success == 'true') {
          this.setState({termsarr: obj.content_arr});
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

  rateApp = () => {
    let url = 'NA';

    if (Platform.OS == 'ios') {
      url = this.state.termsarr[5].all_content[0];
      if (url != 'NA') {
        Shareratepro.Rateusfunction(url);
      } else {
        this.getContent();
      }
    } else {
      url = this.state.termsarr[4].all_content[0];
      Shareratepro.Rateusfunction(url);
    }
  };

  shareApp = () => {
    let url = 'NA';
    if (this.state.termsarr[6].all_content[0] != null) {
      url = this.state.termsarr[6].all_content[0];
      Shareratepro.sharefunction('Shinefy', url);
    }
  };

  AppLogout = async () => {
    this.setState({modalVisible: false});
    var language = await localStorage.getItemObject('language');
    var languagecathc = await localStorage.getItemObject('languagecathc');
    var languagesetenglish = await localStorage.getItemObject(
      'languagesetenglish',
    );
    localStorage.clear();
    localStorage.setItemObject('language', language);
    localStorage.setItemObject('languagecathc', languagecathc);
    localStorage.setItemObject('languagesetenglish', languagesetenglish);
    localStorage.setItemObject('user_arr', null);
    localStorage.setItemObject('user_value', null);
    this.props.navigation.navigate('Login');
  };

  notificationStatus = async status => {
    this.setState({notification: status});
    var send_status = 0;
    if (this.state.notification == true) {
      send_status = 2;
    } else {
      send_status = 1;
    }
    var user_arr = await localStorage.getItemObject('user_arr');
    var user_id = user_arr.user_id;

    let url =
      config.baseURL +
      'update_notification_status/' +
      user_id +
      '/' +
      send_status;
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          var user_arr = obj.user_details;
          localStorage.setItemObject('user_arr', user_arr);
          this.setMyProfile();
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
      <View style={Styles.container}>
        <View style={Styles.container}>
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
          {/* Modal Open */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <SafeAreaView
              style={{backgroundColor: Colors.theme_color, flex: 0}}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.appColor}
                hidden={false}
                translucent={false}
                networkActivityIndicatorVisible={true}
              />
              <View
                style={{
                  width: (mobileW * 90) / 100,
                  height: (mobileH * 22) / 100,
                  alignSelf: 'center',
                  backgroundColor: Colors.whiteColor,
                  borderRadius: (mobileW * 4) / 100,
                }}>
                <Text
                  style={{
                    marginTop: (mobileH * 4) / 100,
                    marginLeft: (mobileW * 6) / 100,
                    fontSize: (mobileW * 4.8) / 100,
                    color: 'black',
                    fontFamily: Font.fontsemibold,
                    textAlign: config.textRotate,
                  }}>
                  {this.state.modalstate == 1
                    ? Lang_chg.logout1_txt[config.language]
                    : Lang_chg.delete_acc_title[config.language]}
                </Text>
                <Text
                  style={{
                    marginTop: (mobileH * 1) / 100,
                    marginLeft: (mobileW * 6) / 100,
                    fontSize: (mobileW * 4) / 100,
                    color: 'black',
                    fontFamily: Font.fontregular,
                    textAlign: config.textRotate,
                  }}>
                  {this.state.modalstate == 1
                    ? Lang_chg.msgConfirmTextLogoutMsg[config.language]
                    : Lang_chg.delete_acc_msg[config.language]}
                </Text>
                <View
                  style={{
                    marginTop: (mobileH * 5) / 100,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: (mobileW * 32) / 100,
                    alignSelf: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: (mobileW * 6) / 100,
                      width: (mobileW * 15) / 100,
                    }}
                    onPress={() => {
                      this.AppLogout();
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        color: 'red',
                        fontFamily: Font.fontsemibold,
                        textAlign: config.textRotate,
                      }}>
                      {Lang_chg.Yes[config.language]}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: (mobileW * 6) / 100,
                      width: (mobileW * 15) / 100,
                    }}
                    onPress={() => {
                      this.setState({modalVisible: false});
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        color: '#1D77FF',
                        fontFamily: Font.fontsemibold,
                        textAlign: config.textRotate,
                      }}>
                      {Lang_chg.No[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Modal Close */}
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
                  width: '12%',
                  alignItems: 'center',
                  paddingLeft: (mobileW * 3) / 100,
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
                  width: '90%',
                  alignItems: 'center',
                  paddingRight: (mobileW * 10) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.Setting[config.language]}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <ScrollView
            style={{}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={localimag.bacKground1}
              resizeMode="stretch"
              style={{
                width: (mobileW * 100) / 100,
                height: (mobileH * 87) / 100,
              }}>
              {/* -------------------------------NOTIFICATION UPDATE STATUS------------------------- */}
              <View
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.bell}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '50%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.notification_txt[config.language]}
                </Text>
                <View
                  style={{
                    width: '35%',
                    alignItems: 'flex-end',
                    paddingTop: (mobileW * 0.7) / 100,
                  }}>
                  <Switch
                    value={this.state.notification}
                    onValueChange={txt => {
                      this.notificationStatus(txt);
                    }}
                    activeText={''}
                    inActiveText={''}
                    backgroundActive={Colors.appColor}
                    backgroundInactive={'#E9E9E9'}
                    circleActiveColor={Colors.whiteColor}
                    circleInActiveColor={Colors.whiteColor}
                    circleSize={17}
                    barHeight={17}
                    circleBorderWidth={0.4}
                    circleBorderActiveColor={Colors.greyColor}
                    circleBorderInactiveColor={Colors.greyColor}
                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                    switchRightPx={2}
                  />
                </View>
              </View>
              {/* -------------------------------CHANGE PASSWORD---------------------------- */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Change_Password');
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.padlock1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    paddingTop: (mobileW * 0.4) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.changepassword_txt[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------CONTACT US------------------------- */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Contact');
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.telephone1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.contact_txt[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------FAQ'S------------------------------------ */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Faqs');
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.faq1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.faqs_txt[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* ---------------------------------TERMS & CONDITIONS---------------------------------- */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Terms_about_policy', {
                    check: 2,
                  });
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.term1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.tearmsetting[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------PRIVACY POLICY------------------------------------ */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Terms_about_policy', {
                    check: 1,
                  });
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.privacy1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.privacy[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------ABOUT US------------------------------------ */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Terms_about_policy', {
                    check: 0,
                  });
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.about1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.about_us[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------RATE APP------------------------------------ */}
              <View
                style={{
                  borderBottomColor: Colors.bottom_border,
                  borderBottomWidth: (mobileW * 0.5) / 100,
                  width: (mobileW * 90) / 100,
                  marginTop: (mobileW * 1.5) / 100,
                }}>
                <Text></Text>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.rateApp();
                }}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.rate2}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.rate_txt[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------SHARE APP------------------------------------ */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.shareApp();
                }}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.share1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.share_txt[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
              {/* -------------------------------LOGOUT------------------------------------ */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: (mobileW * 92) / 100,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileH * 3.5) / 100,
                }}
                onPress={() => {
                  this.setState({modalVisible: true});
                }}>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.logout1}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: '80%',
                    fontFamily: Font.fontregular,
                    fontSize: (mobileW * 4.2) / 100,
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.logout_txt[config.language]}
                </Text>
                <View style={{width: '10%', paddingTop: (mobileW * 0.7) / 100}}>
                  <Image
                    source={localimag.right_arrow}
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      transform: [
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
                      ],
                    }}
                  />
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </ScrollView>
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
