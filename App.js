/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import RNFetchBlob from 'rn-fetch-blob'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
} from 'react-native';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

export default class App extends Component {

    state = {
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
        hasPermission: undefined,
        uploadProgress: 0
    };

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 44100,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            IncludeBase64: true
        });
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
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
    }

    _renderButton(title, onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

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

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({finished: didSucceed});
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    _uploadRecording() {

        RNFetchBlob.fetch('POST', 'http://192.168.1.22:8090/predict', {
            'Content-Type': 'multipart/form-data',
            // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
            // Or simply wrap the file path with RNFetchBlob.wrap().
        }, [
            {name: 'test-aac', filename: 'test.aac', data: this.state.sound.base64},
        ])
            .uploadProgress((written, total) => {
                this.setState({uploadProgress: written / total});
            })
            .then((res) => {
                console.log(res.text())
            })
            .catch((err) => {
                // console.warn(this.state.sound);
                console.warn(err);
            });
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.controls}>
                    {this._renderButton("RECORD", () => {
                        this._record()
                    }, this.state.recording)}
                    {this._renderButton("PLAY", () => {
                        this._play()
                    })}
                    {this._renderButton("STOP", () => {
                        this._stop()
                    })}
                    {this._renderPauseButton(() => {
                        this.state.paused ? this._resume() : this._pause()
                    })}
                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                    {this._renderButton("UPLOAD", () => {
                        this._uploadRecording()
                    })}
                    <Text style={styles.progressText}>{this.state.uploadProgress}%</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b608a",
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 50,
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