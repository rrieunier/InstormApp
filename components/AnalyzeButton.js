import React, {Component} from 'react';
import {
    Animated,
    Alert,
    Easing,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import {AudioRecorder, AudioUtils} from "react-native-audio";
import Sound from "react-native-sound";
import RNFetchBlob from "rn-fetch-blob";

import Recognition from "../screens/Recognition";
import {withNavigation} from 'react-navigation';

class AnalyzeButton extends Component {

    constructor(props) {
        super(props);
        this._number = 0;
        this._spin = new Animated.Value(0);
        this._pulse = new Animated.Value(0);
        this._recordingDelay = 0;
        this._predictUrl = "192.168.1.25";

        this.state = {
            currentTime: 0.0,
            recording: false,
            paused: false,
            stoppedRecording: false,
            finished: false,
            number: 0,
            audioPath: AudioUtils.DocumentDirectoryPath + `/test${++this._number}.aac`,
            hasPermission: undefined,
        };
    }

    componentDidMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({hasPermission: isAuthorised});

            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                this.setState({sound: data});
                this._uploadRecording(data.base64);
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    // this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });

        this.rotateButton();
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 44100,
            Channels: 1,
            AudioQuality: "High",
            AudioEncoding: "aac",
            IncludeBase64: true
        });
    }

    _renderButton(title, onPress, active) {
        let style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    _renderPauseButton(onPress, active) {
        let style = (active) ? styles.activeButtonText : styles.buttonText;
        let title = this.state.paused ? "RESUME" : "PAUSE";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    async _pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({paused: true});
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({paused: false});
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            let sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    async _record() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _uploadRecording(base64) {
        RNFetchBlob.fetch('POST', `http://${this._predictUrl}:5005/predict`, {
            'Content-Type': 'multipart/form-data',
        }, [
            {
                name: 'audio',
                filename: 'test.aac',
                data: base64
            },
        ])
        // .uploadProgress((written, total) => {
        //     this.setState({uploadProgress: Math.floor(written) * 10 / Math.floor(total) * 10});
        // })
            .then(response => response.json())
            .then(responseJson => responseJson.prediction.map((value, index) => {
                return {id: index, instrument: value};
            }))
            .then(prediction => {
                // console.warn(prediction);
                if (prediction.length > 0) {
                    this.props.navigation.navigate('Recognition', {
                        instruments: prediction
                    });
                } else {
                    Alert.alert("Échec de la reconnaissance", "Aucun instrument n'a été reconnu. Vous pouvez réessayer en vous rapprochant de la source sonore ou en augmentant le volume de la musique.");
                }
            })
            .catch((error) => {
                Alert.alert("Échec de la reconnaissance", "Aucun instrument n'a été reconnu. Vous pouvez réessayer en vous rapprochant de la source sonore ou en augmentant le volume de la musique.");
                console.warn(error);
            });
    }

    rotateButton = () => {
        console.log(this._spin);
        this._spin.setValue(0);
        Animated.loop(Animated.timing(this._spin, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: true,
                easing: Easing.linear
            }
        )).start();
        console.log(this._spin);
    };

    pulseButton = () => {
        this._pulse.setValue(0);
        Animated.timing(this._pulse, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
                easing: Easing.elastic(0)
            }
        ).start(() => {
            if (this.state.recording === true)
                this.pulseButton();
        });
    };

    onPress = () => {
        if (!this.state.recording) {
            this.pulseButton();
            this._record();
            this._recordingDelay = setTimeout(() => this._stop(), 20000);
        } else {
            this._stop();
            clearTimeout(this._recordingDelay);
            // this._play();
        }
    };

    render() {

        const spin = this._spin.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '180deg', '360deg']
        });

        const pulse = this._pulse.interpolate({
            inputRange: [0, 0.25, 0.45, 0.5, 0.55, 0.75, 1],
            outputRange: [1, 1.5, 0.9, 1, 0.9, 1.5, 1]
        });

        return (
            <View style={{justifyContent: "center"}}>
                <TouchableOpacity style={{...this.props.style, width: 256, height: 256}} onPress={this.onPress}>
                    <Text style={{color: "#fff", fontSize: 16, textAlign: "center"}}>
                        Touchez pour démarrer l'analyse
                    </Text>
                    <Animated.Image source={require('../assets/images/instorm-circle.png')}
                                    style={{width: 256, height: 256, transform: [{rotate: spin}, {scale: pulse}]}}/>
                </TouchableOpacity>

                {/*{this._renderButton("RECORD", () => {*/}
                {/*this._record()*/}
                {/*}, this.state.recording)}*/}
                {/*{this._renderButton("PLAY", () => {*/}
                {/*this._play()*/}
                {/*})}*/}
                {/*{this._renderButton("STOP", () => {*/}
                {/*this._stop()*/}
                {/*})}*/}
                {/*{this._renderPauseButton(() => {*/}
                {/*this.state.paused ? this._resume() : this._pause()*/}
                {/*})}*/}
                {/*<Text style={styles.progressText}>{this.state.currentTime}s</Text>*/}
                {/*{this._renderButton("UPLOAD", () => {*/}
                {/*this._uploadRecording()*/}
                {/*})}*/}
            </View>
        );
    }
}

export default withNavigation(AnalyzeButton);

const styles = StyleSheet.create({
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    h1: {
        fontSize: 48,
        color: "white",
        textAlign: "center"
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
    }

});