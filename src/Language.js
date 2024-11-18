import React, {Component} from 'react';
import {
  View,
  Alert,
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

export default class Language extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      lang_arr: [
        {status: true, language: ['English', 'إنجليزي']},
        {status: false, language: ['Arabic', 'عربي']},
      ],
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.checkLanguage();
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

  checkLanguage = () => {
    let data = this.state.lang_arr;
    if (config.language == 1) {
      for (let i = 0; i < data.length; i++) {
        data[0].status = false;
        data[1].status = true;
      }
      this.setState({lang_arr: data});
    } else {
      for (let i = 0; i < data.length; i++) {
        data[0].status = true;
        data[1].status = false;
      }
      this.setState({lang_arr: data});
    }
  };
  languageCheck = index => {
    let data = this.state.lang_arr;
    for (let i = 0; i < data.length; i++) {
      data[i].status = false;
    }
    data[index].status = true;
    this.setState({lang_arr: data});
    this.language_change(index);
  };
  language_change = value => {
    Alert.alert(
      Lang_chg.language_change[config.language],
      Lang_chg.Lang_change_msg[config.language],
      [
        {
          text: Lang_chg.no_txt[config.language],
          onPress: () => {},
          tyle: 'Yes',
        },
        {
          text: Lang_chg.yes_txt[config.language],
          onPress: () => {
            this.launguage_setbtn(value);
          },
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  launguage_setbtn = language => {
    Lang_chg.language_set(language);
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
            backgroundColor={Colors.statusbar_color}
            hidden={false}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />

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
                  source={localimag.goback}></Image>
              </TouchableOpacity>
              <View
                style={{
                  width: '72%',
                  alignItems: 'center',
                  paddingLeft: (mobileW * 5) / 100,
                }}>
                <Text
                  style={{
                    fontFamily: Font.fontsemibold,
                    fontSize: (mobileW * 5.5) / 100,
                    color: Colors.whiteColor,
                  }}>
                  {Lang_chg.language_txt[config.language]}
                </Text>
              </View>
            </View>
          </ImageBackground>
          {/* -----------------------------End Header------------------------------------ */}

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{marginTop: (mobileW * 3) / 100}}
            data={this.state.lang_arr}
            renderItem={({index, item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.languageCheck(index);
                  }}
                  style={{
                    width: (mobileW * 88) / 100,
                    marginTop: (mobileW * 10) / 100,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderBottomColor: Colors.bottom_border,
                    borderBottomWidth: (mobileW * 0.2) / 100,
                    flexDirection: 'row',
                    paddingBottom: (mobileW * 1.8) / 100,
                  }}>
                  <View style={{width: '90%', justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4.1) / 100,
                        fontFamily: Font.fontmedium,
                        textAlign: config.textRotate,
                        color : Colors.textColors 
                      }}>
                      {item.language[config.language]}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '10%',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    {item.status == true && (
                      <Image
                        source={localimag.language_selctor}
                        style={{
                          height: (mobileW * 4) / 100,
                          width: (mobileW * 4) / 100,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
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
