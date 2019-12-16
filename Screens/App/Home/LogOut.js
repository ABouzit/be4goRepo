import React, { Component, Fragment } from 'react';
import {View, Text, AsyncStorage, StyleSheet, TextInput, Alert, TouchableOpacity, FlatList} from 'react-native';
import deviceStorage from '../services/deviceStorage';
import Config from "../services/config";
import axios from "axios";
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';



export default class LogOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenUser: ''
        }

           this.getToken();

            //this.deleteJWT = deviceStorage.deleteJWT.bind(this);


    }
    getToken = async () => {
        const userToken = await AsyncStorage.getItem('id_token');
        var to = userToken;
        console.log("tooooooooooooooo" + to);
        this.deleteTokenDevice(to);
        this.deleteTokenUser(to);
        AsyncStorage.clear();
        await LoginManager.logOut();
        this.props.navigation.navigate('SignIn');


    }

    deleteTokenUser(to){
        const headers = {
            'Authorization': 'Bearer ' + to
        };
        console.log("tooooooken********delete*******user   " + to)
        axios.put(Config.SERVER_URL+'/api/deleteToken',null,{
            headers:headers,
        } ).then(res =>{
            console.log(res);
        })
    }
    deleteTokenDevice(to){

        const headers = {
            'Authorization': 'Bearer ' + to
        };
        console.log("tooooooken********delete*******device   " + to)
        axios.delete(Config.SERVER_URL+'/api/deleteTokenDevice',{
            headers:headers,
        }).then(res =>{
            console.log(res);
        })
    }



render() {
    return null ;

    }
}

