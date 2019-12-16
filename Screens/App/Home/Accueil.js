import React, { Component,  } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, AsyncStorage} from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import {Image} from "react-native-elements";

import Icon from 'react-native-vector-icons/FontAwesome';

export default class Accueil extends Component {

    constructor(props){
        super(props);
        this.state = {

            error: '',
            loading: false,
            token:null

        };
        
       this.getToken();

    }

    
    
    getToken = async () => {
        const userToken = await AsyncStorage.getItem('id_token');
        const token = userToken;
        this.state.token=token;
        return Promise.resolve(token);
    }

    render() {
        const { error, loading } = this.state;
        const { form, section, errorTextStyle } = styles;

        return (
            <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../img/Acceuil.jpg')}>
            <View style={styles.cantainer}>
                <View style={styles.topHeader}>
                    <View style={styles.rightv}>
                        <Image  source={require('../img/logo.png')} resizeMode={'stretch'} style={styles.logoStyle}  />
                    </View>
                    <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => { this.props.navigation.dispatch(DrawerActions.openDrawer()) }}>
                            <Icon name="bars" type="FontAwesome" color="#772f7b" size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.top}>
                    <Image source={require('../img/banniere1.png')} resizeMode={'stretch'} style={styles.backgroundImage}  />
                </View>
                <View style={styles.test}>
                   
                        <TouchableOpacity activeOpacity={0.8}onPress={ () => {
                            if(this.state.token!=null)
                            this.props.navigation.navigate('Vo')
                            else this.props.navigation.navigate('SignIn')}}>
                            <View style={styles.btns}>
                                    <View style={styles.Icon}>
                                    <Image source={require('../img/AcceuilLogo1.png')} resizeMode={'stretch'} style={{ width: 60, height: 60 }} />
                                    </View>
                                    <View style={styles.footer}>
                                    <Image source={require('../img/Acceuil1.png')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                                    </View>
                                
                            </View>
                        </TouchableOpacity>
                        <View style={styles.doubleBtns}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                {   
                                    if (this.state.token != null)
                                        this.props.navigation.navigate('Sej')
                                    else this.props.navigation.navigate('SignIn')
                                }}}>
                                    <View style={styles.btns}>
                                    <View style={styles.Icon}>
                                        <Image source={require('../img/AcceuilLogo2.png')} resizeMode={'stretch'} style={{ width: 60, height: 60 }} />
                                    </View>
                                    <View style={styles.footer2}>
                                        <Image source={require('../img/Acceuil2.png')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                                    </View>
                                    </View>
                                </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                if (this.state.token != null)
                                    this.props.navigation.navigate('MesR')
                                else this.props.navigation.navigate('SignIn')}}>
                                    <View style={styles.btns1}>
                                    <View style={styles.Icon}>
                                        <Image source={require('../img/fact.png')} resizeMode={'stretch'} style={{ width: 60, height: 60 }} />
                                    </View>
                                    <View style={styles.footer2}>
                                        <Image source={require('../img/Acceuil3.png')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                                    </View>
                                    </View>
                                </TouchableOpacity>
                        
                    </View> 
                </View>



            </View>
                <View style={{ height: 25, justifyContent: 'flex-end',alignItems:"center", backgroundColor: 'rgba(140,81,141,0.9)' }}><Text style={{textAlign:"center",marginBottom:6,color:'white',fontSize:10}}>Be4go Version 1.1</Text></View>
            </ImageBackground>
        );
    }
}

const styles = {
    Icon:{
       flex:1,
       justifyContent:'center',
       alignItems:'center'
    },
    footer: {
        height: 63,
    },
    footer2: {
        height: 38,
    },
    doubleBtns:{
        flexDirection:'row'
    },
    Accueil1:{
        height:'100%',
        width:'100%',
        backgroundColor:'black'
    },
    btns:{
        borderRadius:4,
        marginBottom:5,
        height:157,
        width: 150,
        borderColor: '#772f7b',
        borderWidth:1,
        backgroundColor: 'rgba(255,255,255,0.8)'
    },
    btns1: {
        borderRadius: 4,
        marginLeft: 5,
        height: 157,
        width: 150,
        borderColor: '#772f7b',
        borderWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.8)'
    },
    rightv: {
        width: "30%",
    },
    leftv: {
        width: "20%",
        justifyContent: 'center',
    },
    cantainer: {
        flex: 1,
    },
    
    topHeader :{
        height: 40,
        justifyContent: 'center',
        backgroundColor: "rgb(255,243,241)",
        flexDirection: 'row',
        paddingLeft: '9%',
        paddingRight: '3%'

    },
    logoStyle: {
        height: "100%",
        width: "100%",
    },
    top: {
        height: 157,
        paddingLeft: '0%',
        paddingRight: '0%',

    },
    backgroundImage: {
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",

    },
    test:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',

    },
    buttonbackgroundImage:{
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
    },
    buttonPlanifierMonBudget:{
        marginTop: 5,
        alignItems: 'center',
        alignSelf: 'center',
        height: '5%',
    },
    styleText:{
        marginTop: '2%',
        marginBottom: '2%',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#7a2b7a',
    },
    leftv2: {
        top:3,
        position: "absolute",
        left: 30,
        alignItems: "center",
        justifyContent: 'center',
    },

};
