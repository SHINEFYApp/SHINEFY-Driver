import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'

import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Contentpage extends Component {

    constructor(props) {

        super(props)

        this.state = {
            mobile: '',
            btn: true,
            securetext: true,
            remember_me: false,
            pagename: this.props.route.params.pagename,
        }


    }

    componentDidMount() {


    }
    componentWillUnmount() {

    }



    render() {


        return (
            <View style={{flex:1}} >
                 
              <ImageBackground style={{ width: mobileW * 100 / 100, height: mobileH * 100 / 100, }} source={localimag.bacKground1} >
              <SafeAreaView style={styles.flexStyle} />
                      <StatusBar
                          hidden={false}
                          translucent={false}
                          networkActivityIndicatorVisible={true}
                          backgroundColor={Colors.themecolor}
                          barStyle={'light-content'}
                      />
               <View style={{ alignItems: 'center', width: mobileW * 100 / 100, flexDirection: 'row', backgroundColor: '#D9862A', height: mobileW * 18 / 100 }}>
                  <TouchableOpacity style={{}} onPress={() => this.props.navigation.goBack()} >
      
      <Image resizeMode='contain' style={{ width: mobileW * 5.6 / 100, height: mobileW * 5.6 / 100,marginLeft:mobileW*5/100 }}
        source={localimag.goback1}></Image></TouchableOpacity>
      <Text style={{ color:Colors.whiteColor, fontSize:mobileW*5/100,fontFamily:Font.fontbold,marginLeft:mobileW*20/100}}>{this.state.pagename}</Text>
      
      </View>
      
    
     <ScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100, width: mobileW * 88 / 100, alignSelf: 'center' }}>
                        <Text style={{ fontSize: mobileW * 4.4 / 100, fontFamily: Font.fontmedium, color: Colors.black_color, textAlign: 'justify' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                            Why do we use it?
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

                            
                        </Text>

                    </View>
                </ScrollView>
      
                  </ImageBackground>
            </View>
          )
    }
} export default Contentpage

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor


    },
    view1:
    {
        backgroundColor: Colors.back_color,
        height: mobileH * 8 / 100,

        flexDirection: 'row',
        width: windowWidth * 88 / 100,
        alignSelf: 'center',
        alignItems: 'center',

    },



})

