import React, { Component } from 'react';
import { View,ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar } from 'react-native';
import { Login, Registration } from '../Home/index';
import deviceStorage from '../services/deviceStorage';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import axios from 'axios';


export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      jwt: '',
      loading: true

    }
    this.props.navigation.addListener('willFocus', () => {
      const { navigation } = this.props;
    });
    this.newJWT = this.newJWT.bind(this);
   // this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT().then(result =>
    {

      if(result !="error") {
      //  console.log("=======================================================" + resullt)
        this.props.navigation.navigate('Home');
      }
      else
        this.props.navigation.navigate('SignIn');


    }).catch(error =>
    {
      console.log(error);
    })

    //this.whichForm = this.whichForm.bind(this);
    //this.authSwitch = this.authSwitch.bind(this);


  }

  newJWT(jwt) {
    this.setState({
      jwt: jwt
    });
  }

  authSwitch() {
    this.setState({
      showLogin: !this.state.showLogin
    });
  }

  whichForm() {
    if (!this.state.showLogin) {
      return (
          <Registration newJWT={this.props.newJWT} authSwitch={this.authSwitch}/>
      );
    } else {
      return (
          <Login newJWT={this.props.newJWT} authSwitch={this.authSwitch}/>
      );
    }
  }
  componentDidMount() {


    this.checkPermission();
    this.createNotificationListeners();

  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    //const datetoken = await AsyncStorage.getItem('fcmToken') || null;
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {

    let fcmToken = await AsyncStorage.getItem('fcmToken') || null;


    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();

      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);

      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
   
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    alert(
        title, body,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
    );
  }

  render() {
    return (
        <View>
          <ActivityIndicator/>
          <StatusBar barStyle="default"/>
        </View>
    );
  }

  /*render() {
    return(
      <View style={styles.container}>
        {this.whichForm()}
      </View>
    );
  }
}*/
}
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  }
};
