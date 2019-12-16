import React, { Component } from 'react';
import { View, Text, AsyncStorage, Alert, ActivityIndicator, TouchableOpacity, TextInput, Picker   , ImageBackground} from 'react-native';
import axios from 'axios';
import {Header, Image} from "react-native-elements";
import DatePicker from 'react-native-datepicker'
import Config from "../services/config";
import {DrawerActions} from "react-navigation-drawer";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modalbox from 'react-native-modalbox';



export default class MonCompte extends Component {
    constructor(props){
        super(props);
        this.state = {
            token:'',
            destination: '',
            dateAller: '',
            dateRetour: '',
            libelle: '',
            montant: '',
            transport:'',
            divers:'',
            alimentation:'',
            deplacement:'',
            hebergement:'',
            loading: true,
            error: '',
            nbrVoyageurs:'',
            devise:'',
            email:'',
            password:'',
            password2:''
        };

        this.getEmail();
        this.getToken() ;
        this.changerMotdepasse = this.changerMotdepasse.bind(this);
       console.log(this.state.email+'/////////////')
      
        //this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }
getEmail = async() =>{
    let email = await AsyncStorage.getItem('email');
    console.log(email);
    this.setState({email:email});
}
    getToken = async()=> {
       const userToken = await AsyncStorage.getItem('id_token');
        console.log("#######################################" +userToken)
        this.setState({ token: userToken });
        if (this.state.token != null) {

        }
        else { Alert.alert('Vous devez être connecté pour effectuer cette opération'); this.props.navigation.navigate('SignIn') }

        console.log(this.state.token + '////');
    }
    GetSectionListItem=(item)=>{
        Alert.alert(item)
    }
    changerMotdepasse() {

        console.log("test");
        var url = Config.SERVER_URL + '/api/changepwd';
       
        if (this.state.password != '' || this.state.password2 != ''){
                if (this.state.password != '') {
                    if (this.state.password2 != '') {
                axios.post(url, {
                    email: this.state.email,
                    password: this.state.password,
                    newpwd:this.state.password2
                })
                    .then(response => {
                        console.log("reeeeeeeeeeespo" + response.data);
                        if (response.status == "200") {
                            Alert.alert("Votre mot de passe a été modifié.")
                            this.setState({password:''}),
                                this.setState({ password2: '' }),
                            this.props.navigation.navigate('Home');
                        }
                       
                        else {
                            Alert.alert("Votre mot de passe n'a pas été modifié, veuillez réessayer")
                        }

                    })
                    .catch((error) => {
                        console.log("teeest");
                        console.log(error);
                    });
            }
            else Alert.alert("Veillez remplir le champs du nouveau mot de passe.")
                }
                else Alert.alert("Veillez remplir le champs de l'ancien mot de passe.")
        }
        else Alert.alert("Veillez remplir les champs de mot de passe.")
        }
       
    
    createVoyage() {
        if(this.state.transport == undefined || this.state.transport =="") this.state.transport=0;
        if(this.state.hebergement == undefined || this.state.hebergement =="") this.state.hebergement=0;
        if(this.state.deplacement == undefined || this.state.deplacement=="") this.state.deplacement=0;
        if(this.state.alimentation == undefined || this.state.alimentation =="") this.state.alimentation=0;
        if(this.state.divers == undefined || this.state.divers =="") this.state.divers=0;
        if (this.state.nbrVoyageurs == undefined || this.state.nbrVoyageurs == "") this.state.nbrVoyageurs = 1;
        if (this.state.devise == undefined || this.state.devise == "") this.state.devise = "EUR";



        this.state.data = {

            destination: this.state.destination,
            dateAller: this.state.dateAller,
            dateRetour: this.state.dateRetour,
            devise:this.state.devise,
            nbrVoyageurs:this.state.nbrVoyageurs,
            depenses: [
                {
                    libelle: "Transport",
                    montant: this.state.transport,
                    isDepense: "0",
                    id_categorie: "1"
                },
                {
                    libelle: "Hebergement",
                    montant: this.state.hebergement,
                    isDepense: "0",
                    id_categorie: "5"
                },
                {
                    libelle: "Deplacement",
                    montant: this.state.deplacement,
                    isDepense: "0",
                    id_categorie: "2"
                },
                {
                    libelle: "Alimentation",
                    montant: this.state.alimentation,
                    isDepense: "0",
                    id_categorie: "4"
                },
                {
                    libelle: "Divers",
                    montant: this.state.divers,
                    isDepense: "0",
                    id_categorie: "3"
                },
            ]
        }
        console.log(this.state.data)
        if (this.state.data.destination != "" && this.state.data.dateAller != "" && this.state.data.dateRetour!=""&& this.state.data.devise!=""){
        const headers = {
            'Authorization': 'Bearer ' + this.state.token
        };
        console.log("tokennnn" + this.state.token);
        var date = new Date();

        axios.post(Config.SERVER_URL+'/api/voyages', this.state.data
            , {
                headers: headers,
            }).then((response) => {
                console.log("***********data" + response.data);
            console.log("***********status" + response.status);
            

            if(response.data =="Voyage créer avec succés") {
               // this.GetSectionListItem(response.data);
                this.clearText();
                this.props.navigation.navigate('Sej');
            }
            else if (response.data =="impossible d'ajouter un voygae avec date aller ou date de retour null"){
                this.GetSectionListItem(response.data);
            }
            else if (response.data =="date d'aller ne peut pas être supérieur à la date de retour"){
                this.GetSectionListItem(response.data);
            }
            else if (response.data =="ERR : la date  est inclus dans un autre voyage"){
                this.GetSectionListItem(response.data);
            }
            else if (response.data =="Date aller inférieur à la date d'aujourd'hui"){
                this.GetSectionListItem(response.data);
            }
            else {
                this.GetSectionListItem("Le voyage n'a pas été crée veuillez reessayer");
            }

        }).catch((error) => {
            console.log("erroooor" + error)
            this.setState({
                error: 'Error retrieving data',
                loading: false
            });
            
        });
        }
        else {
           this.GetSectionListItem("Veillez remplir tout les champs");}
    }
    clearText(){
  this.setState({
      destination:'',
      dateAller:'',
        dateRetour:'',
        transport:'',
        hebergement:'',
        deplacement:'',
        alimentation:'',
        divers:''
  })


    }
    render() {
        const {transport,email,password,password2, destination,hebergement, alimentation, divers, deplacement, dateAller, dateRetour, libelle,montant , error , loading} = this.state;
        const { form, section, errorTextStyle } = styles;

        return (
           
  <View style={styles.cantainer}>
               
                    <View style={styles.header2}>
                        <Image source={require('../img/Moncompte.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage}  />
                        <View style={styles.leftv}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ password: '' });
                            this.setState({ password2: '' });this.props.navigation.goBack(null)}}>
                            <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                        </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.bodyfrom}>
                            
