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
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
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
import {Nodata_foundimage} from '../src/Provider/Nodata_foundimage';

const faq_arr = [
  {
    index: 1,
    que: Lang_chg.howoften_txt[config.language],
    ans: Lang_chg.howoften_txt_open[config.language],
    status: false,
  },
  {
    index: 2,
    que: Lang_chg.whydid_txt[config.language],
    ans: Lang_chg.whydid_txt[config.language],
    status: false,
  },
  {
    index: 2,
    que: Lang_chg.isthiswash_txt[config.language],
    ans: Lang_chg.isthiswash_txt[config.language],
    status: false,
  },
];

export default class Faqs extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      faq_arr: 'NA',
      user_type: 2,
      status_index: 0,
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
        this.setFAQS();
      }, 300);
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

  setFAQS = async () => {
    let {user_type} = this.state;
    let user_arr = await localStorage.getItemObject('user_arr');
    let user_id = user_arr.user_id;
    let url = config.baseURL + 'get_faqs/' + user_type + '/' + user_id;
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          this.setState({faq_arr: obj.faqs});
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

  showHide = (index, value) => {
    let data = this.state.faq_arr;
    for (let i = 0; i < data.length; i++) {
      data[i].status = 0;
      if (i == index) {
        data[index].status = value;
      }
    }
    this.setState({faq_arr: data, status_index: value});
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
          <KeyboardAwareScrollView>
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
                        config.textalign == 'right'
                          ? {scaleX: -1}
                          : {scaleX: 1},
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
                    {Lang_chg.faqs_txt[config.language]}
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <View style={{marginTop: (mobileW * 4) / 100}}>
              {this.state.faq_arr == 'NA' ? (
                <Nodata_foundimage />
              ) : (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={this.state.faq_arr}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          width: (mobileW * 90) / 100,
                          borderBottomWidth: (mobileW * 0.2) / 100,
                          borderBottomColor: 'rgb(203,203,203)',
                          alignSelf: 'center',
                          paddingTop: (mobileW * 5) / 100,
                          paddingBottom: (mobileW * 4) / 100,
                        }}>
                        {item.status == 0 ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.showHide(index, 1);
                            }}
                            activeOpacity={0.7}
                            style={{
                              width: (mobileW * 90) / 100,
                              flexDirection: 'row',
                            }}>
                            <View style={{width: '90%'}}>
                              <Text
                                style={{
                                  color: Colors.black_color,
                                  fontSize: (mobileW * 3.5) / 100,
                                  fontFamily: Font.fontsemibold,
                                }}>
                                {index + 1}. {item.question[config.language]}
                              </Text>
                            </View>
                            {item.status == 0 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.showHide(index, 1);
                                }}
                                style={{
                                  width: '10%',
                                  alignItems: 'flex-end',
                                  paddingTop: (mobileW * 0.7) / 100,
                                }}>
                                <Image
                                  resizeMode="contain"
                                  style={{
                                    width: (mobileW * 3.5) / 100,
                                    height: (mobileW * 3.5) / 100,
                                  }}
                                  source={localimag.plus1}></Image>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  this.showHide(index, 0);
                                }}
                                style={{
                                  width: '10%',
                                  alignItems: 'flex-end',
                                  paddingTop: (mobileW * 0.7) / 100,
                                }}>
                                <Image
                                  resizeMode="contain"
                                  style={{
                                    width: (mobileW * 3.5) / 100,
                                    height: (mobileW * 3.5) / 100,
                                  }}
                                  source={localimag.active_plus_icon}></Image>
                              </TouchableOpacity>
                            )}
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              this.showHide(index, 0);
                            }}
                            activeOpacity={0.7}
                            style={{
                              width: (mobileW * 90) / 100,
                              flexDirection: 'row',
                            }}>
                            <View style={{width: '90%'}}>
                              <Text
                                style={{
                                  color: Colors.black_color,
                                  fontSize: (mobileW * 3.5) / 100,
                                  fontFamily: Font.fontsemibold,
                                }}>
                                {index + 1}. {item.question[config.language]}
                              </Text>
                            </View>
                            {item.status == 0 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.showHide(index, 1);
                                }}
                                style={{
                                  width: '10%',
                                  alignItems: 'flex-end',
                                  paddingTop: (mobileW * 0.7) / 100,
                                }}>
                                <Image
                                  resizeMode="contain"
                                  style={{
                                    width: (mobileW * 3.5) / 100,
                                    height: (mobileW * 3.5) / 100,
                                  }}
                                  source={localimag.plus1}></Image>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  this.showHide(index, 0);
                                }}
                                style={{
                                  width: '10%',
                                  alignItems: 'flex-end',
                                  paddingTop: (mobileW * 0.7) / 100,
                                }}>
                                <Image
                                  resizeMode="contain"
                                  style={{
                                    width: (mobileW * 3.5) / 100,
                                    height: (mobileW * 3.5) / 100,
                                  }}
                                  source={localimag.active_plus}></Image>
                              </TouchableOpacity>
                            )}
                          </TouchableOpacity>
                        )}

                        {item.status != 0 && (
                          <View
                            style={{
                              backgroundColor: '#FCDAB3',
                              width: (mobileW * 87) / 100,
                              borderRadius: (mobileW * 1) / 100,
                              marginTop: (mobileW * 1.5) / 100,
                            }}>
                            <View
                              style={{
                                width: '95%',
                                justifyContent: 'center',
                                alignSelf: 'center',
                              }}>
                              <Text
                                style={{
                                  color: Colors.black_color,
                                  fontSize: (mobileW * 3.2) / 100,
                                  paddingTop: (mobileW * 5) / 100,
                                  paddingBottom: (mobileW * 7) / 100,
                                  fontFamily: Font.fontmedium,
                                }}>
                                {item.answer[config.language]}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
        <ImageBackground
          source={localimag.bottom_logo}
          style={{
            height: (mobileW * 65) / 100,
            width: (mobileW * 100) / 100,
            bottom: 0,
          }}
        />
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
