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
import {
  Colors,
  Font,
  mobileH,
  mediaprovider,
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
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class Edit_profile extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible1: false,
      name: '',
      phone_number: '',
      profile_image: 'NA',
      edit_image: 'no',
      password: 'NA',
      email: '',
      login_type: 'app',
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
        this.setProfile();
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

  setProfile = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    var user_pass = await localStorage.getItemObject('user_pass');
    if (user_pass != null) {
      this.setState({password: user_pass});
    }
    var user_image = 'NA';
    if (this.state.edit_image == 'no' && user_arr.image != 'NA') {
      user_image = config.img_url3 + user_arr.image;
    }
    if (user_arr.email != 'NA') {
      var email = user_arr.email;
    } else {
      var email = '';
    }
    this.setState({
      phone_number: user_arr.phone_number,
      name: user_arr.name,
      email: email,
      profile_image: user_image,
      user_id: user_arr.user_id,
      login_type: user_arr.login_type,
    });
  };

  _updateProfile = async () => {
    Keyboard.dismiss();
    let {
      name,
      email,
      phone_number,
      profile_image,
      user_id,
      password,
      login_type,
      user_type,
    } = this.state;
    //------------- name--------------------
    if (name.length <= 0) {
      msgProvider.toast(Lang_chg.emptyName[config.language], 'center');
      return false;
    }
    if (name.length <= 2) {
      msgProvider.toast(Lang_chg.NameMinLength[config.language], 'center');
      return false;
    }
    if (name.length > 25) {
      msgProvider.toast(Lang_chg.NameMaxLength[config.language], 'center');
      return false;
    }
    if ((await validationprovider.textCheck(name)) != true) {
      msgProvider.toast(Lang_chg.validName[config.language], 'center');
      return false;
    }
    //-----------------mobile number--------------------
    if (phone_number.length <= 0) {
      msgProvider.toast(Lang_chg.emptyMobile[(config, language)], 'center');
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
    //-------------------------email address----------------
    if (email != null) {
      if (email.length > 0) {
        if ((await validationprovider.emailCheck(email)) != true) {
          msgProvider.toast(Lang_chg.validEmail[config.language], 'center');
          return false;
        }
      }
    }
    var data = new FormData();
    data.append('user_id', user_id);
    data.append('name', name);
    data.append('email', email);
    data.append('phone_number', phone_number);
    data.append('user_type', user_type);
    if (profile_image != 'NA') {
      data.append('image', {
        uri: profile_image,
        type: 'image/jpg',
        name: 'image.jpg',
      });
    }
    let url = config.baseURL + 'edit_profile';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          localStorage.setItemObject('user_arr', obj.user_details);
          var user_arr = obj.user_details;
          var userValue = {
            name: user_arr.name,
            email: user_arr.email,
            user_id: user_arr.user_id,
            login_type: login_type,
            user_type: user_type,
            password: password,
            phone_number: phone_number,
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

  _openGallery = () => {
    mediaprovider.launchGellery(true).then(obj => {
      this.setState({
        profile_image: obj.path,
        modalVisible1: false,
        edit_image: 'yes',
      });
    });
  };

  _openCamera = () => {
    mediaprovider.launchCamera(true).then(obj => {
      this.setState({
        profile_image: obj.path,
        modalVisible1: false,
        edit_image: 'yes',
      });
    });
  };

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
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
          {/* Camera Modal */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible1}
            onRequestClose={() => {
              this.setState({modalVisible1: !this.state.modalVisible1});
            }}>
            <View
              style={{
                backgroundColor: '#00000080',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <StatusBar
                backgroundColor={Colors.Themecolor}
                barStyle="default"
                hidden={false}
                translucent={false}
                networkActivityIndicatorVisible={true}
              />
              <View
                style={{
                  borderRadius: 20,
                  width: '88%',
                  position: 'absolute',
                  bottom: 0,
                }}>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    width: '100%',
                  }}>
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: (mobileW * 3.2) / 100,
                        alignSelf: 'center',
                        fontFamily: Font.fontmedium,
                        paddingVertical: (mobileH * 2.2) / 100,
                      }}>
                      {Lang_chg.Select_Option[config.language]}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomColor: '#D0D7DE',
                      borderBottomWidth: 1,
                    }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this._openCamera();
                    }}>
                    <Text
                      style={{
                        color: Colors.modalText_color,
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                        paddingVertical: (mobileH * 1.8) / 100,
                      }}>
                      {Lang_chg.MediaCamera[config.language]}
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      borderBottomColor: '#D0D7DE',
                      borderBottomWidth: 1,
                    }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this._openGallery();
                    }}>
                    <Text
                      style={{
                        color: Colors.modalText_color,
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                        paddingVertical: (mobileH * 1.8) / 100,
                      }}>
                      {Lang_chg.Mediagallery[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    width: '100%',
                    paddingVertical: 20,
                    marginVertical: 15,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({modalVisible1: false})}>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                      }}>
                      {Lang_chg.cancelmedia[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Camera Modal Close */}
          <ImageBackground
            source={localimag.bacKground1}
            resizeMode="stretch"
            style={{flex: 1}}>
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
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 5.5) / 100,
                      color: Colors.whiteColor,
                    }}>
                    {Lang_chg.editprofile_txt[config.language]}
                  </Text>
                </View>
              </View>
            </ImageBackground>

            <KeyboardAwareScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: (mobileW * 20) / 100}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible1: !this.state.modalVisible1});
                }}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: (mobileH * 6.5) / 100,
                }}>
                <Image
                  source={
                    this.state.profile_image == 'NA'
                      ? localimag.placeholder_img
                      : {uri: this.state.profile_image}
                  }
                  style={{
                    height: (mobileW * 38) / 100,
                    width: (mobileW * 38) / 100,
                    borderRadius: 90,
                    borderColor: Colors.greyColor,
                    borderWidth: 0.8,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible1: true});
                  }}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 18,
                    backgroundColor: Colors.whiteColor,
                    position: 'absolute',
                    bottom: 13,
                    right: 10,
                    elevation: 10,
                    shadowOffset: {width: 1, height: 1},
                    shadowColor: Colors.shadow_color,
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                  }}>
                  <Image
                    source={localimag.camera1}
                    style={{height: 35, width: 35, bottom: 7}}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <View
                style={{
                  width: (mobileW * 98) / 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: (mobileW * 12) / 100,
                }}>
                <View
                  style={{
                    width: '87%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4.3) / 100,
                      color: Colors.textColors,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.fullname_txt[config.language]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '87%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderBottomWidth: (mobileW * 0.2) / 100,
                    borderBottomColor: Colors.bottom_border,
                    paddingTop: (mobileW * 2) / 100,
                    paddingBottom: (mobileW * 1) / 100,
                  }}>
                  <View style={{width: '8%', justifyContent: 'center'}}>
                    <Image
                      source={localimag.men}
                      style={{
                        height: (mobileW * 5) / 100,
                        width: (mobileW * 5) / 100,
                      }}
                    />
                  </View>
                  <View style={{width: '92%'}}>
                    <TextInput
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 4) / 100,
                        textAlign: config.textalign,
                        color: Colors.black_color,
                        paddingVertical: (mobileW * 1) / 100,
                      }}
                      placeholder={Lang_chg.fullname_txt[config.language]}
                      placeholderTextColor={Colors.signup_placeholder_color}
                      value={this.state.name}
                      keyboardType="default"
                      maxLength={50}
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
                </View>
              </View>

              <View
                style={{
                  width: (mobileW * 98) / 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: (mobileW * 4.5) / 100,
                }}>
                <View
                  style={{
                    width: '87%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  {config.language == 0 && (
                    <Text
                      style={{
                        fontFamily: Font.fontmedium,
                        fontSize: (mobileW * 4.3) / 100,
                        color: Colors.textColors,
                        textAlign: config.textRotate,
                      }}>
                      {Lang_chg.mobile[config.language]}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection:
                      config.textalign == 'left' ? 'row' : 'row-reverse',
                    width: '87%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderBottomWidth: (mobileW * 0.2) / 100,
                    borderBottomColor: Colors.bottom_border,
                    paddingTop: (mobileW * 2) / 100,
                    paddingBottom: (mobileW * 1) / 100,
                  }}>
                  <View style={{width: '9%', justifyContent: 'center'}}>
                    <Image
                      source={localimag.call1}
                      style={{
                        height: (mobileW * 5) / 100,
                        width: (mobileW * 5) / 100,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: '13%',
                      justifyContent: 'center',
                      borderRightColor: Colors.bottom_border,
                      borderRightWidth: (mobileW * 0.2) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.textColors,
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 4) / 100,
                      }}>
                      +20
                    </Text>
                  </View>
                  <View
                    style={{width: '78%', paddingLeft: (mobileW * 1) / 100}}>
                    <TextInput
                      style={{
                        fontFamily: Font.fontregular,
                        textAlign: 'left',
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.black_color,
                        paddingVertical: (mobileW * 1) / 100,
                      }}
                      placeholder={Lang_chg.mobile_txt[config.language]}
                      placeholderTextColor={Colors.signup_placeholder_color}
                      value={this.state.phone_number.toString()}
                      keyboardType="number-pad"
                      maxLength={16}
                      editable={false}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      autoCompleteType="off"
                      onChangeText={txt => {
                        this.setState({phone_number: txt});
                      }}
                    />
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: (mobileW * 98) / 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: (mobileW * 4.5) / 100,
                }}>
                <View
                  style={{
                    width: '87%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4.3) / 100,
                      color: Colors.textColors,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.email[config.language]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '87%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderBottomWidth: (mobileW * 0.2) / 100,
                    borderBottomColor: Colors.bottom_border,
                    paddingTop: (mobileW * 2) / 100,
                    paddingBottom: (mobileW * 1) / 100,
                  }}>
                  <View style={{width: '9%', justifyContent: 'center'}}>
                    <Image
                      source={localimag.email}
                      style={{
                        height: (mobileW * 6.5) / 100,
                        width: (mobileW * 6.5) / 100,
                      }}
                    />
                  </View>
                  <View style={{width: '91%'}}>
                    <TextInput
                      style={{
                        fontFamily: Font.fontregular,
                        fontSize: (mobileW * 4) / 100,
                        textAlign: config.textalign,
                        color: Colors.black_color,
                        paddingVertical: (mobileW * 1) / 100,
                      }}
                      placeholder={Lang_chg.email[config.language]}
                      placeholderTextColor={Colors.signup_placeholder_color}
                      value={this.state.email}
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
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: Colors.appColor,
                  width: (mobileW * 85) / 100,
                  borderRadius: 25,
                  marginTop: (mobileW * 16) / 100,
                  alignSelf: 'center',
                }}
                onPress={() => {
                  this._updateProfile();
                }}>
                <Text
                  style={{
                    color: Colors.whiteColor,
                    alignSelf: 'center',
                    fontSize: (mobileW * 4.3) / 100,
                    fontFamily: Font.fontmedium,
                    paddingVertical: (mobileH * 1.2) / 100,
                  }}>
                  {Lang_chg.update_txt[config.language]}
                </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </ImageBackground>
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