                        <View style={styles.sectionDestination}>
                        
                                <Text style={styles.styleText}>Changer mot de passe</Text>
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
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <View style={styles.labNdIcon2}>
                                <Image source={require('../img/cadna.png')} style={{ height: 30, width: 30, marginRight: 5, }} />
                                <Text style={styles.labelStyle}>Ancien mot de passe</Text>
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
                        <View style={styles.inputView}>
                            <View style={styles.labNdIcon2}>
                                <Image source={require('../img/cadna.png')} style={{ height: 30, width: 30, marginRight: 5, }} />
                                <Text style={styles.labelStyle}>Nouveau mot de passe</Text>
                            </View>
                            <TextInput
                                value={this.state.hebergement}
                                style={styles.inputStyle}
                                secureTextEntry={true}
                                placeholder=" "
                                value={password2}
                                onChangeText={password2 => this.setState({ password2 })}

                            />
                        </View>
                        </View>
                        </View>
                    <View style={styles.footer}>
                        <View style={styles.footerMenu}>
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                <Image source={require('../img/menu.png')} style={{ height: 40, width: 40, }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerPlus}>
                            <TouchableOpacity onPress={this.changerMotdepasse}>
                                <Image source={require('../img/valider.png')} style={{ height: 40, width: 40, }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerFois}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ password: '' });
                            this.setState({ password2: '' });this.props.navigation.navigate('Home')}}>
                                <Image source={require('../img/croix.png')} style={{ height: 40, width: 40, }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>

                );
    }
}

