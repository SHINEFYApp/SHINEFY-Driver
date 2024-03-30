import React, {Component} from 'react';

// import {Languageprovider}  from './Provider/localStorageProvider';

import Colors from '../Color';
// import {
//   BallIndicator,
//   BarIndicator,
//   DotIndicator,
//   MaterialIndicator,
//   PacmanIndicator,
//   PulseIndicator,
//   SkypeIndicator,
//   UIActivityIndicator,
//   WaveIndicator,
// } from 'react-native-indicators';
import {StyleSheet, View, Modal, ActivityIndicator, Text} from 'react-native';

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
    };
  }
  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.state.status ? this.props.loading : this.state.status}
        onRequestClose={() => {
          this.setState({status: false});
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {/* <PacmanIndicator size={100} color={Colors.theme_color}  hidesWhenStopped={this.state.loading} animating={this.props.loading}/> */}

            <ActivityIndicator
              size="large"
              color="#black"
              animating={this.props.loading}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

// const {
//   loading,
//   ...attributes
// } = props;
//   const Loader = props => {
//   return (

//     <Modal
//       transparent={true}
//       animationType={'none'}
//       visible={props.loading}
//       onRequestClose={() => {}}>
//       <View style={styles.modalBackground}>
//         <View style={styles.activityIndicatorWrapper}>
//           <Text style={{color:'black',fontFamily:'bold',fontSize:14}}>Loding..</Text>
//           <ActivityIndicator size="large"  color='black'
//             animating={props.loading} />

//         </View>
//       </View>
//     </Modal>
//   )
// }

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    // backgroundColor: '#00000040'
    backgroundColor: '#00000010',
  },
  activityIndicatorWrapper: {
    height: 150,
    width: 150,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    // flexDirection:'row',
    justifyContent: 'space-around',
    // backgroundColor:'white'
  },
});
