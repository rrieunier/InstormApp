/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    MaskedViewIOS,
    Platform,
    View
} from 'react-native';
import AnalyzeButton from "../components/AnalyzeButton";
import LinearGradient from 'react-native-linear-gradient';

import {Fonts} from "../src/utils/Fonts";

export default class Home extends Component {

    render() {

        return (
            <View style={[this.props.style, {alignContent: "flex-start"}]}>
                {Platform.OS === 'ios'
                    ? <MaskedViewIOS
                        style={{flex: 1, flexDirection: 'row', height: '100%'}}
                        maskElement={
                            <View style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={styles.h1}>
                                    Instorm
                                </Text>
                            </View>
                        }
                    >
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.gradient}
                                        colors={["#36A9E1", '#35398E', '#951B81']}/>
                    </MaskedViewIOS>
                    : <Text style={styles.h1}>Instorm</Text>
                }
                <View style={styles.controls}>
                    <AnalyzeButton/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    h1: {
        fontSize: 72,
        fontWeight: "200",
        color: "#fff",
        textAlign: "center",
        fontFamily: Fonts.KaushanScript
    },
    progressText: {
        paddingTop: 20,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    },
    gradient: {
        flex: 1,
        height: '100%'
    }
});