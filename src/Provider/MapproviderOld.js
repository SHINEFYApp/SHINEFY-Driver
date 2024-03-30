import React, {Component} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
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
} from './utilslib/Utils';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Slider from '@react-native-community/slider';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
global.current_user_latlong = 'NA';
export default class Mapprovider extends Component {
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
      addressselected: 'Search',
      makermove: 0,
      username: '',
      address: '',
      radiusstart: 0,
      radiusend: 0,
      country_name: 'NA',
    };
    if (this.props.identify == 'age') {
      this.getcurrentlatlogn();
    } else {
      this.getData();
    }
  }

  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      if (this.props.identify == 'age') {
        this.getcurrentlatlogn();
      } else {
        this.getData();
      }
    });
  };

  getData = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id'];
    let user_lat = user_details['latitude'];
    let user_long = user_details['longitude'];
    let location_radius = user_details['location_radius'];
    this.setState({
      latitude: user_lat,
      longitude: user_long,
      radiusend: location_radius,
    });
    let event = {
      latitude: user_lat,
      longitude: user_long,
      latitudeDelta: this.state.latdelta,
      longitudeDelta: this.state.longdelta,
    };
    this.getadddressfromlatlong(event);
  };

  getcurrentlatlogn = async () => {
    let data = await Currentltlg.requestLocation();
    let latitude = data.coords.latitude;
    let longitude = data.coords.longitude;
    current_user_latlong = data;
    if (this.props.address_arr != 'NA') {
      this.setState({latitude: latitude, longitude: longitude});
    } else {
      this.setState({latitude: latitude, longitude: longitude});
    }
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
          //for only country name
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
          return this.props.locationget(data2);
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
          let user_details = obj.user_details;
          localStorage.setItemObject('user_arr', user_details);
          this.props.canclemap();
          if (this.props.identify == 'age') {
            this.props.navigation.navigate('Success');
          }
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.mapmodal}
        onRequestClose={() => {
          this.setState({makermove: 0});
          this.props.canclemap();
        }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                paddingTop: 10,
              }}>
              <TouchableOpacity
                style={{paddingVertical: 15, width: '20%', alignSelf: 'center'}}
                onPress={this.props.canclemap}>
                <View style={{width: '100%', alignSelf: 'center'}}>
                  <Image
                    source={require('../icons/back_arrow.png')}
                    style={{
                      alignSelf: 'center',
                      width: 25,
                      height: 25,
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
              {/* <TouchableOpacity style={{paddingVertical:15,width:'20%',alignSelf:'center'}}  onPress={()=>{this.state.profile=='location'?this.locationupdatebtn():this.props.navigation.goBack()}}> 
            <View style={{width:'100%',alignSelf:'center'}} >
              <Text style={{color:Colors.buttoncolor,fontFamily:'Montserrat-Light',fontSize:13,textAlign:'center'}}></Text>
             </View>
          </TouchableOpacity> */}
            </View>
            <View style={{flex: 1}}>
              <MapView
                followsUserLocation={true}
                style={{flex: 1}}
                region={this.getCoordinates(this)}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                minZoomLevel={2}
                maxZoomLevel={20}
                rotateEnabled={true}
                pitchEnabled={true}
                showsUserLocation={true}
                userLocationPriority="high"
                moveOnMarkerPress={true}
                showsMyLocationButton={true}
                showsScale={true} // also this is not working
                showsCompass={true} // and this is not working
                showsPointsOfInterest={true} // this is not working either
                showsBuildings={true} // and finally, this isn't working either
                onMapReady={this.onMapReady}
                onRegionChangeComplete={event => {
                  this.getadddressfromlatlong(event);
                }}
                draggable
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
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
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

              <View style={{position: 'absolute', width: '100%', top: 5}}>
                <View style={{flex: 1, paddingHorizontal: 0}}>
                  <GooglePlacesAutocomplete
                    placeholder="Search Location"
                    minLength={1} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed="auto" // true/false/undefined
                    fetchDetails={true}
                    ref={instance => {
                      this.GooglePlacesRef = instance;
                    }}
                    // ref={(instance) => { }}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => {
                      let responseJson = details;
                      let city = '';
                      let administrative_area_level_1 = '';
                      for (
                        let i = 0;
                        i < responseJson.address_components.length;
                        i++
                      ) {
                        if (
                          responseJson.address_components[i].types[0] ==
                          'locality'
                        ) {
                          city = responseJson.address_components[i].long_name;
                          break;
                        } else if (
                          responseJson.address_components[i].types[0] ==
                          'administrative_area_level_2'
                        ) {
                          city = responseJson.address_components[i].long_name;
                        }
                      }
                      for (
                        let j = 0;
                        j < responseJson.address_components.length;
                        j++
                      ) {
                        if (
                          responseJson.address_components[j].types[0] ==
                          'administrative_area_level_1'
                        ) {
                          administrative_area_level_1 =
                            responseJson.address_components[j].long_name;
                        }
                      }
                      this.setState({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: details.formatted_address,
                      });

                      let data2 = {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: details.formatted_address,
                        city: city,
                        administrative_area_level_1:
                          administrative_area_level_1,
                      };

                      return this.props.locationget(data2);
                    }}
                    // getDefaultValue={() => {
                    //   return  mapaddress!='NA'?mapaddress.address:'' // text input default value
                    // }}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: 'AIzaSyA8piMVBD4O7W4z-eo4M046_20rk6iXdDg',
                      language: 'en', // language of the results
                      //   types: '(cities)',  default: 'geocode'
                    }}
                    styles={{
                      textInputContainer: {
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        height: 44,
                        alignItems: 'flex-end',
                        borderRadius: 0,
                        width: '100%',
                        // borderTopColor:'gray',
                        // borderTopWidth:2
                      },
                      textInput: {
                        marginLeft: 7,
                        marginRight: 10,
                        textAlign: 'left',
                        fontFamily: 'Montserrat-Bold',
                        height: 37,
                        borderRadius: 10,
                        color: '#5d5d5d',
                        fontSize: 16,
                      },
                      predefinedPlacesDescription: {
                        color: Colors.statusbarcolor,
                      },
                      description: {
                        fontFamily: 'Montserrat-Bold',
                      },
                      container: {
                        borderRadius: 10,
                      },
                      poweredContainer: {
                        backgroundColor: Colors.statusbarcolor,
                        borderRadius: 15,
                        color: '#FFFFFF',
                      },
                      listView: {
                        backgroundColor: '#FFFFFF',
                        marginTop: 30,
                        borderRadius: 15,
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
                    renderRightButton={() => (
                      <TouchableOpacity
                        style={{alignSelf: 'center', paddingRight: 10}}
                        onPress={() => {
                          this.GooglePlacesRef.setAddressText('');
                          this.setState({addressselected: 'Search'});
                        }}>
                        {this.state.addressselected != 'Search' && (
                          <Icon2
                            name="circle-with-cross"
                            size={25}
                            color="#c2cfc4"
                            style={{alignSelf: 'center'}}
                          />
                        )}
                        {this.state.addressselected == 'Search' && (
                          <Icon
                            name="search"
                            size={25}
                            color="#c2cfc4"
                            style={{alignSelf: 'center'}}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                    //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
                  />
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