const styles = {
    

    section1: {
    alignSelf: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    flexDirection: 'row',
    borderWidth: 0.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
    borderColor: "#772f7b",
    height: 40,
    width: 83,
    marginTop: 20,
    padding: 0,
    marginBottom: 10,
},
    section2: {
        alignSelf: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5,
        borderColor: "#772f7b",
        height: 40,
        width: '60%',
        marginTop: 20,
        padding: 0,
        marginBottom: 10,
    },
    item:{
        width: 150,
    },
    pickerView:{
        borderBottomWidth: 1,
        borderColor: '#772f7b',
        color: '#772f7b',
        alignSelf:'center',
        width: 80,
        height: 40,
        marginBottom:10,
        
    },
    piker:{ 
        marginBottom:10,
        width:80,
        height:40,
        color: '#772f7b',
        
    },
    pickerView2: {
        borderBottomWidth: 1,
        borderColor: '#772f7b',
        color: '#772f7b',
        alignSelf: 'center',
        width: '60%',
        height: 40,
        marginBottom: 10,

    },
    piker2: {
        marginBottom: 10,
        width: 80,
        height: 40,
        pickerStyleType: '',
        color: '#772f7b',

    },
    rightv: {
        width: "30%",
    },
    leftv: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },
    cantainer: {
        flex: 1,
        backgroundColor:'rgb(255,255,255)'
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
        flex:2,
        marginTop: '2%',
        marginBottom: '5%',
        fontSize: 30,
        fontWeight: 'normal',
        color: '#772f7b',
        alignSelf: 'center',
        fontFamily: 'bradhitc',
        
    },
    styleText2: {
        flex: 2,
        fontSize: 30,
        fontWeight: 'normal',
        color: '#772f7b',
        alignSelf: 'center',
        fontFamily: 'bradhitc',
        marginBottom:-10
    },
    labNdIcon:{
        position: 'absolute',
        top: -10,
        flexDirection:'row',
        alignItems:'center'
    },
    labNdIcon2: {
        position: 'absolute',
        top: -5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    labNdIconDate:{
        position: 'absolute',
        top: -10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:5
    },
    buttonbackgroundImage:{
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
    },
    bodyfrom: {
       justifyContent:'center',
        height : '90%',
        paddingBottom:10,
    },
    form: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ddd',
    }, 
    PickerStyleClass: {
        zIndex: 10,
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0)',
        height: '90%',
        color: "#772f7b",
        borderRadius: 10,

    },
    PickerStyleClass2: {
        zIndex: 10,
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0)',
        height: '90%',
        color: "#f56d61",
        borderRadius: 10,

    },
    sectionDestination:{
        position:'relative',
        borderWidth:1,
        borderColor:'rgb(206,177,206)',
        borderRadius: 5, 
        marginLeft: '5%',
        marginRight: '5%',
        height:300
       
        

    },
    section: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderColor: '#000',
        marginLeft: '5%',
        marginRight: '5%',
        height: 32,
        marginTop: 4,
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
    labelStyle: {
       
        color: '#f56d61',
        fontSize: 15,
        fontWeight: 'normal',
        marginLeft: '3%',
        height:18,
    },
    labelStyleDate:{
        color: '#f56d61',
        fontSize: 15,
        fontWeight: 'normal',
        marginLeft: '3%',
        height: 18,
        marginTop:10
    },
    inputStyle: {
        color: '#772f7b',
        fontSize: 15,
        paddingBottom: -4,
        textAlign: 'right',
        height:30,
       marginTop:5,
        
        borderBottomWidth: 0.5,
        borderColor: 'rgb(120,43,120)'
    },
    inputView: {
        position:'relative',
        flex:1,
        marginRight: '3%',
        marginLeft: '5%',
        marginBottom:10,
        
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
    agenda: {
        margin : 0,
        marginLeft: 4,
        paddingTop: 2,
        color: "#b4b4b4"
    },
    datepickerView: {
        flex: 1,
        width: '100%',
        marginLeft: '5%',
        height: '100%',
        borderBottomWidth: 0.5,
        borderColor: 'rgb(120,43,120)',
        
        height: 30,

    },
    datepickerView2: {
        flex: 1,
        width: '100%',
        marginLeft: '5%',
        marginRight: '5%',
        height: '100%',
        borderBottomWidth: 0.5,
        borderColor: 'rgb(120,43,120)',
        color: 'green',

        height: 30,

    },
    errorTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
    },
    

    buttonSection:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '5%',
        marginRight: '5%',
        height: 30,
        marginTop: 20
    },

    button: {
        flex: 0.4,
        alignItems: 'center',
        backgroundColor: '#782b79',
        borderColor: '#000000',
        borderRadius:5,
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
        marginLeft: 10
    },
    dates:{
        flexDirection:'row',
        marginTop:10,
        alignItems:'flex-end',
        justifyContent: 'space-between',
    },
    dateText:{
        color: '#f56d61',
        fontSize: 15,
        marginBottom:-5
    }
};


