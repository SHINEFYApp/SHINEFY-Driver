import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  BackHandler,
  SafeAreaView,
} from 'react-native';

import {
  config,
  msgProvider,
  localStorage,
  apifuntion,
  msgText,
  msgTitle,
  Colors,
  mobileH,
  Font,
  mobileW,
} from './utilslib/Utils';
import Icon1 from 'react-native-vector-icons/Entypo';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
let user_id = 0;
export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      modalVisible1: false,
      loading: false,
      isConnected: true,
    };
    BackHandler.removeEventListener('hardwareBackPress', () => {
      return true;
    });
  }
  componentDidMount() {
    // firebaseprovider.messagecountforfooter()
  }
  messagecountforfooter = async () => {
    userdata = await localStorage.getItemObject('user_arr');
    //------------------------------ firbase code get user inbox ---------------
    if (userdata != null) {
      // alert("himanshu");
      var id = 'u_' + userdata.user_id;
      if (inboxoffcheck > 0) {
        var queryOffinbox = firebase
          .database()
          .ref('users/' + id + '/myInbox/')
          .child(userChatIdGlobal);
        //queryOff.off('child_added');
        queryOffinbox.off('child_changed');
      }

      var queryUpdatemyinbox = firebase
        .database()
        .ref('users/' + id + '/myInbox/');
      queryUpdatemyinbox.on('child_changed', data => {
        //  this.showUserInbox()
        firebaseprovider.firebaseUserGetInboxCount();
      });
    }
  };
  usercheckbtn = async page => {
    this.props.functionremove;
    const navigation = this.props.navigation;
    let userdata = await localStorage.getItemObject('user_arr');
    if (userdata != null) {
      if (this.props.usertype == 1) {
        navigation.navigate(page);
      } else {
        if (userdata.profile_complete == 0 && userdata.otp_verify == 1) {
          for (let i = 0; i < this.props.footerpage.length; i++) {
            if (page == this.props.footerpage[i].name) {
              navigation.navigate(page);
            }
          }
        } else {
          this.setState({modalVisible1: true});
        }
      }
    } else {
      if (this.props.usertype == 1) {
        navigation.navigate(page);
      } else {
        this.setState({modalVisible1: true});
      }
    }
  };
  Checkuser = async page => {
    if (this.props.user_id == 0) {
      Alert.alert(
        'Confirm',
        'Please Login first',
        [
          {
            text: msgTitle.cancel[0],
          },
          {
            text: msgTitle.ok[0],
            onPress: () => {
              this.props.navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      this.usercheckbtn(page);
    }
  };

  //  checklimitpost=async()=>{
  //     let userdata=await localStorage.getItemObject('user_arr')
  //     let user_id=0
  //     selleraddress1='NA'
  //     if(userdata!=null)
  //       {
  //         user_id=userdata.user_id
  //       }
  //  if(this.state.isConnected===true)
  //     {
  //         this.setState({loading:true})
  //      var url = config.baseURL+'post_limit.php?user_id='+user_id+'&action=today_post'

  //      fetch(url,{
  //         method: 'Get',
  //         headers: new Headers(config.headersapi),

  //         }).then((obj)=>{ this.setState({loading:false,refresh:false});    return  obj.json();}).then((obj)=>{
  //
  //          if(obj.success == 'true'){
  //          if(obj.today_limit!="no")
  //          {
  //             this.props.navigation.navigate('AddPost')
  //          }
  //          else{
  //              msgProvider.toast(Languageprovider.Your_limit_for_adding_posts[language_key],"center")
  //          }

  //           }

  //           else{
  //             msgProvider.alert(msgTitle.error[config.language], obj.msg[config.language], false);
  //             if(obj.active_status=="deactivate")
  //             {
  //              this.props.navigation.navigate('Logout')
  //             }

  //             return false;
  //        }
  //      }).catch((error)=> {
  //
  //        msgProvider.alert(msgTitle.server[config.language],msgText.servermessage[config.language], false);
  //          this.setState({loading: false,refresh:false});
  //    });
  //   }
  //   else{
  //      msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
  //    }
  //     }
  render() {
    const navigation = this.props.navigation;
    user_id = this.props.user_id;
    let footerwidth = parseInt(100 / this.props.footerpage.length);
    return (
      <SafeAreaView
        style={[
          style1.footercontainer,
          {backgroundColor: this.props.imagestyle1.backgroundColor},
        ]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible1}
          onRequestClose={() => {
            this.setState({modalVisible1: false});
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#00000040',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.setState({modalVisible1: false});
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: (screenWidth * 100) / 100,
                alignContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 20,
                  paddingTop: 15,
                  alignContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  borderRadius: 5,
                  width: (screenWidth * 80) / 100,
                }}>
                <View style={{position: 'absolute', left: -13, top: -13}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 30,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.setState({modalVisible1: false});
                    }}>
                    <Icon1
                      name="circle-with-cross"
                      size={25}
                      color={Colors.buttoncolor}
                      style={{
                        alignSelf: 'center',
                        padding: 1.5,
                        paddingBottom: 0,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: 'black',
                    alignSelf: 'flex-start',
                  }}>
                  information
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Light',
                    color: 'gray',
                    fontSize: 15,
                    paddingTop: 13,
                    lineHeight: 22,
                    alignSelf: 'center',
                  }}>
                  Please login first
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.buttoncolor,
                    marginVertical: 20,
                    width: '95%',
                    borderRadius: 40,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.setState({modalVisible1: false});
                      this.props.navigation.navigate('Userlogin');
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        paddingVertical: 13,
                        color: '#FFFFFF',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 13.5,
                        letterSpacing: 1,
                      }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <FlatList
          data={this.props.footerpage}
          //horizontal={false}
          scrollEnabled={false}
          numColumns={this.props.footerpage.length}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: (screenWidth * footerwidth) / 100,
                  alignSelf: 'center',
                  alignItems: 'center',
                  height: (mobileH * 8) / 100,
                  justifyContent: 'center',
                }}>
                {item.name == this.props.activepage ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={style1.footericon}
                    onPress={() => {
                      this.Checkuser(item.name);
                    }}>
                    <View style={[style1.footericonview, {width: 70}]}>
                      <Image
                        source={item.activeimage}
                        resizeMethod="resize"
                        style={[
                          style1.footerimage,
                          {
                            width: this.props.imagestyle1.width,
                            height: this.props.imagestyle1.height,
                          },
                        ]}
                      />
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontFamily: Font.FontRegular,
                          fontSize: (mobileW * 3) / 100,
                          marginTop: (mobileH * 0.5) / 100,
                        }}>
                        {item.pagename}
                      </Text>
                      {item.countshow != true && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -5,
                            left: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {item.countshow > 0 && (
                            <View
                              style={{
                                alignSelf: 'center',
                                width: 23,
                                height: 18,
                                borderRadius: 5,
                                backgroundColor:
                                  this.props.imagestyle1.countbackground,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: this.props.imagestyle1.countcolor,
                                  textAlign: 'center',
                                  textAlignVertical: 'center',
                                  fontFamily: Font.FontRegular,
                                  fontSize: 15,
                                }}>
                                {item.countshow > 9 ? '+9' : item.countshow}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[style1.footericon]}
                    onPress={() => {
                      this.Checkuser(item.name);
                    }}>
                    <View style={style1.footericonview}>
                      <Image
                        source={item.image}
                        resizeMethod="resize"
                        style={[
                          style1.footerimage,
                          {
                            width: this.props.imagestyle1.width,
                            height: this.props.imagestyle1.height,
                          },
                        ]}
                      />
                      <Text
                        style={{
                          color: Colors.whiteColor,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontFamily: Font.FontRegular,
                          fontSize: (mobileW * 3) / 100,
                          marginTop: (mobileH * 0.5) / 100,
                        }}>
                        {item.pagename}
                      </Text>
                      {item.countshow != true && (
                        <View
                          style={{
                            position: 'absolute',
                            top: -5,
                            left: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {item.countshow > 0 && (
                            <View
                              style={{
                                alignSelf: 'center',
                                width: 23,
                                height: 18,
                                borderRadius: 5,
                                backgroundColor:
                                  this.props.imagestyle1.countbackground,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  color: this.props.imagestyle1.countcolor,
                                  textAlign: 'center',
                                  textAlignVertical: 'center',
                                  fontFamily: Font.FontRegular,
                                  fontSize: 15,
                                }}>
                                {item.countshow > 9 ? '+9' : item.countshow}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />

        {/* {this.props.color=='home'? <TouchableOpacity activeOpacity={0.8} style={style1.footericon} onPress={()=>{navigation.navigate('Homepage')}}>
                   <View style={style1.footericonview}>
                      <Image source={require('./icons/home.png')}  resizeMethod='resize' style={style1.footerimage}/>
                   </View>
               </TouchableOpacity>:
               <TouchableOpacity activeOpacity={0.8} style={[style1.footericon]} onPress={()=>{navigation.navigate('Homepage')}}>
              <View style={style1.footericonview}>
                  <Image source={require('./icons/home_active.png')}  resizeMethod='resize' style={style1.footerimage}/>
              </View>
            </TouchableOpacity>
               }
              
              
                 {this.props.color=='like'? <TouchableOpacity activeOpacity={0.8} style={style1.footericon} onPress={()=>{navigation.navigate('Like')}}>
                   <View style={style1.footericonview}>
                   <Image source={require('./icons/likes_active.png')}  resizeMethod='resize' style={style1.footerimage}/>

                   </View>
               </TouchableOpacity>:
               <TouchableOpacity activeOpacity={0.8} style={[style1.footericon]} onPress={()=>{navigation.navigate('Like')}}>
              <View style={style1.footericonview}>
              <Image source={require('./icons/like.png')}  resizeMethod='resize' style={style1.footerimage}/>
                 
              </View>
            </TouchableOpacity>
               }
            
              {this.props.color=='inbox'? <TouchableOpacity activeOpacity={0.8} style={style1.footericon} onPress={()=>{navigation.navigate('Inbox')}}>
                   
                   <View style={style1.footericonview}>
                   <View>
                   <Image source={require('./icons/chat_active.png')}  resizeMethod='resize' style={style1.footerimage}/>
                   {count_inbox>0 && <View style={{position:'absolute',top:-10,left:20,alignItems:'center',justifyContent:'center'}}>
                       <View style={{alignSelf:'center',width:23,height:18,borderRadius:5,backgroundColor:Colorss.theme1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#FFFFFF',textAlign:'center',textAlignVertical:'center',fontFamily:Font.FontRegular,fontSize:15,}}>{count_inbox>9?'+9':count_inbox}</Text>
                      </View>
                    </View>}
                    </View>
                      
                      
                   </View>
               </TouchableOpacity>:
               <TouchableOpacity activeOpacity={0.8} style={[style1.footericon]} onPress={()=>{navigation.navigate('Inbox')}}>
             
              <View style={style1.footericonview}>
                <View>
              <Image source={require('./icons/inboxme.png')}  resizeMethod='resize' style={style1.footerimage}/>
              {count_inbox>0 && <View style={{position:'absolute',top:-10,left:20,alignItems:'center',justifyContent:'center'}}>
                       <View style={{alignSelf:'center',width:23,height:18,borderRadius:5,backgroundColor:Colorss.theme1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#FFFFFF',textAlign:'center',textAlignVertical:'center',fontFamily:Font.FontRegular,fontSize:15,}}>{count_inbox>9?'+9':count_inbox}</Text>
                      </View>
                    </View>}
              </View>
                 
                
              </View>
            </TouchableOpacity>
               }
               
             
               
               {this.props.color=='profile'? <TouchableOpacity activeOpacity={0.8} style={style1.footericon} onPress={()=>{navigation.navigate('Profile')}}>
                   <View style={style1.footericonview}>
                       <View>
                        <Image source={require('./icons/people.png')}  resizeMethod='resize' style={style1.footerimage}/>
                      </View>
                </View>
               </TouchableOpacity>:
               <TouchableOpacity activeOpacity={0.8} style={[style1.footericon]} onPress={()=>{navigation.navigate('Profile')}}>
               <View style={style1.footericonview}>
                     <View>
                         <Image source={require('./icons/user.png')}  resizeMethod='resize' style={style1.footerimage}/>
                     </View>  
                </View>
            </TouchableOpacity>
               } */}
      </SafeAreaView>
    );
  }
}
const style1 = StyleSheet.create({
  footercontainer: {
    flexDirection: 'row',
    width: screenWidth,
    // backgroundColor:'#e6e6e6',
    position: 'absolute',
    elevation: 20,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    // borderTopWidth:1,
    //borderTopColor:'#f7f7f7',
    shadowColor: 'black',
    bottom: 0,
  },
  footericon: {
    width: (screenWidth * 25) / 100,
    paddingTop: 8,
    paddingBottom: 6,
  },
  footericonview: {
    alignSelf: 'center',
    paddingVertical: 7,
  },
  footertext: {
    color: 'gray',
    fontSize: 13,
    fontFamily: Font.FontRegular,
  },
  footerimage: {
    alignSelf: 'center',

    resizeMode: 'contain',
  },
});
