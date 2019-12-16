import React, { Component, Fragment } from 'react';
import {View, Text, Alert, Picker, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Input, TextLink, Loading, Button } from './common';
import axios from 'axios';
import {Header, Image} from "react-native-elements";
import Config from "../services/config";
import {DrawerActions} from "react-navigation";
import DatePicker from "react-native-datepicker";
import Modalbox from 'react-native-modalbox';

import Icon from 'react-native-vector-icons/FontAwesome';
export default class Depense extends Component {
    constructor(props){
        
        super(props);

        this.state = {
            categorie:'',
            libelle:'',
            montant:'',
            loading: true,
            selected:'',
            error: '',
            throttlemode:'',
            montantS:'',
            modalVisible: false,
            data:[],
            devise:'',
            montantDevise:''
        };

        this.props.navigation.addListener('willFocus', () => {
            console.log('///////////////////////////const' + JSON.stringify(this.state));
            const { navigation } = this.props;
            this.state.id = navigation.getParam('itemId', '136');
            this.state.modalVisible = true;
            
            this.setState({   
                montant:"",        
                montantS:"",            
            })
            this.state.montantS = navigation.getParam('montant','0') ;
            
                                                  
                     
            this.state.montantS =this.state.montantS.replace(/,/g,'.');
            this.state.montantS = this.state.montantS.replace(/[^\d.]/g, '');
            this.state.montantS = parseFloat(Math.round(this.state.montantS * 100) / 100).toFixed(2);
            this.state.montant=this.state.montantS;
           
            if(this.state.montantS == 0.00)                                    
            {
                this.setState({   
                    montant:"",                    
                })
            }   
            console.log("***********montant " + this.state.montant);
            console.log("***********montant S" + this.state.montantS);
            
      
            this.state.voyage = navigation.getParam('item', null);
                this.setState( {voyage: navigation.getParam('item', null)})

            this.state.devise=this.state.voyage.devise


        })
        //this.getMontantSc();



        this.createDepense= this.createDepense.bind(this);
        //this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }
    changeFromTo(amout, devise) {
        console.log(amout);
        console.log(devise);

        var key = 'access_key=2f14d09b0561d08e3d9d2d4df25ebf6c';
        var from = 'from=EUR';
        var to = 'to=' + devise;
        var amnt = 'amount=' + amout;
        var URL = 'http://data.fixer.io/api/convert?' + key + '&' + from + '&' + amnt + '&' + to;
        console.log(URL);
        if (devise = 'EUR') { return amout; }
        else {
            
        }
    }
    setModalVisible(visible) {
        this.props.navigation.navigate('Cntrl')

      }
   /* getMontantSc(){
        this.setState({
            montant:this.state.montantS,
        })


    }*/

    GetSectionListItem=(item)=>{
        Alert.alert(item)
    }
    onPickerValueChange=(value, index)=>{
        this.setState(
            {
                "throttlemode": value
            },
            () => {
                // here is our callback that will be fired after state change.


            }
        );

        

    }
  
  
  
  
  
  
  
  
  
    onPickerValueChangeDevise = (value, index) => {
        this.setState(
            {
                "devise": value
            },
            () => {
                // here is our callback that will be fired after state change.
                console.log(value);

            }
        );
    }
  
  
    onPickerValueChangeSous=(value, index)=>{
        this.setState(
            {
                "libelle": value
            },
            () => {
                // here is our callback that will be fired after state change.


            }
        );
    }
    createDepense() {


        var url = Config.SERVER_URL+'/api/depenses';
        var date = new Date();
        console.log("daaaaaaaaaaaaate " + date);
        if(this.state.libelle == "1" || this.state.libelle == "" || !this.state.libelle){
            this.GetSectionListItem("Veuillez choisir une sous-catégorie");
        }
        else{
            console.log(this.state.libelle+'libelleeeee');
            console.log('hnaaaa//////////////////////////'+JSON.stringify({
                id_categorie: this.state.throttlemode,
                libelle: this.state.libelle,
                montant: this.state.montant,
                dateDepense: date,
                id_voyage: this.state.id,
                devise:this.state.devise,
                isDepense: 1,
            }));
            console.log('hnaaaa//////////////////////////' + JSON.stringify({
                id_categorie: this.state.throttlemode,
                libelle: this.state.libelle,
                montant: this.state.montant,
                dateDepense: date,
                id_voyage: this.state.id,
                devise: this.state.devise,
                isDepense: 1,
            }));
            console.log('this.state.devise == this.state.voyage.devise' + this.state.devise +'/'+ this.state.voyage.devise);
            if (this.state.devise == this.state.voyage.devise) { 
                this.state.montant = this.state.montantDevise;
        axios.post(url, {
            id_categorie: this.state.throttlemode,
            libelle:  this.state.libelle,
            montant: this.state.montant,
            montantDevise:this.state.montantDevise,
            dateDepense:date,
            id_voyage: this.state.id,
            devise: this.state.devise,
            isDepense: 1 ,
        })
            .then( response => {
                console.log("repossssssssse/////////////////////////////////////////////////////////////////////////////////////////////" + JSON.stringify(response.data));
                if(response.data == "depense créer avec succés") {
                    this.GetSectionListItem("Nouvelle dépense ajoutée");
                    this.setState({ data: [], libelle: '', montant: '', throttlemode: '', devise: '', montantDevise:''})
                   


                        
                    this.setModalVisible(false);
                }
                else if (response.data == "seulement 20 opérations par catégorie sont auorisées") {
                    this.GetSectionListItem(response.data);
                }
                else {
                        this.GetSectionListItem("Depense n'a pas été crée , veuillez réessayer");
                }

                // this.props.navigation.navigate('signIn')

            })
            .catch((error) => {
                console.log("teeest");
                console.log(error);
                //this.onLoginFail();

            });
        }
        else{
                axios.get('https://api.exchangeratesapi.io/latest?symbols=' + this.state.voyage.devise + '&base=' + this.state.devise)
                    .then(response => {
                        console.log('honna toba3o' + JSON.stringify());
                        this.state.montant = this.state.montantDevise * Object.values(response.data.rates)[0];
                        axios.post(url, {
                            id_categorie: this.state.throttlemode,
                            libelle: this.state.libelle,
                            montant: this.state.montant,
                            montantDevise:this.state.montantDevise,
                            dateDepense: date,
                            id_voyage: this.state.id,
                            devise: this.state.devise,
                            isDepense: 1,
                        })
                            .then(response => {
                                console.log("repossssssssse/////////////////////////////////////////////////////////////////////////////////////////////" + JSON.stringify(response.data));
                                if (response.data == "depense créer avec succés") {
                                    this.GetSectionListItem("Nouvelle dépense ajoutée");
                                    this.setState({ data: [], libelle: '', montant: '', throttlemode: '', devise: '', montantDevise: '' })

                                    this.setModalVisible(false);
                                }
                                else if (response.data == "seulement 20 opérations par catégorie sont auorisées") {
                                    this.GetSectionListItem(response.data);
                                }
                                else {
                                    this.GetSectionListItem("Depense n'a pas été crée , veuillez réessayer");
                                }

                                // this.props.navigation.navigate('signIn')

                            })
                            .catch((error) => {
                                console.log("teeest");
                                console.log(error);
                                //this.onLoginFail();

                            });
                    })
                    .catch((error) => {
                        console.log("teeest");
                        console.log(error);
                        //this.onLoginFail();

                    });
               
        }
        }
        
  


    }


    render() {
        if(this.state.throttlemode ==1){
            this.state.data=[
               {"cat":"Avion"},
               {"cat":"Train"},
               {"cat":"Bus"},
               {"cat":"Autre"}
               
             ]
       }
       else if (this.state.throttlemode ==2){
           this.state.data=[
               {"cat":"Taxi"},
               {"cat":"Uber"},
               {"cat":"Transport en communs"},
               {"cat":"Autre"}
               
             ]
       }
       else if (this.state.throttlemode ==3){
           this.state.data=[
               {"cat":"Shopping"},
               {"cat":"Retrait argent"},
               {"cat":"Sortie"},
               {"cat":"Autre"}
               
             ]
       }
       else if (this.state.throttlemode ==4){
           this.state.data=[
               {"cat":"Restaurant"},
               {"cat":"Fast-Food"},
               {"cat":"Café"},
               {"cat":"Autre"}
               
             ]
       }
       else if (this.state.throttlemode ==5){
           this.state.data=[
               {"cat":"Hôtel"},
               {"cat":"Appartement"},
               {"cat":"Maison"},
               {"cat":"Autre"}
               
             ]
       }

 
        const { libelle,montant ,montantDevise, error , loading , data} = this.state;
        const { form, section, errorTextStyle } = styles;  
       
    

        return (
            <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                <View style={styles.cantainer} >
                    <View style={styles.header2}>
                        <Image source={require('../img/controler_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
            <Modalbox 
                        animationDuration={0}
                        swipeToClose={false}
                        backdrop={true} 
                        backdropPressToClose={false}
                isOpen={this.state.modalVisible}
                position={'center'}
                style={styles.modal}
            >
            <View style={styles.cantainer}>
                <View>
                    
                    <View style={styles.header3}>
                        <Image source={require('../img/Ajouter_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage}  />
                        <View style={styles.icontrash}>
                                        <TouchableOpacity onPress={() => { this.state.selectedItem = []; this.state.throttlemode = null; this.setModalVisible(false); }}>
                                            <Image source={require('../img/croix.png')} name={"close"} type={"font-awesome"} style={{ width: 20, height: 20 }} /></TouchableOpacity>
                                    </View>
                    </View>

                    <View style={styles.bodyfrom}>


                                    <View style={styles.section1}>
                                        <View style={styles.rightborder}>
                                            <Icon name="angle-down" type="FontAwesome" color="#772f7b" size={30} />
                                        </View>
                                        
                                        <Picker style={styles.PickerStyleClass}
                                            selectedValue={this.state.throttlemode}
                                            onValueChange={this.onPickerValueChange}
                                            defaultValue="Select..." itemTextStyle={{
                                                height: 40, textAlign: "center", fontWeight: 'bold'
                                            }} >
                                            <Picker.Item label="Sélectionnez la catégorie de dépense"  fontSize={20} />
                                            <Picker.Item label="Transport"  value="1" />
                                            <Picker.Item label="Déplacement"  value="2" />
                                            <Picker.Item label="Divers"  value="3" />
                                            <Picker.Item label="Alimentation"  value="4" />
                                            <Picker.Item label="Hebergement"  value="5" />

                                        </Picker>


                                    </View> 
                                   

                   
                                    <View style={styles.section2}>
                                        <View style={styles.rightborder}>
                                            <Icon name="angle-down" type="FontAwesome" color="#772f7b" size={30} />
                                        </View>

                                        <Picker
                                            selectedValue={this.state.libelle}
                                            onValueChange={this.onPickerValueChangeSous}
                                            defaultValue="Select..."
                                            style={styles.PickerStyleClass}
                                            itemTextStyle={{
                                                height: 40, textAlign: "center", fontSize: 20, fontWeight: 'bold'
                                            }} >

                                            <Picker.Item label="Sélectionnez la sous-catégorie"  />

                                            {
                                                data.map((item) => {
                                                    return (
                                                        <Picker.Item  label={item.cat} value={item.cat} key={item.cat} />
                                                    );
                                                })
                                            }



                                        </Picker>


                                    

                        </View>
                                    <View style={styles.inputView}>
                                        <View style={styles.labNdIcon}>
                                            <Image source={require('../img/fact.png')} style={{ height: 30, width: 30, }} />
                                            <Text style={styles.labelStyle}>MONTANT</Text>
                                        </View>
                                        <TextInput
                                            value={montantDevise}
                                            onChangeText={montantDevise => this.setState({ montantDevise })}
                                            value={this.state.montantDevise}
                                            style={styles.inputStyle2}
                                            maxLength={7}
                                            keyboardType={'numeric'}
                                        />
                                    </View>
                                    <View style={styles.section3}>
                                        <View style={styles.rightborder}>
                                            <Icon name="angle-down" type="FontAwesome" color="#772f7b" size={30} />
                                        </View>

                                        <Picker style={styles.PickerStyleClass}
                                            selectedValue={this.state.devise}
                                            onValueChange={this.onPickerValueChangeDevise}
                                            defaultValue="Select..." itemTextStyle={{
                                                height: 40, textAlign: "center", fontSize: 20, fontWeight: 'bold'
                                            }} prompt='Devise'>
                                            <Picker.Item label="EUR" value="EUR" />
                                            <Picker.Item label="AED" value="AED" />
                                            <Picker.Item label="AUD" value="AUD" />
                                            <Picker.Item label="CAD" value="CAD" />
                                            <Picker.Item label="CHF" value="CHF" />
                                            <Picker.Item label="DKK" value="DKK" />
                                            <Picker.Item label="GBP" value="GBP" />
                                            <Picker.Item label="JPY" value="JPY" />
                                            <Picker.Item label="MAD" value="MAD" />
                                            <Picker.Item label="MXN" value="MXN" />
                                            <Picker.Item label="MXN" value="MXN" />
                                            <Picker.Item label="RUB" value="RUB" />
                                            <Picker.Item label="SGD" value="SGD" />
                                            <Picker.Item label="SEK" value="SEK" />
                                            <Picker.Item label="THB" value="THB" />
                                            <Picker.Item label="TRY" value="TRY" />
                                            <Picker.Item label="USD" value="USD" />
                                            <Picker.Item label="ZAR" value="ZAR" />
                                        </Picker>


                                    </View> 
                            
                          
                            
                        
                    </View>
                </View>
            </View>
                       
                        <TouchableOpacity style={styles.button} onPress={() => this.createDepense()} >
                            <Text style={styles.styleText3}> Valider </Text>
                        </TouchableOpacity>
                    </Modalbox>
                    
</View></ImageBackground>

        );
    }
}

const styles = {
    icontrash: {
        position: "absolute",
        right: 10,
        alignSelf: 'center',
        color: 'rgba(190,146,183,0.5)',
        justifyContent: "center"
    },
    section1: {
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: "#772f7b",
        height: 40,
        marginTop: '5%',
        padding: 0

    },
    section2: {
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: "#772f7b",
        height: 40,
        marginTop: '2%',
        padding: 0

    },
    section3: {
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: "#772f7b",
        height: 40,
        width:'40%',
        alignSelf:'flex-end',
        marginTop: '2%',
        padding: 0

    },
    rightborder: {
        zIndex: 2,
        position: 'absolute',
        right: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        width: 40, height: 39,
        borderLeftWidth: 0.5,
        borderColor: '#772f7b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    PickerStyleClass: {
        zIndex: 10,
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0)',
        height: '90%',
        color: "#f56d61",
        borderRadius: 10,

    },
    modal:{
        height:370,
        width:'95%',
        borderWidth:1,
        borderColor:'black'
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
        backgroundColor: 'rgb(255,255,255)'
    },
    topHeader :{
        height: '7%',
        justifyContent: 'space-between',
        backgroundColor: "#fff2f1",
        flexDirection: 'row',
        paddingLeft: '9%',
        paddingRight: '3%'

    },
    logoStyle: {
        height: "100%",
        width: "100%",
    },
    header2: {
        height: 40,
        justifyContent: 'center'
    },
    styleText:{
        marginTop: '4%',
        marginBottom: '3%',
        fontSize: 17,
        fontWeight: 'bold',
        color: '#772f7b',
        marginLeft: '10%',
    },
    buttonbackgroundImage:{
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
    },
    bodyfrom: {
        height : '83%',
    },
    form: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    section: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#000',
        marginLeft: '5%',
        marginRight: '5%',
        height: 32,
        marginTop: 4,
        padding: 0

    },
   
    labelStyle: {
        color: '#f56d61',
        fontSize: 15,
        fontWeight: 'bold',
        height: '100%',
        marginLeft: '3%',
        padding: 2
    },
    inputStyle: {
        color: '#772f7b',
        height: 32,
        fontSize: 20,
        paddingBottom: -4,
        textAlign: 'right',
        justifyContent: 'center',
    },
   
    
    sectionDate:{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#000',
        marginLeft: '20%',
        marginRight: '5%',
        height: 32,
        marginTop: 4,
        justifyContent: 'flex-start',
        paddingTop: 0
    },
    header3: {
        height: 40,
        justifyContent: 'center'
    },
    leftv2: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },
    agenda: {
        margin : 0,
        marginLeft: 4,
        paddingTop: 2,
        color: "#b4b4b4"
    },
    datepickerView: {
        flex: 1,
        width: '100%',
        alignItems: 'stretch',
        marginRight: '10%',
        marginLeft: '5%',
        height: '100%',

    },
    errorTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
    },
    styleText2:{
        marginTop: '10%',
        marginBottom: '3%',
        fontSize: 17,
        fontWeight: 'bold',
        color: '#772f7b',
        marginLeft: '10%',
    },

    buttonSection:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        height: 30,
        marginTop: 20,
    },

