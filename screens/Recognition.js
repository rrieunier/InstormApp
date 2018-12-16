import React, {Component} from 'react';
import {FlatList, View, Text, TouchableOpacity, Image, Dimensions, Platform, StyleSheet} from 'react-native';
import Icon from "../components/Icon";
import {Fonts} from "../src/utils/Fonts";

import Sound from "react-native-sound";

class Instrument extends Component {

    // I know it's ugly
    instrumentsImages = {
        guitare: require('../assets/images/guitare-lg.jpg'),
        saxophone: require('../assets/images/saxophone-lg.jpg'),
        violon: require('../assets/images/violon-lg.jpg'),
        piano: require('../assets/images/piano-lg.jpg'),
    };

    constructor(props) {
        super(props);
    }

    render() {
        const instrument = this.props.instrument;

        return (
            <View style={styles.instrument}>
                <View style={styles.instrumentTextContainer}>
                    <Text style={styles.instrumentText}>{instrument}</Text>
                    <View style={styles.instrumentTextLine}/>
                </View>
                <TouchableOpacity style={styles.instrument} onPress={this.props.onPress}>
                    <Image source={this.instrumentsImages[instrument]} style={styles.instrumentImage}
                           resizeMode="cover"/>
                    {this.props.playing &&
                    <View style={styles.pauseContainer}>
                        <Icon name="pause" size={75} color="white" style={styles.pauseBtn}/>
                    </View>}
                </TouchableOpacity>
            </View>
        );
    }
}

export default class Recognition extends Component {
    // Loading in advance to play sounds faster
    instrumentsPlays = {
        guitare: new Sound(require('../assets/audio/guitare.mp3'), (e) => console.log("Sounds loading error", e)),
        saxophone: new Sound(require('../assets/audio/saxophone.mp3'), (e) => console.log("Sounds loading error", e)),
        violon: new Sound(require('../assets/audio/violon.mp3'), (e) => console.log("Sounds loading error", e)),
        piano: new Sound(require('../assets/audio/piano.mp3'), (e) => console.log("Sounds loading error", e)),
    };

    constructor(props) {
        super(props);
        this.instruments = this.props.navigation.getParam('instruments', false);

        this.state = {
            instrumentPlaying: false,
            instrumentAudio: false,
        };
    }

    static navigationOptions = {
        title: 'Résultats',
        headerStyle: {
            backgroundColor: "#000",
        },
        headerTintColor: "#36A9E1",
        headerTitleStyle: {
            // fontWeight: 'bold',
        },
    };

    componentDidMount() {
    }

    onPressInstrument(instrument) {
        if (!this.state.instrumentPlaying) {
            this.setState({
                instrumentPlaying: instrument,
            });
            this.play = this.instrumentsPlays[instrument].play(() => this.setState({instrumentPlaying: false}));
        } else if (this.state.instrumentPlaying === instrument) {
            this.play.stop(() => console.log('successfully stopped playing'));
            this.setState({
                instrumentPlaying: false,
            });
        } else {
            this.play.stop(() => console.log('successfully stopped playing'));
            this.play = this.instrumentsPlays[instrument].play(() => this.setState({instrumentPlaying: false}));
            this.setState({
                instrumentPlaying: instrument,
            });
        }
    }

    render() {
        return (
            <FlatList style={styles.container} data={this.instruments} renderItem={({item}) => {
                return <Instrument instrument={item.instrument}
                                   playing={this.state.instrumentPlaying === item.instrument}
                                   onPress={() => this.onPressInstrument(item.instrument)}/>
            }} keyExtractor={(item, index) => item.id} extraData={this.state}/>
        );
    }
}

const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    h1: {
        fontSize: 48,
        color: "white",
        textAlign: "right",
        marginTop: 10,
        marginBottom: 20
    },
    instrument: {
        // flex: 1,
        height: 150,
        width: dimensions.width,
        position: "relative",
    },
    instrumentTextContainer: {
        position: "absolute",
        top: 0,
        left: 10,
        zIndex: 100,
    },
    instrumentText: {
        color: "white",
        fontFamily: Fonts.KaushanScript,
        fontSize: 42,
        shadowColor: "black",
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 100,
    },
    instrumentTextLine: {
        paddingBottom: 5,
        width: 30,
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    instrumentImage: {
        height: 150,
        width: dimensions.width,
    },
    pauseContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 101,
    },
    pauseBtn: {
        shadowColor: "black",
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 100,
        opacity: 0.9,
    },
});