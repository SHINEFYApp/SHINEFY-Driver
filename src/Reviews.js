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
import {Nodata_foundimage} from '../src/Provider/Nodata_foundimage';

export default class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      review_arr: 'NA',
      user_id: 'NA',
      name: '',
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
        this.setDriverReview();
      }, 500);
    });
    this.setDriverReview();
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

  setDriverReview = async () => {
    var user_arr = await localStorage.getItemObject('user_arr');
    let user_review = await localStorage.getItemObject('user_review_arr');
    let user_id = user_arr.user_id;
    this.setState({user_id: user_id, name: user_arr.name});
    var url = config.baseURL + 'get_driver_review/' + user_id;

    if (user_review == null) {
      apifuntion
        .getApi(url)
        .then(obj => {
          if (obj.success == 'true') {
            this.setState({review_arr: obj.review_arr});
            localStorage.setItemObject('user_review_arr', obj.review_arr);
          } else {
            msgProvider.alert(
              Lang_chg.information[config.language],
              obj.msg[config.language],
              false,
            );
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
      this.setState({review_arr: user_review});
      apifuntion
        .getApi(url, 1)
        .then(obj => {
          if (obj.success == 'true') {
            localStorage.setItemObject('user_review_arr', obj.review_arr);
          } else {
            msgProvider.alert(
              Lang_chg.information[config.language],
              obj.msg[config.language],
              false,
            );
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
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.flexStyle} />
        <StatusBar
          hidden={false}
          backgroundColor={Colors.themecolor1}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        {/* -----------------------------Header------------------------------------ */}
        <ImageBackground
          source={localimag.new_header}
          style={{width: (mobileW * 100) / 100, height: (mobileW * 20) / 100}}>
          <View
            style={{
              alignItems: 'center',
              width: (mobileW * 100) / 100,
              flexDirection: 'row',
              paddingVertical: (mobileW * 6) / 100,
            }}>
            <TouchableOpacity
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
                paddingLeft: (mobileW * 8) / 100,
              }}>
              <Text
                style={{
                  fontFamily: Font.fontsemibold,
                  fontSize: (mobileW * 5.5) / 100,
                  color: Colors.whiteColor,
                }}>
                {Lang_chg.reviews_txt[config.language]}
              </Text>
            </View>
          </View>
        </ImageBackground>
        {/* -----------------------------End Header------------------------------------ */}

        <KeyboardAwareScrollView>
          {this.state.review_arr == 'NA' ? (
            <Nodata_foundimage />
          ) : (
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: (mobileW * 10) / 100}}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.review_arr}
              renderItem={({index, item}) => {
                return (
                  <View>
                    {/* ---------------------------User Reviews--------------------------- */}
                    <View
                      style={{
                        width: (mobileW * 95) / 100,
                        alignSelf: 'center',
                        backgroundColor: Colors.whiteColor,
                        paddingVertical: (mobileW * 2.5) / 100,
                        borderBottomColor: '#DEDEDE',
                        borderBottomWidth: (mobileW * 0.2) / 100,
                      }}>
                      {/* ---------------------------Image Name Date------------------------ */}
                      <View
                        style={{
                          width: '93%',
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
                              item.user_image == 'NA'
                                ? localimag.placeholder_icon
                                : {uri: config.img_url3 + item.user_image}
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
                            {item.user_name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: Font.fontmedium,
                            fontSize: (mobileW * 2) / 100,
                          }}>
                          {item.createtime}
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
                          starSize={(mobileW * 3.8) / 100}
                          rating={item.rating}
                        />
                        <Text
                          style={{
                            fontFamily: Font.fontsemibold,
                            fontSize: mobileW * 0.03,
                          }}>
                          {' '}
                          ({item.rating})
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '95%',
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
                            {Lang_chg.arsalanQ1_sheikh[config.language]}{' '}
                          </Text>
                          {item.behavior_status == 1 ? (
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
                          {item.work_status == 1 ? (
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
                          {item.nature_status == 1 ? (
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
                );
              }}
            />
          )}
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
  clearAllTxt: {
    fontFamily: Font.fontbold,
    fontSize: mobileW * 0.038,
    color: Colors.whiteColor,
  },
  backSpace: {
    width: mobileW * 0.18,
  },
  clinicName: {
    fontSize: mobileW * 0.04,
    fontFamily: Font.fontregular,
  },
  clinicStatusTxt: {
    fontSize: mobileW * 0.03,
    fontFamily: Font.fontregular,
    width: (mobileW * 70) / 100,
  },
  clinicStatusTxt11: {
    fontSize: mobileW * 0.03,
    fontFamily: Font.fontsemibold,
    color: Colors.themecolor1,
    textDecorationLine: 'underline',
  },
  dateNtime: {
    fontSize: mobileW * 0.028,
    fontFamily: Font.fontregular,
  },
});
