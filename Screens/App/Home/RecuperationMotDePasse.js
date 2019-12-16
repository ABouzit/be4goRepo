import React, { Component, Fragment } from 'react';
import { AsyncStorage, View, Text, Alert, TouchableOpacity, TextInput,StyleSheet,ImageBackground,Image } from 'react-native';
import axios from 'axios';
import Config from "../services/config";
import Button from "react-native-button";
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging'
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export default class RecuperationMotDePasse extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      password2: '',
      error: '',
      loading: false,
      tokendevice:'',
    };

    /*this.props.navigation.addListener('willFocus', () => {
        const { navigation } = this.props;
        this.getToken();

    })*/
    this.getToken();
      this.recupUser = this.recupUser.bind(this);
    this.onRegistrationFail = this.onRegistrationFail.bind(this);
  }


    GetSectionListItem=()=>{
        Alert.alert("Vous etes bien inscrit")
    }

    async getToken() {

        let fcmToken = await AsyncStorage.getItem('fcmToken') || null;

        console.log("*********fcm******Login1" + fcmToken)
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            console.log("******token*******3aamer***2" + fcmToken)
            this.setState({tokendevice: fcmToken});
            if (fcmToken) {

            }
        }
    }
    
  storeToken = async(token)=>{
    var mytoke = await AsyncStorage.setItem("id_token", token);
  }
    loginUser() {
        

      var url = Config.SERVER_URL+'/api/signin';
      this.state.data={
          email: this.state.email,
          password: this.state.password,
          tokendevice: this.state.tokendevice
      }
  console.log(this.state.data);
        axios.post(url, this.state.data)
      .then( response => {
  
      //viceStorage.saveKey("id_token", response.data.token);
        this.storeToken(response.data.token);
  
       //this.props.newJWT(response.data.token);
        this.props.navigation.navigate('Home')
  
      })
      .catch((error) => {
  
          Alert.alert("Email ou mot de passe incorrecte")
      });
    }
  
  recupUser() {
    
      console.log("test");
      var url = Config.SERVER_URL +'/api/forgotpwd';
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(this.state.email) === true){
      axios.post(url, {
          email: this.state.email,

      })
          .then( response => {
              console.log("reeeeeeeeeeespo" + JSON.stringify(response));
              if (response.status == 200) {
                  Alert.alert("L'email de réinitialisation de mot de passe a été envoyé.")

              }
              else if (response.status ==400) {
                  console.log("reeeeeeeeeeespo" + response.data);
                  Alert.alert("Votre mot de passe n'a pas été réinitialisé , veuillez réessayer")
              }
              
          })
          .catch((error) => {
              console.log("teeest");
              console.log(error);
          });
      } 
      else Alert.alert("address E-mail invalide.")
  }

    onRegistrationSuccess() {
        this.setState({
            error: 'Registration bien effectue',
            loading: false
        });
    }
  onRegistrationFail() {
    this.setState({
      error: 'Registration Failed',
      loading: false
    });
  }

  render() {
      const { email, password2, password, password_confirmation, error, loading } = this.state;
    const { form, section, errorTextStyle } = styles;
/*
      return (

          <View style={styles.container}>
              <Text style={[styles.title, styles.leftTitle]}>Inscription</Text>

              <View style={styles.InputContainer}>
                  <TextInput
                      style={styles.body}
                      placeholder="E-mail "
                      value={email}
                      onChangeText={email => this.setState({ email })}
                      value={this.state.email}
                      placeholderTextColor={AppStyles.color.grey}
                      underlineColorAndroid="transparent"
                  />
              </View>
              <View style={styles.InputContainer}>
                  <TextInput
                      style={styles.body}
                      placeholder="Mot de passe"
                      secureTextEntry={true}
                      value={password}
                      onChangeText={password => this.setState({ password })}
                      value={this.state.password}
                      placeholderTextColor={AppStyles.color.grey}
                      underlineColorAndroid="transparent"
                  />
              </View>
              <Button
                  containerStyle={[styles.facebookContainer, { marginTop: 50 }]}
                  style={styles.facebookText}
                  onPress={this.registerUser}
              >
                  Inscription
                  </Button>
          </View>);
*/
return(
      <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../img/backGroundIdentification.jpg')}>
          <View style={styles.cantainer}>
              <View style={styles.header2}>
                <Image source={require('../img/récupérer.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                <View style={styles.leftv2}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                    </TouchableOpacity>
                </View>
              </View>
              <KeyboardAwareScrollView>
                  <View Style={styles.bodyfrom}>
                      <View style={styles.logo}>
                          <Image source={require('../img/logo2.png')} style={{ width: 250, height: 150, }} />
                      </View>
                      <View style={styles.sectionDestination}>

                        <Text style={styles.styleText2}>Récupérer votre compte</Text>

                          <View style={styles.inputView}>
                              <View style={styles.labNdIcon2}>
                                  <Image source={require('../img/envelope.png')} style={{ height: 30, width: 30, marginRight: 5, }} />
                                  <Text style={styles.labelStyle}>E-mail</Text>
                              </View>
                              <TextInput
                                  placeholder=" "
                                  style={styles.inputStyle}
                                  value={email}
                                  onChangeText={email => this.setState({ email })}
                                  placeholderTextColor={AppStyles.color.grey}
                              />
                          </View>
                       
                          <View style={{ flexDirection: "row", alignSelf: "center" }}>
                              
                          </View>
                          <View style={styles.inputView}>
                              <Button
                                  containerStyle={styles.loginContainer}
                                  style={styles.loginText}
                                  onPress={()=> this.recupUser()}
                              >
                                  Récupérer mon compte
                      </Button>
                          </View>


                      </View>
                      </View>
                      </KeyboardAwareScrollView>
                      </View>
                      </ImageBackground>
);
      
  }
}



const AppStyles = {
    color: {
        main: "#5ea23a",
        text: "#f56d61",
        title: "#464646",
        subtitle: "#545454",
        categoryTitle: "#161616",
        tint: "#ff5a66",
        description: "#bbbbbb",
        filterTitle: "#8a8a8a",
        starRating: "#2bdf85",
        location: "#a9a9a9",
        white: "white",
        facebook: "#4267b2",
        grey: "#f56d61",
        greenBlue: "#00aea8",
        placeholder: "#f56d61",
        background: "#f2f2f2",
        blue: "#3293fe"
    },
    fontSize: {
        title: 30,
        content: 20,
        normal: 16
    },
    buttonWidth: {
        main: "70%"
    },
    textInputWidth: {
        main: "80%"
    },
    fontName: {
        main: "Noto Sans",
        bold: "Noto Sans"
    },
    borderRadius: {
        main: 25,
        small: 5
    }
};
const styles = StyleSheet.create({
    leftv2: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: "center"
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: "bold",
        color: AppStyles.color.tint,
        marginTop: 20,
        marginBottom: 20
    },
    leftTitle: {
        alignSelf: "stretch",
        textAlign: "center",
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: "center",
        fontSize: AppStyles.fontSize.content,
        color: AppStyles.color.text
    },
    loginContainer: {
        alignSelf: "center",
        width: '80%',
        backgroundColor: '#772f7b',
        borderRadius: 5,
        padding: 10,
        marginTop: 30,
        marginBottom:10
    },
    loginText: {
        color: AppStyles.color.white,
        fontWeight:"bold"
    },
    placeholder: {
        fontFamily: AppStyles.fontName.text,
        color: "red"
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: AppStyles.color.grey,
        borderRadius: AppStyles.borderRadius.main
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text
    },
    facebookContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
    },
    facebookText: {
        color: AppStyles.color.white
    },
    inputStyle: {
        color: '#772f7b',
        fontSize: 15,
        paddingBottom: -4,
        textAlign: 'right',
        height: 30,
        marginTop: 5,

        borderBottomWidth: 0.5,
        borderColor: 'rgb(120,43,120)'
    },
    inputView: {
        position: 'relative',
        flex: 1,
        marginTop:20,
        marginRight: '3%',
        marginLeft: '5%',
        marginBottom: 10,

    },
    labNdIcon2: {
        position: 'absolute',
        top: -5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:-5
    },
    styleText2: {
        flex: 2,
        fontSize: 30,
        fontWeight: 'normal',
        color: '#772f7b',
        alignSelf: 'center',
        fontFamily: 'bradhitc',
        marginTop: 10,
        marginBottom: 5
    },
    sectionDestination: {
        position: 'relative',
        borderRadius: 5,
        marginLeft: '5%',
        marginRight: '5%',
        flex: 2,
        marginTop: 10,
        padding: 0,
        backgroundColor: 'rgba(255,255,255,0.8)'

    },
    labelStyle: {

        color: '#f56d61',
        fontSize: 15,
        fontWeight: 'normal',
        marginLeft: '3%',
        height: 22,
    },
    signupText: {
        color: AppStyles.color.tint
    },
    facebookText: {
        color: AppStyles.color.white
    },
    bodyfrom: {

        height: '90%',
        paddingBottom: 10,
    },
    mdpText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#772f7b',
        alignSelf: 'center',
        fontFamily: 'bradhitc',
        marginTop: 10,
        marginBottom: 20,
        textDecorationLine: 'underline'
    },
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20,
        flex: 1,
    },
    buttonbackgroundImage: {

        height: "100%",
        width: "100%",
    },
    header2: {
        right: 0,
        height: 40,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: 'green'
    },
});
