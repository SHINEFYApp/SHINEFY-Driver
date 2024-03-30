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
import DashedLine from 'react-native-dashed-line';
import StarRating from 'react-native-star-rating';
import {notification} from './Provider/NotificationProvider';
import Image1 from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

export default class Bookings_Details extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      cameraModal: false,
      modalVisible1: false,
      openImageModal: false,
      booking_id: this.props.route.params.booking_id,
      customer_id: this.props.route.params.customer_id,
      check: '',
      status: '',
      booking_arr: 'NA',
      btnTxt: '',
      user_id: '',
      name: '',
      profile_image: 'NA',
      image_id: 0,
      image1: 'NA',
      image2: 'NA',
      image3: 'NA',
      image4: 'NA',
      image5: 'NA',
      image6: 'NA',
      image7: 'NA',
      image8: 'NA',
      update_image_status: 'NO',
      fullImage: '',
      payment_method: '',
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState({booking_id: this.props.route.params.booking_id});
      setTimeout(() => {
        this.setBookingDetails();
      }, 500);
    });
    setTimeout(() => {
      this.setBookingDetails();
    }, 500);
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }

  setBookingDetails = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    let user_id = user_arr.user_id;
    let booking_id = this.state.booking_id;
    this.setState({user_id: user_id, name: user_arr.name});
    var url =
      config.baseURL + 'get_driver_booking/' + user_id + '/' + booking_id;
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          localStorage.setItemObject('user_arr', obj.user_details);
          this.setState({booking_arr: obj.booking_arr});
          this.nanigationFun();
        } else {
          if (obj.account_active_status[0] == 'deactivate') {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          if (obj.acount_delete_status[0] == 'deactivate') {
            config.checkUserDelete(this.props.navigation);
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

  handleBackPress = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  nanigationFun = async () => {
    let data = this.state.booking_arr;
    if (data.on_the_way_status == 0) {
      this.setState({
        btnTxt: Lang_chg.ontheway_txt[config.language],
        status: 1,
      });
    } else if (data.on_the_way_status == 1 && data.arrive_status == 0) {
      this.setState({btnTxt: Lang_chg.arrive_txt[config.language], status: 2});
    } else if (data.arrive_status == 1 && data.washing_status == 0) {
      this.setState({
        btnTxt: Lang_chg.startwashing_txt[config.language],
        status: 3,
      });
    } else if (data.washing_status == 1 && data.completed_status == 0) {
      this.setState({
        btnTxt: Lang_chg.completed_txt[config.language],
        status: 4,
        payment_method: data.payment_method,
      });
      if (data.payment_method == 1) {
        localStorage.removeItem('get_booking_arr');
      }
    } else if (
      data.completed_status == 1 &&
      data.payment_method == 0 &&
      data.payment_collect_status == 0
    ) {
      this.setState({
        btnTxt: Lang_chg.collect_txt[config.language],
        status: 5,
        payment_method: data.payment_method,
      });
    } else if (data.payment_collect_status == 1 && data.payment_method == 0) {
      this.setState({status: 6});
      localStorage.removeItem('get_booking_arr');
    } else {
      this.setState({status: 6});
    }
  };

  _openGallery = () => {
    mediaprovider.launchGellery(true).then(obj => {
      this.insertImage(obj);
    });
  };

  _openCamera = () => {
    mediaprovider.launchCamera(true).then(obj => {
      this.insertImage(obj);
    });
  };

  insertImage = async obj => {
    let {image_id} = this.state;
    if (image_id == 1) {
      this.setState({
        cameraModal: false,
        image1: obj.path,
        update_image_status: 'YES',
      });
    } else if (image_id == 2) {
      this.setState({
        cameraModal: false,
        image2: obj.path,
        update_image_status: 'YES',
      });
    } else if (image_id == 3) {
      this.setState({
        cameraModal: false,
        image3: obj.path,
        update_image_status: 'YES',
      });
    } else if (image_id == 4) {
      this.setState({
        cameraModal: false,
        image4: obj.path,
        update_image_status: 'YES',
      });
    } else if (image_id == 5) {
      this.setState({
        cameraModal: false,
        image5: obj.path,
        update_image_status: 'YES',
      });
    } else if (image_id == 6) {
      this.setState({
        cameraModal: false,
        image6: obj.path,
        update_image_status: 'YES',
      });
    } else if (image_id == 7) {
      this.setState({
        cameraModal: false,
        image7: obj.path,
        update_image_status: 'YES',
      });
    } else {
      this.setState({
        cameraModal: false,
        image8: obj.path,
        update_image_status: 'YES',
      });
    }
  };

  updateStatus = async () => {
    let {
      user_id,
      booking_id,
      status,
      update_image_status,
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      payment_method,
    } = this.state;
    if (status != 4) {
      var url =
        config.baseURL +
        'update_driver_status/' +
        user_id +
        '/' +
        booking_id +
        '/' +
        status +
        '/' +
        this.state.booking_arr.user_id;
      apifuntion
        .getApi(url)
        .then(obj => {
          if (obj.success == 'true') {
            localStorage.setItemObject('user_arr', obj.user_details);
            if (obj.notification_arr != 'NA') {
              notification.notification_arr_schedule(obj.notification_arr);
            }
            this.setState({booking_arr: obj.booking_arr});
            this.nanigationFun();
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
            if (obj.acount_delete_status[0] == 'deactivate') {
              config.checkUserDelete(this.props.navigation);
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
    } else {
      if (update_image_status == 'NO') {
        msgProvider.toast(Lang_chg.emptySelectImage[config.language], 'center');
        return false;
      }
      var data = new FormData();
      data.append('user_id', user_id);
      data.append('booking_id', booking_id);
      data.append('status', status);
      data.append('payment_method', payment_method);
      data.append('customer_id', this.state.booking_arr.user_id);
      if (image1 != 'NA') {
        data.append('image1', {
          uri: image1,
          type: 'image1/jpg',
          name: 'image1.jpg',
        });
      } else {
        data.append('image1', image1);
      }

      if (image2 != 'NA') {
        data.append('image2', {
          uri: image2,
          type: 'image2/jpg',
          name: 'image2.jpg',
        });
      } else {
        data.append('image2', image2);
      }

      if (image3 != 'NA') {
        data.append('image3', {
          uri: image3,
          type: 'image3/jpg',
          name: 'image3.jpg',
        });
      } else {
        data.append('image3', image3);
      }

      if (image4 != 'NA') {
        data.append('image4', {
          uri: image4,
          type: 'image4/jpg',
          name: 'image4.jpg',
        });
      } else {
        data.append('image4', image4);
      }

      if (image5 != 'NA') {
        data.append('image5', {
          uri: image5,
          type: 'image5/jpg',
          name: 'image5.jpg',
        });
      } else {
        data.append('image5', image5);
      }

      if (image6 != 'NA') {
        data.append('image6', {
          uri: image6,
          type: 'image6/jpg',
          name: 'image6.jpg',
        });
      } else {
        data.append('image6', image6);
      }

      if (image7 != 'NA') {
        data.append('image7', {
          uri: image7,
          type: 'image7/jpg',
          name: 'image7.jpg',
        });
      } else {
        data.append('image7', image7);
      }

      if (image8 != 'NA') {
        data.append('image8', {
          uri: image8,
          type: 'image8/jpg',
          name: 'image8.jpg',
        });
      } else {
        data.append('image8', image8);
      }

      let url = config.baseURL + 'uploadCarImage';
      apifuntion
        .postApi(url, data)
        .then(obj => {
          if (obj.success == 'true') {
            localStorage.setItemObject('user_arr', obj.user_details);
            this.setState({booking_arr: obj.booking_arr});
            if (obj.notification_arr != 'NA') {
              notification.notification_arr_schedule(obj.notification_arr);
            }
            this.nanigationFun();
          } else {
            setTimeout(() => {
              msgProvider.alert(
                Lang_chg.information[config.language],
                obj.msg[config.language],
                false,
              );
            }, 200);
            if (obj.account_active_status == 'deactivate') {
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
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <SafeAreaView style={{backgroundColor: Colors.appColor, flex: 0}} />
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.appColor}
            hidden={false}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />
          {/* Report Modal */}
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
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: (mobileW * 3.7) / 100,
                        alignSelf: 'center',
                        fontFamily: Font.fontmedium,
                        paddingVertical: (mobileH * 2.2) / 100,
                      }}>
                      {Lang_chg.Select_Option[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderBottomColor: '#D0D7DE',
                      borderBottomWidth: 1,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({modalVisible1: false}),
                        this.props.navigation.navigate('Reason_message', {
                          msg_page_status: 2,
                        });
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                        paddingTop: (mobileH * 3) / 100,
                        paddingBottom: (mobileH * 3) / 100,
                      }}>
                      {Lang_chg.report[config.language]}
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
          {/* Report Modal */}

          {/* Camera Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.cameraModal}
            onRequestClose={() => {
              this.setState({cameraModal: !this.state.cameraModal});
            }}>
            <View
              style={{
                backgroundColor: '#00000080',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: -50,
              }}>
              <StatusBar
                backgroundColor={Colors.themecolor}
                barStyle="default"
                hidden={false}
                translucent={false}
                networkActivityIndicatorVisible={true}
              />
              <View
                style={{
                  borderRadius: 20,
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                }}>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    width: '100%',
                    paddingVertical: 20,
                  }}>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: Font.fontregular,
                        color: Colors.modalTxt,
                        fontSize: (mobileW * 3.7) / 100,
                        alignSelf: 'center',
                      }}>
                      {Lang_chg.Select_Option[config.language]}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomColor: '#D0D7DE',
                      borderBottomWidth: 1,
                      marginTop: 10,
                    }}
                  />
                  {/* camera ----------------------------*/}
                  <TouchableOpacity
                    onPress={() => {
                      this._openCamera();
                    }}>
                    <Text
                      style={{
                        color: Colors.modalTxt,
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                        marginTop: 10,
                      }}>
                      Camera
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      borderBottomColor: '#D0D7DE',
                      borderBottomWidth: 1,
                      marginTop: 10,
                    }}
                  />
                  {/* gallery----------------------------*/}
                  <TouchableOpacity
                    onPress={() => {
                      this._openGallery();
                    }}>
                    <Text
                      style={{
                        color: Colors.modalTxt,
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                        marginTop: 15,
                      }}>
                      Gallery
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
                    onPress={() => {
                      this.setState({cameraModal: false});
                    }}>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: (mobileW * 4) / 100,
                        fontFamily: Font.fontmedium,
                        alignSelf: 'center',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Close Camera Modal */}
          {/* Open Image Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.openImageModal}
            onRequestClose={() => {
              this.setState({openImageModal: !this.state.openImageModal});
            }}>
            <View style={{flex: 1, backgroundColor: '#000'}}>
              <SafeAreaView style={{flex: 0}} />
              <TouchableOpacity
                onPress={() => {
                  this.setState({openImageModal: false});
                }}
                style={{
                  width: (mobileW * 10) / 100,
                  alignItems: 'center',
                  marginTop: (mobileW * 8) / 100,
                }}>
                <Image
                  source={localimag.goback}
                  style={{
                    width: (mobileW * 5) / 100,
                    height: (mobileW * 5) / 100,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  height: (mobileH * 100) / 100,
                  width: (mobileW * 100) / 100,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({openImageModal: false});
                  }}
                  style={{
                    width: (mobileW * 10) / 100,
                    height: (mobileH * 10) / 100,
                    paddingTop: 30,
                    paddingRight: 20,
                    position: 'absolute',
                    right: 0,
                    top: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
                <View
                  style={{
                    alignSelf: 'center',
                    width: '100%',
                    height: (mobileH * 60) / 100,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{uri: config.img_url3 + this.state.fullImage}}
                    style={{
                      width: '100%',
                      height: (mobileH * 60) / 100,
                      alignSelf: 'center',
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {/* close Open Image Modal */}
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
                activeOpacity={0.7}
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
                  source={localimag.goback}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: '72%',
                  alignItems: 'center',
                  paddingLeft: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {this.state.booking_arr != 'NA' &&
                    this.state.booking_arr.booking_no}
                </Text>
              </View>
            </View>
          </ImageBackground>
          {/* ----------------------------------End Header------------------------------------- */}
          <ImageBackground
            source={localimag.bacKground1}
            resizeMode="stretch"
            style={{
              width: (mobileW * 100) / 100,
              height: (mobileH * 87) / 100,
            }}>
            {this.state.booking_arr != 'NA' && (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: (mobileW * 15) / 100}}>
                <View
                  style={{
                    width: (mobileW * 90) / 100,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: (mobileW * 5) / 100,
                  }}>
                  <View style={{width: '60%', justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: Colors.signup_placeholder_color,
                        fontFamily: Font.fontsemibold,
                        fontSize: (mobileW * 3.5) / 100,
                        textAlign: config.textRotate,
                      }}>
                      {this.state.booking_arr.createtime}
                    </Text>
                  </View>
                  <View style={{width: '40%', justifyContent: 'center'}}>
                    {this.state.booking_arr.status == 1 && (
                      <Text
                        style={{
                          color: Colors.blue,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.4) / 100,
                          textAlign: 'right',
                        }}>
                        {Lang_chg.inprogress_txt[config.language]}
                      </Text>
                    )}
                    {this.state.booking_arr.status == 2 && (
                      <Text
                        style={{
                          color: Colors.green,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.4) / 100,
                          textAlign: 'right',
                        }}>
                        {Lang_chg.completed_txt[config.language]}
                      </Text>
                    )}
                    {this.state.booking_arr.status == 3 && (
                      <Text
                        style={{
                          color: Colors.red,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.4) / 100,
                          textAlign: 'right',
                        }}>
                        {Lang_chg.cancel1_txt[config.language]}
                      </Text>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    width: (mobileW * 90) / 100,
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: (mobileW * 4) / 100,
                    borderBottomColor: Colors.bottom_border,
                    borderBottomWidth: (mobileW * 0.2) / 100,
                    paddingBottom: (mobileW * 1.5) / 100,
                  }}>
                  <View style={{width: '60%', justifyContent: 'flex-end'}}>
                    <Text
                      style={{
                        color: Colors.signup_placeholder_color,
                        fontFamily: Font.fontbold,
                        fontSize: (mobileW * 3.6) / 100,
                        textAlign: config.textRotate,
                      }}>
                      {Lang_chg.adress_txt[config.language]}
                    </Text>
                  </View>
                  <View style={{width: '40%', alignItems: 'flex-end'}}>
                    <Text
                      style={{
                        color: Colors.black_color,
                        fontFamily: Font.fontsemibold,
                        fontSize: (mobileW * 4) / 100,
                      }}>
                      {Lang_chg.home1_txt[config.language]}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        Linking.openURL(
                          'http://maps.google.com/maps?daddr=' +
                            this.state.booking_arr.lat +
                            ',' +
                            this.state.booking_arr.lon,
                        );
                      }}>
                      <Text
                        style={{
                          color: '#0075FF',
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 2.9) / 100,
                          textDecorationLine: 'underline',
                        }}>
                        {Lang_chg.navigatelocation_txt[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    width: (mobileW * 90) / 100,
                    alignSelf: 'center',
                    borderRadius: (mobileW * 1) / 100,
                    marginTop: (mobileW * 4) / 100,
                    elevation: 5,
                    backgroundColor: Colors.whiteColor,
                    shadowOffset: {width: 1, height: 1},
                    shadowColor: Colors.shadow_color,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}>
                  <View
                    style={{
                      width: '95%',
                      alignItems: 'center',
                      backgroundColor: Colors.appColor,
                      borderRadius: (mobileW * 1) / 100,
                      marginTop: (mobileW * 4) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: Font.fontsemibold,
                        fontSize: (mobileW * 3.5) / 100,
                        paddingVertical: (mobileW * 2.3) / 100,
                      }}>
                      {this.state.booking_arr.booking_date} ,{' '}
                      {this.state.booking_arr.booking_time[config.language]}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '94%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      paddingTop: (mobileW * 4.3) / 100,
                      alignItems: 'center',
                    }}>
                    <View style={{width: '50%', alignItems: 'flex-start'}}>
                      <Text
                        style={{
                          color: Colors.appColor,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: 'center',
                        }}>
                        {Lang_chg.cardetails_txt[config.language]}
                      </Text>
                    </View>
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          color: Colors.appColor,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: 'center',
                        }}>
                        {this.state.booking_arr.model_name[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: '92%',
                      paddingTop: (mobileW * 2.2) / 100,
                      flexDirection: 'row',
                      alignSelf: 'center',
                      borderBottomColor: Colors.bottom_border,
                      borderBottomWidth: 0.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      paddingBottom: (mobileW * 3.5) / 100,
                    }}>
                    <View
                      style={{
                        width: '25%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.appColor,
                        borderRadius: (mobileW * 1.5) / 100,
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          color: Colors.white_color,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.7) / 100,
                          marginTop: (mobileW * 2) / 100,
                        }}>
                        {this.state.booking_arr.vehicle_name[config.language]}
                      </Text>
                      <Image
                        source={{
                          uri:
                            config.img_url3 +
                            this.state.booking_arr.vehicle_image,
                        }}
                        style={{
                          height: (mobileW * 15) / 100,
                          width: (mobileW * 17) / 100,
                          marginBottom: (mobileW * 1) / 100,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: '33%',
                        alignItems: 'center',
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          paddingVertical: (mobileW * 0.9) / 100,
                          alignItems: 'center',
                        }}>
                        <Text style={styles.text_style}>
                          {Lang_chg.platenumber_txt[config.language]}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'center',
                          paddingVertical: (mobileW * 3.5) / 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.text_style1}>
                          {this.state.booking_arr.plate_number}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        borderRightWidth: (mobileW * 0.3) / 100,
                        borderRightColor: Colors.appColor,
                        height: (mobileW * 16) / 100,
                        marginTop: (mobileW * 4) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: '27%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      <View style={{paddingVertical: (mobileW * 2) / 100}}>
                        <Text style={styles.text_style}>
                          {Lang_chg.make_txt[config.language]}
                        </Text>
                      </View>
                      <View style={{}}>
                        <Image
                          source={{
                            uri:
                              config.img_url3 +
                              this.state.booking_arr.make_image,
                          }}
                          style={{
                            height: (mobileW * 9) / 100,
                            width: (mobileW * 12) / 100,
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        borderRightWidth: (mobileW * 0.3) / 100,
                        borderRightColor: Colors.appColor,
                        height: (mobileW * 16) / 100,
                        marginTop: (mobileW * 4) / 100,
                      }}
                    />
                    <View
                      style={{
                        width: '16%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      <View
                        style={{
                          paddingVertical: (mobileW * 1.5) / 100,
                          alignSelf: 'flex-end',
                        }}>
                        <Text style={styles.text_style}>
                          {Lang_chg.color1_txt[config.language]}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingVertical: (mobileW * 2.5) / 100,
                          alignSelf: 'center',
                          marginLeft: (mobileW * 6) / 100,
                        }}>
                        <View
                          style={{
                            backgroundColor: this.state.booking_arr.color_code,
                            borderRadius: (mobileW * 2) / 100,
                            height: (mobileW * 3.5) / 100,
                            width: (mobileW * 3.5) / 100,
                          }}
                        />
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: '93%',
                      flexDirection: 'row',
                      marginTop: (mobileW * 4) / 100,
                      alignSelf: 'center',
                    }}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.7) / 100,
                          color: Colors.appColor,
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.services[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: '93%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingVertical: (mobileW * 2) / 100,
                    }}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          color: Colors.black_color,
                          fontFamily: Font.fontregular,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: config.textRotate,
                        }}>
                        {this.state.booking_arr.service_name[config.language]}
                      </Text>
                    </View>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          color: Colors.black_color,
                          fontFamily: Font.fontbold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: 'right',
                        }}>
                        {this.state.booking_arr.service_price} EGP
                      </Text>
                    </View>
                  </View>
                  {this.state.booking_arr.extra_services != 'NA' && (
                    <View style={{width: (mobileW * 90) / 100}}>
                      <View
                        style={{
                          width: '93%',
                          flexDirection: 'row',
                          paddingVertical: (mobileW * 1) / 100,
                          alignSelf: 'center',
                        }}>
                        <View style={{width: '50%'}}>
                          <Text
                            style={{
                              fontFamily: Font.fontsemibold,
                              fontSize: (mobileW * 3.8) / 100,
                              color: Colors.appColor,
                              textAlign: config.textRotate,
                            }}>
                            {Lang_chg.extraservice_txt[config.language]}
                          </Text>
                        </View>
                      </View>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={this.state.booking_arr.extra_services}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{}}
                        renderItem={({index, item}) => {
                          return (
                            <View
                              style={{
                                width: '93%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                paddingVertical: (mobileW * 2) / 100,
                              }}>
                              <View style={{width: '60%'}}>
                                <Text
                                  style={{
                                    color: Colors.black_color,
                                    fontFamily: Font.fontregular,
                                    fontSize: (mobileW * 3.6) / 100,
                                    textAlign: config.textRotate,
                                  }}>
                                  {item.extra_service_name[config.language]}
                                </Text>
                              </View>
                              <View style={{width: '40%'}}>
                                <Text
                                  style={{
                                    color: Colors.black_color,
                                    fontFamily: Font.fontbold,
                                    fontSize: (mobileW * 3.6) / 100,
                                    textAlign: 'right',
                                  }}>
                                  {item.extra_service_price} EGP X{' '}
                                  {
                                    this.state.booking_arr
                                      .extra_services_quantity
                                  }
                                </Text>
                              </View>
                            </View>
                          );
                        }}
                      />
                    </View>
                  )}

                  <DashedLine
                    axis="horizontal"
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      paddingTop: (mobileW * 4) / 100,
                    }}
                    Length={7}
                    dashColor={'#DDDDDD'}
                    dashThickness={0.7}
                  />

                  <View
                    style={{
                      width: '93%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingTop: (mobileW * 3) / 100,
                    }}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          color: Colors.black_color,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.grand_txt[config.language]}
                      </Text>
                    </View>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          color: '#000',
                          fontFamily: Font.fontbold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: 'right',
                        }}>
                        {this.state.booking_arr.total_price} EGP
                      </Text>
                    </View>
                  </View>

                  <DashedLine
                    axis="horizontal"
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                      paddingTop: (mobileW * 3) / 100,
                    }}
                    Length={7}
                    dashColor={'#DDDDDD'}
                    dashThickness={0.7}
                  />

                  <View
                    style={{
                      width: '93%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingBottom: (mobileW * 3) / 100,
                      paddingTop: (mobileW * 4) / 100,
                    }}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          color: Colors.black_color,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.payment_txt1[config.language]}
                      </Text>
                    </View>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          color: Colors.appColor,
                          fontFamily: Font.fontbold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: 'right',
                        }}>
                        {this.state.booking_arr.payment_option[config.language]}
                      </Text>
                    </View>
                  </View>
                  <DashedLine
                    axis="horizontal"
                    style={{
                      width: '95%',
                      alignSelf: 'center',
                    }}
                    Length={7}
                    dashColor={'#DDDDDD'}
                    dashThickness={0.7}
                  />
                  <View
                    style={{
                      width: '93%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingBottom: (mobileW * 3) / 100,
                      paddingTop: (mobileW * 4) / 100,
                    }}>
                    <View style={{width: '100%'}}>
                      <Text
                        style={{
                          color: Colors.appColor,
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: config.textRotate,
                          marginBottom: 10,
                        }}>
                        {Lang_chg.notes[config.language]}
                      </Text>
                      <Text
                        style={{
                          color: Colors.black_color,
                          fontFamily: Font.fontmedium,
                          fontSize: (mobileW * 3.6) / 100,
                          textAlign: config.textRotate,
                        }}>
                        {(this.state.booking_arr?.note ?? '') === ''
                          ? Lang_chg.noNotes[config.language]
                          : this.state.booking_arr.note}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: (mobileW * 90) / 100,
                    alignSelf: 'center',
                    borderRadius: (mobileW * 1) / 100,
                    marginTop: (mobileW * 5) / 100,
                    elevation: 5,
                    backgroundColor: Colors.whiteColor,
                    shadowOffset: {width: 1, height: 1},
                    shadowColor: Colors.shadow_color,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    paddingBottom: (mobileW * 3.5) / 100,
                  }}>
                  <View
                    style={{
                      width: '93%',
                      flexDirection: 'row',
                      paddingVertical: (mobileW * 1) / 100,
                      alignSelf: 'center',
                      paddingTop: (mobileW * 4) / 100,
                    }}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{
                          fontFamily: Font.fontsemibold,
                          fontSize: (mobileW * 3.5) / 100,
                          color: Colors.appColor,
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.user_details_txt[config.language]}
                      </Text>
                    </View>
                  </View>
                  <View style={{width: '100%'}}>
                    <View
                      style={{
                        width: '93%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          width: '70%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          paddingVertical: (mobileW * 2) / 100,
                        }}>
                        <View style={{width: '30%', justifyContent: 'center'}}>
                          <Image
                            source={
                              this.state.booking_arr.user_image == 'NA'
                                ? localimag.placeholder_icon
                                : {
                                    uri:
                                      config.img_url3 +
                                      this.state.booking_arr.user_image,
                                  }
                            }
                            style={{
                              height: (mobileW * 14) / 100,
                              width: (mobileW * 14) / 100,
                              borderRadius: (mobileW * 7) / 100,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: '70%',
                            alignSelf: 'flex-start',
                            justifyContent: 'center',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.fontsemibold,
                              fontSize: (mobileW * 3.5) / 100,
                              textAlign: config.textRotate,
                            }}>
                            {this.state.booking_arr.user_name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3) / 100,
                              textAlign: config.textRotate,
                            }}>
                            +20 {this.state.booking_arr.user_phone_number}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 3) / 100,
                              textAlign: config.textRotate,
                            }}>
                            {this.state.booking_arr.user_email != 'NA' &&
                              this.state.booking_arr.user_email}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            `tel:+20${this.state.booking_arr.user_phone_number}`,
                          );
                        }}
                        activeOpacity={0.7}
                        style={{
                          width: '30%',
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Image
                          source={localimag.roundtele}
                          style={{
                            height: (mobileW * 8) / 100,
                            width: (mobileW * 8) / 100,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {this.state.status == 4 && (
                  <View
                    style={{
                      width: (mobileW * 89) / 100,
                      marginTop: (mobileW * 5) / 100,
                      alignSelf: 'center',
                    }}>
                    <View style={{width: '100%', justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontSize: (mobileW * 4) / 100,
                          fontFamily: Font.fontsemibold,
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.uploadphotosworking_txt[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.2) / 100,
                          fontFamily: Font.fontsemibold,
                          color: 'red',
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.maxuploadphotos_txt[config.language]}
                      </Text>
                    </View>
                    <View style={{}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: (mobileW * 2) / 100,
                          width: '100%',
                        }}>
                        <TouchableOpacity
                          style={{width: '25%'}}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 1});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image1 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image1}
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            paddingRight: (mobileW * 2) / 100,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 2});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image2 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image2}
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            paddingRight: (mobileW * 2) / 100,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 3});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image3 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image3}
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            paddingRight: (mobileW * 2) / 100,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 4});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image4 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image4}
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: (mobileW * 1.3) / 100,
                          width: '100%',
                        }}>
                        <TouchableOpacity
                          style={{width: '25%'}}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 5});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image5 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image5}
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            paddingRight: (mobileW * 2) / 100,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 6});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image6 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image6}
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            paddingRight: (mobileW * 2) / 100,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 7});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image7 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image7}
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: '25%',
                            paddingRight: (mobileW * 2) / 100,
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.setState({cameraModal: true, image_id: 8});
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 21) / 100,
                              width: (mobileW * 21) / 100,
                            }}
                            source={
                              this.state.image8 == 'NA'
                                ? localimag.placeholder_camera_icon
                                : {uri: this.state.image8}
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                {(this.state.status == 5 || this.state.status == 6) && (
                  <View
                    style={{
                      width: (mobileW * 89) / 100,
                      marginTop: (mobileW * 5) / 100,
                      alignSelf: 'center',
                    }}>
                    <View style={{width: '100%', justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontSize: (mobileW * 4) / 100,
                          fontFamily: Font.fontsemibold,
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.uploadphotosworking_txt[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.2) / 100,
                          fontFamily: Font.fontsemibold,
                          color: 'red',
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.maxuploadphotos_txt[config.language]}
                      </Text>
                    </View>
                    <View
                      style={{marginTop: (mobileW * 2) / 100, width: '100%'}}>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={this.state.booking_arr.booking_images}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{}}
                        numColumns={4}
                        renderItem={({index, item}) => {
                          return (
                            <TouchableOpacity
                              style={{width: '25%'}}
                              activeOpacity={0.7}
                              onPress={() => {
                                this.setState({
                                  fullImage: item.image,
                                  openImageModal: true,
                                });
                              }}>
                              <Image1
                                borderRadius={5}
                                indicator={ProgressBar.Circle}
                                indicatorProps={{
                                  size: 20,
                                  borderWidth: 0,
                                  color: 'rgba(150, 150, 150, 1)',
                                  unfilledColor: 'rgba(200, 200, 200, 0.2)',
                                }}
                                style={{
                                  height: (mobileW * 21) / 100,
                                  width: (mobileW * 21) / 100,
                                  borderRadius: (mobileW * 0.5) / 100,
                                }}
                                source={{uri: config.img_url3 + item.image}}
                              />
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  </View>
                )}
                {this.state.status != 6 && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: '#16BC3A',
                      paddingVertical: (mobileW * 1) / 100,
                      width: (mobileW * 80) / 100,
                      borderRadius: 25,
                      marginTop: (mobileH * 5) / 100,
                      alignSelf: 'center',
                      elevation: 2,
                      shadowOffset: {width: 0},
                      shadowColor: '#000',
                      shadowOpacity: 0.1,
                    }}
                    onPress={() => {
                      this.updateStatus();
                    }}>
                    <Text
                      style={{
                        color: Colors.whiteColor,
                        alignSelf: 'center',
                        fontSize: (mobileW * 4.5) / 100,
                        fontFamily: Font.fontmedium,
                        paddingVertical: (mobileW * 2) / 100,
                      }}>
                      {this.state.btnTxt}
                    </Text>
                  </TouchableOpacity>
                )}
                {this.state.status == 6 &&
                  this.state.booking_arr.rating_status == 1 && (
                    <View>
                      {/* ---------------------------User Reviews--------------------------- */}
                      <View
                        style={{
                          width: (mobileW * 89) / 100,
                          alignSelf: 'center',
                          elevation: 5,
                          backgroundColor: Colors.whiteColor,
                          shadowOffset: {width: 1, height: 1},
                          shadowColor: Colors.shadow_color,
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          paddingBottom: (mobileW * 3.5) / 100,
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.fontsemibold,
                            fontSize: (mobileW * 3.5) / 100,
                            color: Colors.appColor,
                            marginLeft: (mobileW * 4) / 100,
                            marginTop: (mobileW * 2) / 100,
                            textAlign: config.textRotate,
                          }}>
                          {Lang_chg.user_review[config.language]}
                        </Text>
                        {/* ---------------------------Image Name Date------------------------ */}
                        <View
                          style={{
                            width: '92%',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: (mobileW * 2) / 100,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: '68%',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={
                                this.state.booking_arr.user_image == 'NA'
                                  ? localimag.placeholder_icon
                                  : {
                                      uri:
                                        config.img_url3 +
                                        this.state.booking_arr.user_image,
                                    }
                              }
                              style={{
                                height: (mobileW * 7) / 100,
                                width: (mobileW * 7) / 100,
                                borderRadius: (mobileW * 3.5) / 100,
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: (mobileW * 3) / 100,
                                marginLeft: (mobileW * 2) / 100,
                              }}>
                              {this.state.booking_arr.user_name}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontFamily: Font.fontmedium,
                              fontSize: (mobileW * 2) / 100,
                            }}>
                            {this.state.booking_arr.user_rating.createtime}
                          </Text>
                        </View>
                        {/* ----------------------------Stars Rating----------------------------- */}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: (mobileW * 3) / 100,
                            marginTop: (mobileW * 2) / 100,
                          }}>
                          <StarRating
                            containerStyle={{
                              width: (mobileW * 25) / 100,
                              marginLeft: (mobileW * 1) / 100,
                            }}
                            fullStar={localimag.activeStar}
                            emptyStar={localimag.unactiveStar}
                            halfStarColor={'#FFC815'}
                            disabled={false}
                            maxStars={5}
                            starSize={mobileW * 0.038}
                            rating={this.state.booking_arr.user_rating.rating}
                          />
                          <Text
                            style={{
                              fontFamily: Font.fontsemibold,
                              fontSize: mobileW * 0.03,
                            }}>
                            {' '}
                            ({this.state.booking_arr.user_rating.rating})
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '92%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingVertical: (mobileW * 0.5) / 100,
                          }}>
                          <View
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              paddingVertical: (mobileW * 1) / 100,
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: (mobileW * 3) / 100,
                                width: '90%',
                                textAlign: config.textRotate,
                              }}>
                              {Lang_chg.arsalanQ1_sheikh[config.language]}
                            </Text>
                            {this.state.booking_arr.user_rating
                              .behavior_status == 1 ? (
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.appColor,
                                  textAlign: config.textRotate,
                                }}>
                                {Lang_chg.yes_txt[config.language]}
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.appColor,
                                  textAlign: config.textRotate,
                                }}>
                                {Lang_chg.no_txt[config.language]}
                              </Text>
                            )}
                          </View>

                          <View
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              paddingVertical: (mobileW * 1) / 100,
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: (mobileW * 3) / 100,
                                width: '90%',
                                textAlign: config.textRotate,
                              }}>
                              {Lang_chg.arsalanQ2_sheikh[config.language]}{' '}
                              {this.state.name}{' '}
                              {Lang_chg.arsalanQ2_2_sheikh[config.language]}
                            </Text>
                            {this.state.booking_arr.user_rating.work_status ==
                            1 ? (
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.appColor,
                                  textAlign: config.textRotate,
                                }}>
                                {Lang_chg.yes_txt[config.language]}
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.appColor,
                                  textAlign: config.textRotate,
                                }}>
                                {Lang_chg.no_txt[config.language]}
                              </Text>
                            )}
                          </View>

                          <View
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              paddingVertical: (mobileW * 1) / 100,
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.fontmedium,
                                fontSize: (mobileW * 3) / 100,
                                width: '90%',
                                textAlign: config.textRotate,
                              }}>
                              {Lang_chg.arsalanQ3_sheikh[config.language]}{' '}
                              {this.state.name}{' '}
                              {Lang_chg.arsalanQ3_2_sheikh[config.language]}
                            </Text>
                            {this.state.booking_arr.user_rating.nature_status ==
                            1 ? (
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.appColor,
                                  textAlign: config.textRotate,
                                }}>
                                {Lang_chg.yes_txt[config.language]}
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontFamily: Font.fontmedium,
                                  fontSize: (mobileW * 3) / 100,
                                  color: Colors.appColor,
                                  textAlign: config.textRotate,
                                }}>
                                {Lang_chg.no_txt[config.language]}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
              </ScrollView>
            )}
          </ImageBackground>
        </View>
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
  },
  text_style: {
    fontFamily: Font.fontsemibold,
    fontSize: (mobileW * 3.2) / 100,
    color: 'grey',
  },
  text_style1: {
    fontFamily: Font.fontsemibold,
    fontSize: (mobileW * 3.2) / 100,
    color: Colors.black_color,
  },
  text_style2: {
    fontFamily: Font.fontsemibold,
    fontSize: (mobileW * 3) / 100,
    paddingBottom: (mobileW * 2.5) / 100,
  },
  img_style: {
    width: '25%',
    justifyContent: 'center',
    marginTop: (mobileW * 1.2) / 100,
  },
  img_style1: {
    width: '24%',
    paddingVertical: (mobileW * 6) / 100,
    marginTop: (mobileW * 1.2) / 100,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    marginLeft: (mobileW * 1) / 100,
    justifyContent: 'center',
    borderRadius: (mobileW * 1) / 100,
  },
});
