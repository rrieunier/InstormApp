import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from "../components/Icon";

class Instrument extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <TouchableOpacity style={styles.instrument}>
                <Image source={require('../assets/images/violon.jpg')} style={styles.instrument}/>
            </TouchableOpacity>
        );
    }
}

class Recording extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.recording}>
                <TouchableOpacity>
                    <Icon name="play" color="#3b9bbb" size={45}/>
                </TouchableOpacity>
                <View style={styles.instruments}>
                    <Instrument/>
                    <Instrument/>
                    <Instrument/>
                </View>
            </View>
        );
    }
}

class Recordings extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.recordings}>
                <Text style={styles.date}>Mardi 28 novembre</Text>
                <Recording/>
                <Recording/>
                <Recording/>
            </View>
        );
    }
}

export default class History extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <ScrollView style={this.props.style}>
                <Text style={styles.h1}>Historique</Text>
                <Recordings/>
                <Recordings/>
                <Recordings style={{marginBottom: 100}}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    h1: {
        fontSize: 48,
        color: "white",
        textAlign: "right",
        marginBottom: 20
    },
    date: {
        fontSize: 20,
        marginBottom: 5,
        textAlign: "center",
        color: "white"
    },
    recordings: {
        paddingBottom: 10,
        borderBottomColor: "white",
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    recording: {
        margin: 5,
        height: 50,
        borderRadius: 5,
        backgroundColor: "white",
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    instruments: {
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    instrument: {
        width: 44,
        height: 44,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 22
    }
});