import React, { Component } from "react"
import {
    View, Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Text,
} from "react-native"
import { Colors, Font, config, Lang_chg } from '../utilslib/Utils';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);


export default class Cameragallery extends Component {
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.mediamodal}
                onRequestClose={() => {
                    this.setState({ modalVisible: false })
                }}>


                <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>

                    <View style={{ borderRadius: 20, width: "100%", position: 'absolute', bottom: 10, }}>

                        <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 15 }}>
                            <TouchableOpacity
                            >
                                <Text style={{ color: 'black', fontSize: 15, alignSelf: 'center', fontFamily: Font.fontregular, }}>Select Option</Text>
                            </TouchableOpacity>
                            <View style={{ borderBottomColor: '#D0D7DE', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10 }}></View>
                            <TouchableOpacity
                                //   onPress={()=>{this.props.Camerapopen()}}>
                                onPress={() => { this.props.Canclemedia() }}>
                                <Text style={{ color: 'black', fontSize: 18, fontFamily: Font.fontregular, alignSelf: 'center', marginTop: 10, letterSpacing: 0.5 }}>Camera</Text>
                            </TouchableOpacity>

                            <View style={{ borderBottomColor: '#D0D7DE', borderBottomWidth: StyleSheet.hairlineWidth, marginTop: 10 }}></View>

                            <TouchableOpacity
                                //  onPress={() => {this.props.Galleryopen()}
                                onPress={() => { this.props.Canclemedia() }}>

                                <Text style={{ color: 'black', fontSize: 18, fontFamily: Font.fontregular, alignSelf: 'center', marginTop: 10, letterSpacing: 0.5 }}>Gallery</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 10, marginVertical: 15 }}>
                            <TouchableOpacity
                                onPress={() => { this.props.Canclemedia() }}
                            >
                                <Text style={{ color: 'red', fontSize: 18, fontFamily: Font.fontbold, alignSelf: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: "center",
        backgroundColor: '#00000040',
        top: 0, left: 0, bottom: 0, right: 0
    },

    activityIndicatorWrapper: {
        height: 80,
        width: 80,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 6,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
    }
})