    button: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 30,
        height: 40,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#782b79',
        borderColor: '#000000',
        borderRadius: 5,
        marginLeft: "5%"
    },
    buttonAnnuler: {
        flex: 0.4,
        alignItems: 'center',
        backgroundColor: '#fffbff',
        borderColor: '#000000',
        borderRadius:5,
        borderWidth: 0.5,
        marginRight: "5%"

    },
    styleText3:{
        fontSize: 17,
        color: '#ffffff',
    },
    styleText4:{
        fontSize: 17,
        color: '#782b79',
    },
    footer: {
        position:'absolute',
        bottom:0,
        flexDirection: 'row',
        borderTopWidth: 2,
        borderColor: 'rgba(120,43,120,0.8)',
        height: 45,
        minHeight: 45,
        backgroundColor: 'rgb(120,43,120)',
        position: "relative",
        justifyContent: "space-around",
        alignItems: 'center',
        paddingBottom: 5

    },
    footerPlus: {
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: 'rgb(255,111,97)',
        alignSelf: "center",
        bottom: 0,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: "center",
        justifyContent: "center"

    },
    footerFois: {
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginRight: 10

    },
    footerMenu: {
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginLeft: 10,
        height: 30, width: 40
    },
    inputView: {
        position: 'relative',
        marginRight: '3%',
        marginLeft: '5%',
        marginBottom: 10,

    },
    labNdIcon: {
        position: 'absolute',
        top: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    labelStyle: {

        color: '#f56d61',
        fontSize: 15,
        fontWeight: 'normal',
        marginLeft: '3%',
        height: 18,
    },
    inputStyle2: {
        color: '#772f7b',
        fontSize: 15,
        paddingBottom: -4,
        textAlign: 'right',
        height: 30,
        marginTop: 20,

        borderBottomWidth: 0.5,
        borderColor: 'rgb(120,43,120)'
    },
};


