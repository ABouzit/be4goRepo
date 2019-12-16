import React, { Component, Fragment } from 'react';
import { View, Text, AsyncStorage, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground} from 'react-native';
import Button from "react-native-button";
import axios from 'axios';
import Config from "../services/config";
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton,statusCodes } from 'react-native-google-signin';
import {Image} from "react-native-elements";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Login extends Component {

  constructor(props){

    super(props);
      this.state = {
          email: '',
          password: '',
          error: '',
          loading: false,
          tokendevice: '',
          isSigninInProgress: false

      };
      this.props.navigation.addListener('willFocus', () => {
          const { navigation } = this.props;
          this.getToken();

      })


    this.loginUser = this.loginUser.bind(this);
    this.onLoginFail = this.onLoginFail.bind(this);
    var reponse = "";
  }

  static navigationOptions = {
    title: 'Magazines',
    header: null,
  };

    setEmail = async () => {
        let email = await AsyncStorage.setItem("email", this.state.email);
    }
  loginUser() {

   
    var url = Config.SERVER_URL+'/api/signin';
    this.state.data={
        email: this.state.email,
        password: this.state.password,
        tokendevice: this.state.tokendevice
    }

      axios.post(url, this.state.data)
    .then( response => {
        console.log(response.data.token);
    //viceStorage.saveKey("id_token", response.data.token);
      this.storeToken(response.data.token);
        this.setEmail();
     //this.props.newJWT(response.data.token);
      this.props.navigation.navigate('Home')

    })
    .catch((error) => {

        Alert.alert("Email ou mot de passe incorrecte")
    });
  }

  storeToken = async(token)=>{
    var mytoke = await AsyncStorage.setItem("id_token", token);
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

    componentDidMount() {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId:
                '342444537279-8d31h0hnmdc8tc8cg56g6b7hu45m6s63.apps.googleusercontent.com',
        });
    }

    onLoginFail() {
    this.setState({
      error: 'Login Failed',
      loading: false
    });
  }

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };


    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('QWERTZU///'+JSON.stringify(userInfo))
            this.setState({ userInfo: userInfo.user.id });
            let url1 = Config.SERVER_URL+'/auth/google';
            console.log("token device : ")
            console.log(this.state.tokendevice)
            axios.post(url1, {
                id : this.state.userInfo,
                tokendevice: this.state.tokendevice
            }).then(response =>{
                  this.storeToken(response.data)
                console.log("token" + response.data ) ;
                //this.props.newJWT(response.data.token);
                this.props.navigation.navigate('Home')
            }).catch(err =>{
                this.signOut;
                Alert.alert('Google', 'impossible de se connecter avec google réessayer plus tard')
                console.log("err")
                console.log(err)
            })
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log( "sign_in_cancelled : " + error)
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log( "IN_PROGRESS : " + error)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log( "PLAY_SERVICES_NOT_AVAILABLE" + error)
            } else {
                console.log( "other error" + error)
            }
        }
    };


    render() {
          const { email, password, error, loading } = this.state;
          const { form, section, errorTextStyle } = styles;
          return (
              <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../img/backGroundIdentification.jpg')}>
                  <View style={styles.cantainer}>
                      <View style={styles.header2}>
                          <Image source={require('../img/Identification.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                          <View style={styles.leftv2}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
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

                          <Text style={styles.styleText2}>Identifiez-vous</Text>
                         
                          <View style={styles.inputView}>
                              <View style={styles.labNdIcon2}>
                                  <Image source={require('../img/envelope.png')} style={{ height: 30, width: 30, marginLeft: 5, }} />
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
                          <View style={styles.inputView}>
                              <View style={styles.labNdIcon2}>
                                  <Image source={require('../img/cadna.png')} style={{ height: 30, width: 30, marginLeft: 5, }} />
                                  <Text style={styles.labelStyle}>Mot de passe</Text>
                              </View>
                              <TextInput
                                  value={this.state.hebergement}
                                  style={styles.inputStyle}
                                  secureTextEntry={true}
                                  placeholder=" "
                                  value={password}
                                  onChangeText={password => this.setState({ password })}

                              />
                          </View>
                                  <View style={{ flexDirection: "row",alignSelf:"center",marginTop:-5,marginBottom:-15 }}>
                                      <View style={{ marginTop: 10, alignSelf: 'center' }}>
                                          <LoginButton
                                              style={{ width: 35, height: 38, marginTop: 1, marginRight: 10 }}
                                              onLoginFinished={
                                                  (error, result) => {
                                                      if (error) {
                                                          console.log("login has error: " + JSON.stringify(error));
                                                      } else if (result.isCancelled) {
                                                          console.log("login is cancelled.");
                                                      } else {
                                                          console.log("dkhaaaal")
                                                          AccessToken.getCurrentAccessToken().then(
                                                              (data) => {
                                                                  console.log(data.accessToken.toString());
                                                                  let url1 = Config.SERVER_URL + '/auth/facebook';
                                                                  axios.post(url1, {
                                                                      access_token: data.accessToken.toString(),
                                                                      tokendevice: this.state.tokendevice
                                                                  }).then(response => {
                                                                      this.storeToken(response.data);
                                                                      //this.props.newJWT(response.data.token);
                                                                      this.props.navigation.navigate('Home')
                                                                      console.log(response);
                                                                  }).catch(err => {
                                                                      LoginManager.logOut();
                                                                      Alert.alert('Facebook', 'impossible de se connecter avec facebook réessayer plus tard')
                                                                      console.log("err")
                                                                      console.log(err)
                                                                  })
                                                              }
                                                          )
                                                      }
                                                  }
                                              }
                                              onLogoutFinished={() => console.log("logout.")}
                                          />

                                      </View>

                                      <View style={{ marginTop: 10, alignSelf: 'center' }}>
                                          <GoogleSigninButton
                                              style={{ width: 42, height: 45 }}
                                              size={GoogleSigninButton.Size.Icon}
                                              color={GoogleSigninButton.Color.Light}
                                              onPress={this._signIn}
                                              disabled={this.state.isSigninInProgress} />
                                      </View>
                                  </View>
                                  <View style={styles.inputView}>
                                  <Button
                                      containerStyle={styles.loginContainer}
                                      style={styles.loginText}
                                      onPress={this.loginUser}
                                  >
                                      Connexion
                      </Button>
                      </View>
                                  <View style={styles.mdpOublie}>
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate("Recup")}>
                                          <Text style={styles.mdpText}>Mot de passe oublié ?</Text>
                                      </TouchableOpacity>
                                  </View>
                          
                      </View>
                              <View style={styles.sectionDestination2}>

                                  <Text style={styles.styleText2}>Pas encore inscrit ?</Text>

                                  <View style={styles.inputView}>
                                      <Button
                                          containerStyle={styles.loginContainer2}
                                          style={styles.loginText}
                                          onPress={() => this.props.navigation.navigate("SignUp")}
                                      >
                                          Je crée mon compte
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
        placeholder: "#a0a0a0",
        background: "#f2f2f2",
        blue: "#3293fe"
    },
    fontSize: {
        title: 10,
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

export const AppIcon = {
    container: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 8,
        marginRight: 10
    },
    style: {
        tintColor: AppStyles.color.tint,
        width: 25,
        height: 25
    },

};

const HeaderButtonStyle = StyleSheet.create({
    multi: {
        flexDirection: "row"
    },
    container: {
        padding: 10
    },

    rightButton: {
        color: AppStyles.color.tint,
        marginRight: 10,
        fontWeight: "normal",
        fontFamily: AppStyles.fontName.main
    }
});

const ListStyle = StyleSheet.create({
    title: {
        fontSize: 16,
        color: AppStyles.color.subtitle,
        fontFamily: AppStyles.fontName.bold,
        fontWeight: "bold"
    },
    subtitleView: {
        minHeight: 55,
        flexDirection: "row",
        paddingTop: 5,
        marginLeft: 10
    },
    leftSubtitle: {
        flex: 2
    },
    avatarStyle: {
        height: 80,
        width: 80
    }
});

const styles = StyleSheet.create({
    logo:{
        alignItems: 'center',
         justifyContent: 'center', 
         marginBottom:20,
         marginTop:20,
         flex:1,
        },
    buttonbackgroundImage: {
       
        height: "100%",
        width: "100%",
    },
    header2: {
        right:0,
        height: 40,
        justifyContent: 'center',
    },
        container: {
            flex: 1,
            alignItems: "center",
            backgroundColor:'green'
        },
        or: {
            fontFamily: AppStyles.fontName.main,
            color: "black",
            marginTop: 40,
            marginBottom: 10
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
            alignSelf:"center",
            width: AppStyles.buttonWidth.main,
            backgroundColor:  '#772f7b',
            borderRadius:5,
            padding: 10,
            marginTop: 30
        },
    loginContainer2: {
        alignSelf: "center",
        width: AppStyles.buttonWidth.main,
        backgroundColor: '#772f7b',
        borderRadius: 5,
        padding: 10,
        marginTop: 15,
        marginBottom:10
    },
        loginText: {
            color: AppStyles.color.white,
            fontWeight:"bold"
        },
    signupContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.white,
        borderRadius: AppStyles.borderRadius.main,
        padding: 8,
        borderWidth: 1,
        borderColor: AppStyles.color.tint,
        marginTop: 15
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
            height: 40,
            paddingLeft: 20,
            paddingRight: 20,
            color: AppStyles.color.text

        },
        facebookContainer: {
            width: AppStyles.buttonWidth.main,
            backgroundColor: AppStyles.color.facebook,
            borderRadius: AppStyles.borderRadius.main,
            padding: 10,
            marginTop: 30
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
            marginTop:10,
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
            backgroundColor:'rgba(255,255,255,0.8)'

        },
    sectionDestination2: {
        position: 'relative',
        borderRadius: 5,
        marginLeft: '5%',
        marginRight: '5%',
        flex: 2,
        marginTop: 10,
        padding: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginBottom:50,
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
    mdpText:{
        fontSize:20,
        fontWeight: 'normal',
        color: '#772f7b',
        alignSelf: 'center',
        fontFamily: 'bradhitc',
        marginTop: 10,
        marginBottom: 20,
        textDecorationLine:'underline'
    },
    leftv2: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },
        });
