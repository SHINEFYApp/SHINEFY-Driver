import {
  Text,
  View,
  Image,
  BackHandler,
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
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
import {TouchableOpacity} from 'react-native-gesture-handler';
import Footer from './Provider/Footer';
import StarRating from 'react-native-star-rating';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      name: '',
      phone_number: '',
      image: '',
      email: 'NA',
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
      }, 500);
    });

    setTimeout(() => {
      this.setProfile();
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

  setProfile = async () => {
    let user_arr = await localStorage.getItemObject('user_arr');
    let avg_rating = await localStorage.getItemObject('driver_avg_rating');
    this.setState({
      image: user_arr.image,
      name: user_arr.name,
      phone_number: user_arr.phone_number,
      email: user_arr.email,
      rating: avg_rating,
    });
  };
  // ============================hansdle back press--------------------
  handleBackPress = () => {
    this.props.navigation.navigate('Home');
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
          <ImageBackground
            source={localimag.bacKground1}
            resizeMode="stretch"
            style={{
              width: (mobileW * 100) / 100,
              height: (mobileH * 89) / 100,
            }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <ImageBackground
                style={{
                  width: (mobileW * 100) / 100,
                  height: (mobileW * 60) / 100,
                  alignItems: 'center',
                }}
                source={localimag.profile1}>
                <View
                  style={{
                    width: (mobileW * 100) / 100,
                    height: (mobileW * 60) / 100,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: (mobileW * 60) / 100,
                      alignSelf: 'flex-end',
                      marginTop: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 5.3) / 100,
                        fontFamily: Font.fontsemibold,
                        color: Colors.whiteColor,
                        textAlign: 'center',
                      }}>
                      {Lang_chg.profile_txt[config.language]}
                    </Text>

                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Setting')}>
                      <Image
                        style={{
                          width: (mobileW * 7.5) / 100,
                          height: (mobileW * 7.5) / 100,
                          alignSelf: 'center',
                          borderRadius: (mobileW * 21) / 100,
                          backgroundColor: Colors.whiteColor,
                          marginRight: (mobileW * 4) / 100,
                        }}
                        source={localimag.setting_bg}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>

              <View
                style={{
                  marginTop: (mobileW * -25) / 100,
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: (mobileW * 39) / 100,
                    height: (mobileW * 39) / 100,
                    alignSelf: 'center',
                    borderRadius: (mobileW * 21) / 100,
                  }}
                  source={
                    this.state.image == 'NA'
                      ? localimag.man4
                      : {uri: config.img_url3 + this.state.image}
                  }></Image>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: (mobileW * 3) / 100,
                }}>
                <Text
                  style={{
                    color: Colors.appColor,
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 4.3) / 100,
                  }}>
                  {this.state.name}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <StarRating
                    containerStyle={{
                      width: (mobileW * 18) / 100,
                      marginLeft: (mobileW * 1) / 100,
                    }}
                    fullStar={localimag.activeStar}
                    emptyStar={localimag.unactiveStar}
                    halfStarColor={'#FFC815'}
                    disabled={false}
                    maxStars={5}
                    starSize={mobileW * 0.03}
                    rating={this.state.rating}
                  />
                  <Text
                    style={{
                      fontFamily: Font.fontsemibold,
                      fontSize: mobileW * 0.03,
                    }}>
                    {' '}
                    ({this.state.rating})
                  </Text>
                </View>
                <Text
                  style={{
                    color: Colors.gray_color,
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 4.1) / 100,
                  }}>
                  +20 {this.state.phone_number}
                </Text>
                {this.state.email != 'NA' && (
                  <Text
                    style={{
                      color: Colors.gray_color,
                      fontFamily: Font.fontsemibold,
                      fontSize: (mobileW * 4.1) / 100,
                    }}>
                    {this.state.email}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={{
                  width: (mobileW * 85) / 100,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  marginTop: (mobileW * 10) / 100,
                  elevation: 2,
                  borderRadius: (mobileW * 1) / 100,
                  flexDirection: 'row',
                  elevation: 3,
                  shadowOffset: {width: 0},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                }}
                onPress={() => this.props.navigation.navigate('Edit_Profile')}>
                <View
                  style={{
                    width: '16%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                    source={localimag.edit1}></Image>
                </View>
                <View
                  style={{
                    borderRightColor: Colors.bottom_border,
                    borderRightWidth: (mobileW * 0.2) / 100,
                    height: (mobileW * 6) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}></View>
                <View
                  style={{
                    width: '80%',
                    paddingLeft: (mobileW * 3) / 100,
                    paddingVertical: (mobileW * 4) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.edit_profile_txt_color,
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.editprofile_txt[config.language]}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: (mobileW * 85) / 100,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  elevation: 3,
                  shadowOffset: {width: 0},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  marginTop: (mobileW * 5) / 100,
                  elevation: 2,
                  borderRadius: (mobileW * 1) / 100,
                  flexDirection: 'row',
                }}
                onPress={() => this.props.navigation.navigate('Language')}>
                <View
                  style={{
                    width: '16%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                    source={localimag.lang1}></Image>
                </View>
                <View
                  style={{
                    borderRightColor: Colors.bottom_border,
                    borderRightWidth: (mobileW * 0.2) / 100,
                    height: (mobileW * 6) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}></View>
                <View
                  style={{
                    width: '80%',
                    paddingLeft: (mobileW * 3) / 100,
                    paddingVertical: (mobileW * 4) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.edit_profile_txt_color,
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.language_txt[config.language]}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: (mobileW * 85) / 100,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  marginTop: (mobileW * 5) / 100,
                  elevation: 2,
                  borderRadius: (mobileW * 1) / 100,
                  flexDirection: 'row',
                  elevation: 3,
                  shadowOffset: {width: 0},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                }}
                onPress={() => this.props.navigation.navigate('Reviews')}>
                <View
                  style={{
                    width: '16%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}
                    source={localimag.rating2}></Image>
                </View>
                <View
                  style={{
                    borderRightColor: Colors.bottom_border,
                    borderRightWidth: (mobileW * 0.2) / 100,
                    height: (mobileW * 6) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}></View>
                <View
                  style={{
                    width: '80%',
                    paddingLeft: (mobileW * 3) / 100,
                    paddingVertical: (mobileW * 4) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.edit_profile_txt_color,
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.reviews_txt[config.language]}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: (mobileW * 85) / 100,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  marginTop: (mobileW * 5) / 100,
                  elevation: 2,
                  borderRadius: (mobileW * 1) / 100,
                  flexDirection: 'row',
                  elevation: 3,
                  shadowOffset: {width: 0},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  marginBottom: (mobileW * 15) / 100,
                }}
                onPress={() => this.props.navigation.navigate('Document')}>
                <View
                  style={{
                    width: '16%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                      tintColor: Colors.appColor,
                    }}
                    source={localimag.term1}></Image>
                </View>
                <View
                  style={{
                    borderRightColor: Colors.bottom_border,
                    borderRightWidth: (mobileW * 0.2) / 100,
                    height: (mobileW * 6) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}></View>
                <View
                  style={{
                    width: '80%',
                    paddingLeft: (mobileW * 3) / 100,
                    paddingVertical: (mobileW * 4) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.edit_profile_txt_color,
                      fontFamily: Font.fontmedium,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: config.textRotate,
                    }}>
                    {Lang_chg.documents_txt[config.language]}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </ImageBackground>
          <Footer
            activepage="Profile"
            usertype={1}
            footerpage={[
              {
                name: 'Home',
                pagename: Lang_chg.home_txt[config.language],
                countshow: false,
                image: localimag.homeinactive1,
                activeimage: localimag.homeactive2,
              },
              {
                name: 'Booking',
                pagename: Lang_chg.bookings[config.language],
                countshow: false,
                image: localimag.service6,
                activeimage: localimag.service4,
              },
              {
                name: 'My_Earning',
                pagename: Lang_chg.myearnimg_txt[config.language],
                countshow: false,
                image: localimag.service5,
                activeimage: localimag.service2,
              },
              {
                name: 'Profile',
                pagename: Lang_chg.Profile_txt[config.language],
                countshow: false,
                image: localimag.profile3,
                activeimage: localimag.profile_active,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width: (mobileW * 6.5) / 100,
              height: (mobileW * 6) / 100,
              backgroundColor: Colors.theme_color,
              countcolor: 'black',
              countbackground: 'black',
            }}
            user_id={this.state.user_id}
          />
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
  ratingTxt: {
    fontFamily: Font.FontSemiBold,
    fontSize: mobileW * 0.03,
  },
});
