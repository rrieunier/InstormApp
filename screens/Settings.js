import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Picker,
    PickerIOS,
    ScrollView,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Platform
} from 'react-native';
import Icon from '../components/Icon';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            language: 'fr'
        }
    }

    componentDidMount() {
    }

    render() {
        const contactActions = [
            {key: 'FAQ'},
            {key: 'Signaler un problème'},
            {key: 'Suggérer une fonctionnalité'},
            {key: 'Nous noter'}
        ];

        return (
            <ScrollView style={this.props.style}>
                <Text style={styles.h1}>Réglages</Text>
                <View style={styles.socials}>
                    <TouchableOpacity style={{...styles.socialButton, ...styles.fbButton}}>
                        <Text style={styles.socialButtonTxt}>Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...styles.socialButton, ...styles.ttButton}}>
                        <Text style={styles.socialButtonTxt}>Twitter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...styles.socialButton, ...styles.gpButton}} text="">
                        <Text style={styles.socialButtonTxt}>Google+</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {Platform.OS === 'ios' ?
                        <PickerIOS
                            selectedValue={this.state.language} style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
                            <Picker.Item label="Français" value="fr"/>
                            <Picker.Item label="Anglais" value="en"/>
                            <Picker.Item label="Arabe" value="ar"/>
                            <Picker.Item label="Espagnol" value="es"/>
                            <Picker.Item label="Russe" value="ru"/>
                        </PickerIOS>
                        : <Picker
                            selectedValue={this.state.language} style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
                            <Picker.Item label="Français" value="fr"/>
                            <Picker.Item label="Anglais" value="en"/>
                            <Picker.Item label="Arabe" value="ar"/>
                            <Picker.Item label="Espagnol" value="es"/>
                            <Picker.Item label="Russe" value="ru"/>
                        </Picker>
                    }
                </View>

                <FlatList
                    data={contactActions} renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
                />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    h1: {
        fontSize: 48,
        color: "white",
        marginBottom: 20
    },
    socials: {
        height: 60,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "space-between"
    },
    socialButton: {
        // flex: 1,
        margin: 5,
        padding: 12,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    socialButtonTxt: {
        color: "white",
        fontSize: 20
    },
    fbButton: {
        backgroundColor: "#3b5998"
    },
    ttButton: {
        backgroundColor: "#1da1f2"
    },
    gpButton: {
        backgroundColor: "#dd4b39"
    },
    picker: {
        backgroundColor: '#fff',
        flex: 1,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});