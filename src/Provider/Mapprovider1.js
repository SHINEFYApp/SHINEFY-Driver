import React, {Component} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Colors,
  mediaprovider,
  config,
  localStorage,
  localimag,
  Currentltlg,
  Lang_chg,
  apifuntion,
  msgProvider,
  msgTitle,
  consolepro,
  validation,
  notification,
} from './utilslib/Utils';

import Geolocation from '@react-native-community/geolocation';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Slider from '@react-native-community/slider';
//import OneSignal from 'react-native-onesignal';
import {firebaseprovider} from './FirebaseProvider';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Mapprovider1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible1: false,
      latitude: config.latitude,
      longitude: config.longitude,
      latdelta: '0.0922',
      longdelta: '0.0421',
      isConnected: true,
      addressbar: false,
      addressbar2: false,
      addressselected: 'search',
      makermove: 0,
      username: '',
      address: '',
      radiusstart: 0,
      radiusend: 0,
      country_name: 'NA',
      latdelta: '0.0922',
      longdelta: '0.0421',
    };
    // OneSignal.init(config.onesignalappid, {
    //   kOSSettingsKeyAutoPrompt: true,
    // });
    this.getlatlong();
  }

  callLocation = async that => {
    this.setState({loading: true});
    localStorage.getItemObject('position').then(position => {
      if (position != null) {
        var pointcheck1 = 0;
        this.getalldata(position);
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
            pointcheck1 = 1;
          },
          error => {
            let position = {
              coords: {latitude: config.latitude, longitude: config.longitude},
            };

            this.getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000},
        );
        that.watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
          }
        });
      } else {
        var pointcheck = 0;
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);

            this.getalldata(position);
            pointcheck = 1;
          },
          error => {
            let position = {
              coords: {latitude: config.latitude, longitude: config.longitude},
            };

            this.getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000},
        );
        that.watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          if (pointcheck != 1) {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
          }
        });
      }
    });
  };
  getlatlong = async () => {
    let permission = await localStorage.getItemString('permission');
    if (permission != 'denied') {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        this.callLocation(that);
      } else {
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = {
                coords: {latitude: config.latitude, longitude: config.latitude},
              };
              localStorage.setItemString('permission', 'denied');
              that.getalldata(position);
            }
          } catch (err) {
            console.warn(err);
          }
        }
        requestLocationPermission();
      }
    } else {
      let position = {
        coords: {latitude: config.latitude, longitude: config.longitude},
      };
      this.getalldata(position);
    }
  };
  getalldata = position => {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    this.setState({latitude: latitude, longitude: longitude, loading: false});
    //  if(address_map!='NA')
    //  {
    //    this.setState({latitude:address_map.latitude,longitude:address_map.longitude})
    //  }
    //  else if(filter_address!='NA')
    //  {
    //    this.setState({latitude:filter_address.latitude,longitude:filter_address.longitude})
    //  }
    //  else{
    //       this.setState({latitude:latitude,longitude:longitude})
    //  }
    let event = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: this.state.latdelta,
      longitudeDelta: this.state.longdelta,
    };
    this.getadddressfromlatlong(event);
  };

  setMapRef = map => {
    this.map = map;
  };
  getCoordinates = region => {
    return {
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      latitudeDelta: parseFloat(this.state.latdelta),
      longitudeDelta: parseFloat(this.state.longdelta),
    };
  };

  getadddressfromlatlong = event => {
    // alert('hi')
    if (this.state.makermove != 0) {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          event.latitude +
          ',' +
          event.longitude +
          '&key=' +
          config.mapkey +
          '&language=' +
          config.maplanguage,
      )
        .then(response => response.json())
        .then(resp => {
          let responseJson = resp.results[0];
          let city = '';
          let administrative_area_level_1 = '';
          for (let i = 0; i < responseJson.address_components.length; i++) {
            if (responseJson.address_components[i].types[0] == 'locality') {
              city = responseJson.address_components[i].long_name;
              break;
            } else if (
              responseJson.address_components[i].types[0] ==
              'administrative_area_level_2'
            ) {
              city = responseJson.address_components[i].long_name;
            }
          }
          for (let j = 0; j < responseJson.address_components.length; j++) {
            if (
              responseJson.address_components[j].types[0] ==
              'administrative_area_level_1'
            ) {
              administrative_area_level_1 =
                responseJson.address_components[j].long_name;
            }
          }
          let details = responseJson;
          let address_index = details.address_components.length - 2;
          let country_name =
            details.address_components[address_index].long_name;
          let data2 = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: details.formatted_address,
            city: city,
            administrative_area_level_1: administrative_area_level_1,
          };
          this.GooglePlacesRef &&
            this.GooglePlacesRef.setAddressText(details.formatted_address);
          this.setState({
            latdelta: event.latitudeDelta,
            longdelta: event.longitudeDelta,
            latitude: event.latitude,
            longitude: event.longitude,
            addressselected: details.formatted_address,
            country_name: country_name,
          });
          //   return  this.props.locationget(data2);
        });
    } else {
      this.setState({makermove: 1});
    }
  };

  addLocation = async () => {
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    let location_radius = this.state.radiusend;
    let address = this.state.country_name;

    if (location_radius == 0) {
      msgProvider.toast(validation.emptyRadius[config.language], 'center');
      return false;
    }

    let userDetails = await localStorage.getItemObject('user_arr');
    let user_id = userDetails['user_id'];
    let url = config.baseURL + 'add_location.php';

    var data = new FormData();
    data.append('user_id', user_id);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    data.append('address', address);
    data.append('location_radius', location_radius);
    data.append('device_type', config.device_type);
    data.append('player_id', player_id_me1);

    this.setState({loading: true});
    apifuntion
      .postApi(url, data)
      .then(obj => {
        this.setState({loading: false});
        if (obj.success == 'true') {
          // alert("hiiii")
          if (obj.notification_arr != 'NA') {
            notification.notification_arr(obj.notification_arr);
          }
          let user_details = obj.user_details;
          localStorage.setItemObject('user_arr', user_details);

          firebaseprovider.firebaseUserCreate();
          firebaseprovider.getMyInboxAllData();

          this.props.navigation.navigate('Success');
        } else {
          if (obj.account_active_status == 0) {
            msgProvider.alert(
              msgTitle.information[config.language],
              obj.msg[config.language],
              false,
            );
            this.props.navigation.navigate('Login');
          } else {
            msgProvider.alert(
              msgTitle.information[config.language],
              obj.msg[config.language],
              false,
            );
          }
          return false;
        }
      })
      .catch(error => {
        this.setState({loading: false});
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            paddingTop: 10,
            backgroundColor: Colors.themecolor,
          }}>
          <TouchableOpacity
            style={{paddingVertical: 15, width: '20%', alignSelf: 'center'}}
            onPress={() => {
              this.props.navigation.navigate('Age');
            }}>
            <View style={{width: '100%', alignSelf: 'center'}}>
              <Image
                source={require('../icons/back_arrow.png')}
                style={{
                  alignSelf: 'center',
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={{paddingVertical: 15, width: '60%'}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 17,
                textAlign: 'center',
              }}>
              Location
            </Text>
          </View>
          <TouchableOpacity
            style={{paddingVertical: 15, width: '20%', alignSelf: 'center'}}
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <View style={{width: '100%', alignSelf: 'center'}}>
              <Text
                style={{
                  color: Colors.buttoncolor,
                  fontSize: 13,
                  textAlign: 'center',
                }}></Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.state.latitude != 'NA' && (
          <View style={{flex: 1}}>
            <MapView
              followsUserLocation={true}
              // onUserLocationChange={event =>this.getCoordinates(this)}

              style={{flex: 1}}
              region={this.getCoordinates(this)}
              //  region={this.getCoordinates(this)}
              zoomEnabled={true}
              provider={PROVIDER_GOOGLE}
              minZoomLevel={2}
              maxZoomLevel={20}
              rotateEnabled={true}
              pitchEnabled={true}
              showsUserLocation={false}
              userLocationPriority="high"
              moveOnMarkerPress={true}
              // showsMyLocationButton={true}
              showsScale={false} // also this is not working
              // showsCompass={false} // and this is not working
              showsPointsOfInterest={true} // this is not working either
              showsBuildings={true} // and finally, this isn't working either
              // onMapReady={this.onMapReady}
              // onRegionChangeComplete={(event)=>{this.getadddressfromlatlong(event)}}
              // draggable

              //  customMapStyle={mapStyle}
              ref={this.setMapRef}>
              <Marker.Animated
                coordinate={{
                  latitude: parseFloat(this.state.latitude),
                  longitude: parseFloat(this.state.longitude),
                  latitudeDelta: parseFloat(this.state.latdelta),
                  longitudeDelta: parseFloat(this.state.longdelta),
                }}
                isPreselected={true}
                onDragEnd={e => {}}
                draggable
                title={
                  this.state.username != null
                    ? this.state.username
                    : 'Guest user'
                }
                description={'Your are here location'}>
                <Image
                  source={localimag.maplocation}
                  style={{height: 30, width: 30, resizeMode: 'contain'}}
                />
              </Marker.Animated>
            </MapView>

            <View
              style={{
                marginTop: (windowHeight * 5) / 100,
                justifyContent: 'space-between',
                width: '90%',
                alignSelf: 'center',
                borderWidth: 3,
                borderColor: '#ea0a0a',
                paddingVertical: 30,
                position: 'absolute',
                bottom: 100,
                backgroundColor: 'white',
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.age, {left: 15}]}>Radius</Text>
                <Text style={[styles.age, {right: 25}]}>
                  {this.state.radiusstart} - {this.state.radiusend} Km
                </Text>
              </View>
              <Slider
                style={{width: '100%', top: 10}}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#ea0a0a"
                maximumTrackTintColor="#000000"
                thumbTintColor="red"
                value={this.state.radiusend}
                onValueChange={txt => {
                  this.setState({radiusend: parseInt(txt)});
                }}
              />
            </View>

            <View style={{position: 'absolute', width: '100%', bottom: 5}}>
              <TouchableOpacity
                onPress={() => {
                  this.addLocation();
                }}
                style={styles.number}>
                <View
                  style={{
                    width: '10%',
                    alignSelf: 'center',
                    paddingHorizontal: 20,
                  }}></View>
                <View style={{width: '80%', alignSelf: 'center'}}>
                  <Text style={styles.text2}>Continue</Text>
                </View>
                <View style={{width: '10%', alignSelf: 'center'}}>
                  <Image
                    style={styles.img2}
                    source={require('../icons/arrow.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{position: 'absolute', width: '100%'}}>
              <View style={{flex: 1}}>
                <GooglePlacesAutocomplete
                  placeholder="Search location"
                  minLength={1} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed={this.state.addressbar2} // true/false/undefined
                  fetchDetails={true}
                  ref={instance => {
                    this.GooglePlacesRef = instance;
                  }}
                  renderDescription={row => row.description} // custom description render
                  onPress={(data, details = null) => {
                    let city = 'unknown';
                    for (
                      let i = 0;
                      i < details.address_components.length;
                      i++
                    ) {
                      if (
                        details.address_components[i].types[0] == 'locality'
                      ) {
                        city = details.address_components[i].long_name;
                      }
                    }
                    let data2 = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      address: details.formatted_address,
                      city: city,
                    };
                    ageaddress = data2;
                    this.setState({
                      addressbar: true,
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      addressselected: '',
                    });
                    //   return  this.props.locationget(data2);
                  }}
                  // getDefaultValue={() => {
                  //   return  selleraddress!='NA'?selleraddress.address:'' // text input default value
                  // }}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: config.mapkey,
                    language: config.maplanguage, // language of the results
                    //  types: '(cities)',  default: 'geocode'
                  }}
                  styles={{
                    textInputContainer: {
                      backgroundColor: 'white',
                      marginTop: 10,
                      //  borderWidth:1,

                      // boderColor:'gray',
                      alignSelf: 'center',
                      height: 42,
                      alignItems: 'flex-end',
                      borderRadius: 0,
                      width: '100%',
                    },
                    textInput: {
                      marginLeft: 7,
                      marginRight: 10,
                      textAlign: 'left',
                      height: 37,
                      borderRadius: 10,
                      // backgroundColor:'white',
                      fontFamily: 'Montserrat-Regular',
                      color: '#5d5d5d',
                      fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                    description: {
                      fontFamily: 'Montserrat-Regular',
                    },
                    container: {
                      borderRadius: 10,
                    },
                    poweredContainer: {
                      backgroundColor: Colors.themecolor,
                      borderRadius: 25,
                      color: '#FFFFFF',
                    },
                    listView: {
                      backgroundColor: '#FFFFFF',
                      marginTop: 30,
                      borderWidth: 1,
                      boderColor: 'black',
                    },
                  }}
                  currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                  currentLocationLabel="Current location"
                  nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  GoogleReverseGeocodingQuery={
                    {
                      // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }
                  }
                  GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'food',
                  }}
                  filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                    'postal_code',
                    'sublocality',
                    'country',
                  ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                  //   predefinedPlaces={[homePlace, workPlace]}
                  debounce={100}
                  // renderRightButton={()  => (<TouchableOpacity style={{alignSelf:'center',paddingRight:10}} onPress={()=>{this.GooglePlacesRef.setAddressText("");this.setState({addressselected:'search'})}}>
                  //     {this.state.addressselected != 'search' &&
                  //      <Icon2 name='circle-with-cross' size={25} color='#c2cfc4' style={{alignSelf:'center'}} />
                  //   }
                  //   {this.state.addressselected == 'search' &&
                  //      <Icon name='search' size={25} color='#c2cfc4' style={{alignSelf:'center'}} />
                  //   }
                  // </TouchableOpacity>) }
                  //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
                />
              </View>
            </View>
          </View>
        )}
        {/* <View style={{ position: 'absolute', bottom: 15, width:mobileW, paddingHorizontal: 30 }}>
                <View style={{borderRadius: 10,height: 50,marginBottom:10,backgroundColor:Colors.themecolor}} >
                   <TouchableOpacity onPress={()=>{this.props.canclemap();}} style={{justifyContent:'center',alignItems: 'center', borderRadius: 10, height: 50, }}>
                   <Text style={{ color:'black', fontSize: 18,fontFamily:'Montserrat-SemiBold' }}>Continue</Text>
                   </TouchableOpacity>
                   </View>

                </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#00a1e4',
    width: 180,
    borderRadius: 45,
    paddingVertical: 10,
  },
  searchbutton: {
    backgroundColor: '#00a1e4',

    borderRadius: 45,
    paddingVertical: 11,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  searchbar: {
    flexDirection: 'row',
    width: '80%',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginRight: 10,
    elevation: 10,
    borderRadius: 15,
    alignSelf: 'center',
    shadowOffset: {
      height: 7,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.49,
    shadowRadius: 5,
  },
  text2: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    alignSelf: 'center',
  },
  img2: {
    width: 15,
    height: 15,
  },
  number: {
    width: (windowWidth * 85) / 100,
    backgroundColor: '#ea0a0a',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 20,
  },
  age: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
});
