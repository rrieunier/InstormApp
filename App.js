import React, {Component} from "react";
import {View, TouchableOpacity, StatusBar, StyleSheet} from "react-native";
import {createStackNavigator, createAppContainer} from "react-navigation";
import History from "./screens/History";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Recognition from "./screens/Recognition";

import Swiper from 'react-native-swiper';
import KeepAwake from 'react-native-keep-awake';
import Icon from './components/Icon';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 1,
        };

        KeepAwake.activate();
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
    }

    static navigationOptions = {
        headerStyle: {
            height: 0,
            backgroundColor: "#000",
            borderBottomColor: "#000"
        },
        headerTintColor: "#36A9E1",
        headerTitleStyle: {
        }
    };

    swipe(dest) {
        let to = dest - this.state.index;
        if (to !== 0)
            this.swiper.scrollBy(to, true);
    }

    render() {
        return (
            <View style={styles.container}>
                <Swiper index={this.state.index} loop={false} loadMinimal={false} showsPagination={false} bounces={true}
                        ref={(swiper) => {
                            this.swiper = swiper
                        }} onIndexChanged={(index) => {
                    this.setState({index: index});
                }}>
                    <History style={styles.subcontainer}/>
                    <Home style={styles.subcontainer}/>
                    <Settings style={styles.subcontainer}/>
                </Swiper>
                <View style={styles.bottomBar}>
                    <View style={[styles.bottomBarBtn, this.state.index === 0 && styles.historyBtnActive]}>
                        <TouchableOpacity onPress={() => this.swipe(0)}>
                            <Icon name="pulse" color={"#fff"} size={50}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.bottomBarBtn, this.state.index === 2 && styles.settingsBtnActive]}>
                        <TouchableOpacity onPress={() => this.swipe(2)}>
                            <Icon name="settings" color={"#fff"} size={50}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const AppNavigator = createStackNavigator({
        App: App,
        Recognition: Recognition
    },
    {
        initialRouteName: "App",
        // headerMode: "none"
    }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#36A9E1",
    },
    subcontainer: {
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
        paddingTop: 32,
        paddingBottom: 60
    },
    bottomBar: {
        width: "100%",
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomBarBtn: {
        margin: 10,
        width: 55,
        height: 55,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    historyBtnActive: {
        backgroundColor: '#35398E',
    },
    settingsBtnActive: {
        backgroundColor: '#951B81',
    }
});