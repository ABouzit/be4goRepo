import React, { Component } from "react";
import {Platform, StyleSheet, Text, View, Button, FlatList, Alert,Picker, AsyncStorage, TouchableOpacity, ViewBase} from "react-native";

import Moment from 'moment';
import { Image} from "react-native-elements";
import {DrawerActions} from "react-navigation-drawer";
import ToggleSwitch from 'toggle-switch-react-native';
import DatePicker from "react-native-datepicker";
import axios from "axios";
import Config from "../services/config";
import Icon from 'react-native-vector-icons/FontAwesome';
export default class Alerte extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            token: '',
            id:'',
            data: [],
            throttlemode: '1',
            percentage: '80',
            date: '',
            isOnControleToggleSwitch: false,
            isOnSeuilToggleSwitch: false,

        };

        this.props.navigation.addListener('willFocus', () => {
            
            const { navigation } = this.props;
            //this.state.id = navigation.getParam('itemId', '136');
            this.getToken().then(token=>{
              console.log('/token/'+token);
              if (token != null) {
                this.fetchAlert(token);
              }
              else { console.log('token' + token); Alert.alert('Vous devez être connecté pour effectuer cette opération'); this.props.navigation.navigate('SignIn') }

               
            });
         
        })

        this.saveNotification = this.saveNotification.bind(this);

        //this.createVoyage = this.createVoyage.bind(this);
        //this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }

    getToken = async () => {
        const userToken = await AsyncStorage.getItem('id_token');
        const token = userToken;
        this.setState({token: userToken});
     
        return Promise.resolve(token);
    }


    fetchAlert(token){
        const headers = {
            'Authorization': 'Bearer ' + token
        };

        axios.get(Config.SERVER_URL+'/api/notification/get'
            , {
                headers: headers,
            }).then((res) => {

            console.log("*****************data************" + JSON.stringify(res.data[0].time));
            console.log
            console.log("*****************data************" + JSON.stringify(res.data[1].percentage));
            this.setState({
                data: res.data,
                date:this.res.data[0].time,
                percentage:res.data[1].percentage,
            });
            console.log("************date" + this.state.date);
        }).catch((error) => {
            this.setState({
                error: 'Error retrieving data',
                loading: false
            });
        });
    }


    onPickerValueChange=(value, index)=>{

        this.setState(
            {
                "throttlemode": value
            },
            () => {
                console.log("value******")
                console.log(value)

            }
        );
    }
    onPickerValueChange2=(value, index)=>{
        this.setState(
            {
                "percentage": value
            },
            () => {
                // here is our callback that will be fired after state change.
            }
        );
    }
    datechange=(hour) =>{
        this.setState({date: hour})
    }

    saveNotification(){
        const headers = {
            'Authorization': 'Bearer ' + this.state.token
        };
        var date = new Date();
      const timeZone = Number(date.getTimezoneOffset());
      console.log('GMT'+timeZone);

      var minutestotal=Number(this.state.date.substring(0,2))*60+Number(this.state.date.substring(3,5))+timeZone;
      if(minutestotal>=1440) minutestotal=minutestotal-1440;
      if(minutestotal<0) minutestotal=minutestotal+1440;
      var hours = (minutestotal / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      console.log();
        this.state.data = {
            typenotification: 'control',
            choise: this.state.throttlemode,
            time: rhours + ':' + rminutes,
            isActive: this.state.isOnControleToggleSwitch,
            percentage: this.state.percentage,
        }
        console.log("************data" + JSON.stringify(this.state.data));

        var url = Config.SERVER_URL+'/api/notification/update';
        axios.post(url, {
            typenotification: 'control',
            choise: this.state.throttlemode,
            time: rhours + ':' + rminutes,
            isActive: this.state.isOnControleToggleSwitch

        },{headers : headers}).then( reponse =>{
                console.log("reponseeee" + JSON.stringify(reponse.data))
                Alert.alert(JSON.stringify(reponse.data));
                axios.post(url, {
                    typenotification: 'seuil',
                    percentage: this.state.percentage,
                    isActive: this.state.isOnSeuilToggleSwitch
                },{headers : headers} ).then( reponse =>{
                    console.log("respooone " +reponse.data)
                    Alert.alert(JSON.stringify(reponse.data));
                }).catch(err => {
                    console.log(err)
                })
            }
        ).catch(err => {

            console.log("err$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            console.log(err)
            Alert.alert(err)
        })

    }
    render() {
        const { date } = this.state;

        return (
          <View style={styles.cantainer}>
            <View>
              <View style={styles.header2}>
                <Image
                  source={require('../img/mes_alertes.jpg')}
                  resizeMode={'stretch'}
                  style={styles.buttonbackgroundImage}
                />
                <View style={styles.leftv2}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack(null)}>
                    <Icon
                      name="angle-left"
                      type="FontAwesome"
                      color="white"
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bodyfrom}>
                <View
                  style={{
                    borderColor: '#939393',
                    borderBottomWidth: 0.5,
                    paddingBottom: 6,
                    marginBottom: 6,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Verdana',
                      fontSize: 15,
                      color: '#782b79',
                    }}>
                    Paramétrer vos alertes: elles se déclencheront pendant vos
                    séjours
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: '#2a2a2a',
                    borderBottomWidth: 0.5,
                    paddingBottom: 6,
                    marginBottom: 6,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Verdana',
                      fontSize: 15,
                      color: '#782b79',
                    }}>
                    Activer alertes contrôle dépenses
                  </Text>
                  <ToggleSwitch
                    isOn={this.state.isOnControleToggleSwitch}
                    onColor="#f56d61"
                    size="small"
                    onToggle={isOnControleToggleSwitch => {
                      this.setState({isOnControleToggleSwitch});
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{marginTop: 5}}>
                    <Image
                      source={require('../img/Oclock.png')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={styles.section1}>
                    <View style={styles.rightborder}>
                      <Image
                        source={require('../img/poly.png')}
                        style={{height: 13, width: 13,}}
                      />
                    </View>
                    <Picker
                      style={styles.PickerStyleClass}
                      selectedValue={this.state.throttlemode}
                      onValueChange={this.onPickerValueChange}
                      
                      color={'#f56d61'}>
                      <Picker.Item label="Tous les jours" value="1" />
                      <Picker.Item label="Tous les 2 jours" value="2" />
                      <Picker.Item label="Premier et dernier jour" value="3" />
                    </Picker>
                  </View>
                  <DatePicker
                    style={styles.date}
                    mode="time"
                    date={date}
                    onDateChange={date => {
                      this.setState({date: date});
                    }}
                    confirmBtnText="Confirm"
                    showIcon={false}
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        paddingTop: 6,
                        marginRight: 5,
                        color: '#f56d61',
                      },
                    }}
                    color={'#f56d61'}
                  />
                </View>
                <View
                  style={{
                    marginTop: 20,
                    borderColor: '#939393',
                    paddingTop: 6,
                    borderTopWidth: 0.5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Verdana',
                      fontSize: 15,
                      color: '#782b79',
                    }}>
                    Activer alertes seuil dépenses
                  </Text>
                  <ToggleSwitch
                    isOn={this.state.isOnSeuilToggleSwitch}
                    onColor="#f56d61"
                    size="small"
                    onToggle={isOnSeuilToggleSwitch => {
                      this.setState({isOnSeuilToggleSwitch});
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderColor: '#2a2a2a',
                    borderTopWidth: 0.5,
                    marginTop: 5,
                  }}>
                  <View style={{marginTop: 5}}>
                    <Image
                      source={require('../img/seuil.png')}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                  <View style={{marginLeft: 17, width: '53.5%'}}>
                    <Text
                      style={{fontSize: 17, color: '#f56d61', marginTop: 16 }}>
                      A partir de{' '}
                    </Text>
                  </View>
                  <View style={styles.section2}>
                   <View style={styles.rightborder2}>
                      <Image
                        source={require('../img/poly.png')}
                        style={{height: 13, width: 13,}}
                      />
                    </View>
                   
                  <Picker
                    style={styles.PickerStyleClass1}
                    selectedValue={this.state.percentage}
                    onValueChange={this.onPickerValueChange2}
                    color={'#f56d61'}>
                    <Picker.Item label="80%" value="80" />
                    <Picker.Item label="85%" value="85" />
                    <Picker.Item label="90%" value="90" />
                  </Picker>
                 
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.viewFooter}>
              <View style={styles.footer}>
                <View style={styles.footerMenu}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.dispatch(DrawerActions.openDrawer())
                    }>
                    <Image
                      source={require('../img/menu.png')}
                      style={{height: 40, width: 40}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.footerPlus}>
                  <TouchableOpacity onPress={this.saveNotification}>
                    <Image
                      source={require('../img/valider.png')}
                      style={{height: 40, width: 40}}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.footerFois}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Home')}>
                    <Image
                      source={require('../img/croix.png')}
                      style={{height: 40, width: 40}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  rightborder: {
    zIndex: 2,
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255,255,255,1)',
    width: 40,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rightborder2: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(255,255,255,1)',
    width: 40,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  section2: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 10,

    width: '70%',
  },
  section1: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 0,
    marginBottom: 10,

    width: '70%',
  },
  date: {flex: 1, color: '#f56d61'},
  footer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderColor: 'rgba(120,43,120,0.8)',
    height: 45,
    minHeight: 45,
    backgroundColor: 'rgb(120,43,120)',
    position: 'relative',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },
  footerPlus: {
    height: 60,
    width: 60,
    borderRadius: 50,
    backgroundColor: 'rgb(255,111,97)',
    alignSelf: 'center',
    bottom: 0,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerFois: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10,
  },
  footerMenu: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 10,
    height: 30,
    width: 40,
  },
  leftv2: {
    position: 'absolute',
    left: 20,
    alignItems: 'baseline',
    width: '20%',
    justifyContent: 'center',
  },
  rightv: {
    width: '30%',
  },
  leftv: {
    width: '20%',
    justifyContent: 'center',
  },
  cantainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  topHeader: {
    height: '7%',
    justifyContent: 'space-between',
    backgroundColor: '#fff2f1',
    flexDirection: 'row',
    paddingLeft: '9%',
    paddingRight: '3%',
  },
  logoStyle: {
    height: '100%',
    width: '100%',
  },
  header2: {
    height: 40,
    justifyContent: 'center',
  },
  styleText: {
    marginTop: '4%',
    marginBottom: '3%',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#772f7b',
    marginLeft: '10%',
  },
  buttonbackgroundImage: {
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  bodyfrom: {
    height: '65%',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
  },
  h2text: {
    marginTop: 10,
    fontFamily: 'Helvetica',
    fontSize: 36,
    fontWeight: 'bold',
  },
  flatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f56d61',
  },
  flatHeader2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcf7f8',
  },
  textHeadFlat: {
    fontFamily: 'Verdana',
    fontSize: 25,
    marginLeft: '43%',
    color: '#fFF',
  },
  textHeadFlat2: {
    fontFamily: 'Verdana',
    fontSize: 15,
    color: '#782b79',
  },
  icontrash: {
    marginTop: 6,
    marginRight: 4,
  },
  coreFlat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  budget: {
    color: '#782b79',
    fontFamily: 'Verdana',
    fontSize: 15,
    fontWeight: 'bold',
  },
  budgetNumber: {
    color: '#f56d61',
    fontSize: 30,
  },
  cercleControle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    height: 80,
    width: 80, //The Width must be the same as the height
    borderRadius: 140, //Then Make the Border Radius twice the size of width or Height
    backgroundColor: '#782b79',
  },
  cercleModifier: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    height: 80,
    width: 80, //The Width must be the same as the height
    borderRadius: 140, //Then Make the Border Radius twice the size of width or Height
    backgroundColor: '#fbf2f1',
    borderColor: '#782b79',
    borderWidth: 1,
  },
  textAcceuil: {
    fontFamily: 'Verdana',
    fontSize: 20,
    color: '#fFF',
  },
  PickerStyleClass: {
    zIndex: 10,
    marginLeft: 17,
    width: '100%',
    color: '#f56d61',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  PickerStyleClass1: {
    zIndex: 10,
    width: '40%',
    color: '#f56d61',
    marginLeft:55,
    backgroundColor:'rgba(0,0,0,0)'
  },
  viewFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

