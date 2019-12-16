import React, { Component, Fragment } from 'react';
import { View, Text, AsyncStorage, Alert, TouchableOpacity, TextInput, ImageBackground,Picker} from 'react-native';
import { Input, TextLink, Loading, Button } from './common';
import axios from 'axios';
import {Header, Image} from "react-native-elements";
import Config from "../services/config";
import {DrawerActions} from "react-navigation";
import DatePicker from 'react-native-datepicker'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ModifierBudget extends Component {
    constructor(props ){
        super(props);

        this.state = {
            token:'',
            destination: '',
            dateAller: '',
            dateRetour: '',
            libelle: '',
            montant: '',
            transport:'',
            transpL:'',
            divers:'',
            diversL:'',
            alimentation:'',
            alimentationL:'',
            deplacement:'',
            deplacementL:'',
            hebergement:'',
            hebergementL:'',
            loading: true,
            error: '',
            id: '',
            vo:[],
            nbrVoyageurs:'',
            devise:''

        };


        this.getToken() ;
        this.updateVoyage = this.updateVoyage.bind(this);

        this.props.navigation.addListener('willFocus', () => {
            const { navigation } = this.props;

            this.state.voyage = navigation.getParam('objectVoyage');
            console.log("//////////////////////////" + JSON.stringify(this.state.voyage));
            this.state.destination = this.state.voyage.destination;
            this.state.dateAller = this.state.voyage.dateAller;
            this.state.dateRetour = this.state.voyage.dateRetour;
            this.state.devise = this.state.voyage.devise.replace(' ', '');;
            this.state.nbrVoyageurs=this.state.voyage.nbrVoyageurs+'';
            this.fetchSejour();

        })



        //this.onRegistrationFail = this.onRegistrationFail.bind(this);



    }
   fetchSejour(){

        var url = Config.SERVER_URL+'/api/prevus/'+this.state.voyage.idVoyage;
      console.log("**********state ID " + this.state.voyage.idVoyage);
        axios.get(url
        ).then((prevusResponse) => {

                this.setState( {reponse: [] })
                prevusResponse.data.forEach((element, index) => {



                    var depense =  prevusResponse.data.filter(element1 => element1.nomCat === element.nomCat)

                    if( depense.length > 0) {

                        this.state.reponse.push(
                            {
                                "categorie": element.nomCat,
                                "prevus": element.depense,

                            })

                    }

                })
            for (var i=0 ; i<this.state.reponse.length ; i++){

                this.setState({

                    alimentation: this.state.reponse[0].prevus.toString(),
                    alimentationL:this.state.reponse[0].categorie,
                        deplacement: this.state.reponse[1].prevus.toString(),
                        deplacementL: this.state.reponse[1].categorie,
                        divers: this.state.reponse[2].prevus.toString(),
                        diversL: this.state.reponse[2].categorie,
                        hebergement: this.state.reponse[3].prevus.toString(),
                        hebergementL: this.state.reponse[3].categorie,
                       transport: this.state.reponse[4].prevus.toString(),
                        transpL:this.state.reponse[4].categorie,

            }
                )


            }


            });
    }

    componentDidMount() {




    }

    getToken = async()=> {
        
       const userToken = await AsyncStorage.getItem('id_token');
        console.log(await AsyncStorage)
        this.state.token=userToken; 
    }
    GetSectionListItem=(item)=>{
        Alert.alert(item)
    }


    updateVoyage(){

      /*  this.state.vo = {

            destination: this.state.destination,
            dateAller: this.state.dateAller,
            dateRetour: this.state.dateRetour,
            depenses: [
                {

                    montant: this.state.transport,

                },
                {

                    montant: this.state.hebergement,

                },
                {

                    montant: this.state.deplacement,

                },
                {

                    montant: this.state.alimentation,

                },
                {

                    montant: this.state.hebergement,

                },


            ]

        }
        var libs = [this.state.transpL,this.state.hebergementL,this.state.deplacementL,this.state.alimentationL,this.state.hebergementL];
        for(var i=0 ; i<libs.length ; i++) {
            var url = Config.SERVER_URL + '/api/voyages/' + this.state.voyage.idVoyage + '/' + libs[i];

            axios.put(url, this.state.vo
            ).then((response) => {


            }).catch((error) => {
                console.log("erroooor" + error)
                this.setState({
                    error: 'Error retrieving data',
                    loading: false
                });
            });


        }*/
      if(this.state.transport == undefined || this.state.transport =="") this.state.transport=0;
        if(this.state.hebergement == undefined || this.state.hebergement =="") this.state.hebergement=0;
        if(this.state.deplacement == undefined || this.state.deplacement=="") this.state.deplacement=0;
        if(this.state.alimentation == undefined || this.state.alimentation =="") this.state.alimentation=0;
        if (this.state.divers == undefined || this.state.divers == "") this.state.divers=0;
        if (this.state.nbrVoyageurs == undefined || this.state.nbrVoyageurs == "") this.state.nbrVoyageurs = 1;
        var url1 = Config.SERVER_URL+'/api/depenses/'+this.state.voyage.idVoyage+'/'+this.state.transpL;
        axios.put(url1, {montant:this.state.transport}).catch(err=> {
            console.log(err)
        });
        url1 = Config.SERVER_URL+'/api/depenses/'+this.state.voyage.idVoyage+'/'+this.state.hebergementL;
        axios.put(url1, {montant:this.state.hebergement});
         url1 = Config.SERVER_URL+'/api/depenses/'+this.state.voyage.idVoyage+'/'+this.state.deplacementL;
        axios.put(url1, {montant:this.state.deplacement});
         url1 = Config.SERVER_URL+'/api/depenses/'+this.state.voyage.idVoyage+'/'+this.state.alimentationL;
        axios.put(url1, {montant:this.state.alimentation});
        var url2 = Config.SERVER_URL+'/api/depenses/'+this.state.voyage.idVoyage+'/'+this.state.diversL;
        axios.put(url2, {montant:this.state.divers});
        console.log('token:'+ this.state.token);
        const headers = {
            'Authorization': 'Bearer ' + this.state.token
        };
        this.state.data = {

            destination: this.state.destination,
            dateAller: this.state.dateAller,
            dateRetour: this.state.dateRetour,
            nbrVoyageurs:this.state.nbrVoyageurs,
            devise:this.state.devise,
        }
        var url = Config.SERVER_URL+'/api/voyages/'+this.state.voyage.idVoyage;
        console.log(url);
        console.log("*********this.state.data" + JSON.stringify(this.state.data));

        axios.put(url, this.state.data
            , {
                headers: headers,
            }).then((response) => {
                console.log("***********data" + response.data);
                console.log("***********status" + response.status);
            if(response.data =="Voyage créer avec succés" || response.status==200) {
                this.GetSectionListItem("Le séjour a été modifié" );
                this.props.navigation.navigate('Home');
            }
            else if (response.data =="impossible d'ajouter un voygae avec date aller ou date de retour null"){
                this.GetSectionListItem(response.data);
            }
            else if (response.data =="date d'aller ne peut pas être supérieur à la date de retour"){
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
    render() {
        const { transport, destination, hebergement, alimentation, divers, deplacement, dateAller, dateRetour, libelle, montant, error, loading } = this.state;
        const { form, section, errorTextStyle } = styles;

        return (
                <View style={styles.cantainer}>

                    <View style={styles.header2}>
                        <Image source={require('../img/controler_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <KeyboardAwareScrollView>
                        <View style={styles.bodyfrom}>

                            <View style={styles.sectionDestination}>

                                <Text style={styles.styleText}>ou et quant?</Text>
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIcon}>
                                        <Image source={require('../img/position.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                        <Text style={styles.labelStyle}>DESTINATION</Text>
                                    </View>
                                    <TextInput
                                        value={destination}
                                        onChangeText={destination => this.setState({ destination })}
                                        value={this.state.destination}
                                        textContentType={'countryName'}
                                        style={styles.inputStyle}
                                        maxLength={32}
                                    />
                                </View>
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIconDate}>
                                        <Image source={require('../img/calendrier.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                        <Text style={styles.labelStyle}>DATES</Text>
                                    </View>
                                    <View style={styles.dates}>
                                        <Text style={styles.dateText}>du</Text>
                                        <DatePicker
                                            style={styles.datepickerView2}
                                            date={this.state.dateAller}
                                            mode="date"
                                            placeholder=' '
                                            format="YYYY-MM-DD"
                                            confirmBtnText="Confirm"
                                            showIcon={false}
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateInput: {
                                                    borderWidth: 0,
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-end',
                                                    paddingTop: 6,
                                                    marginRight: 6,
                                                    color: '#772f7b',
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}

                                            onDateChange={dateAller => this.setState({ dateAller })}

                                        />
                                        <Text style={styles.dateText}>a</Text>
                                        <DatePicker
                                            style={styles.datepickerView}
                                            date={this.state.dateRetour}
                                            mode="date"
                                            placeholder=' '
                                            format="YYYY-MM-DD"
                                            confirmBtnText="Confirm"
                                            showIcon={false}
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateInput: {
                                                    borderWidth: 0,
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-end',
                                                    paddingTop: 6,
                                                    marginRight: 6,
                                                    color: '#772f7b',
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            value={dateRetour}
                                            onDateChange={dateRetour => this.setState({ dateRetour })}
                                            value={this.state.dateRetour} />

                                    </View>

                                </View>
                            </View>
                            <View style={styles.sectionDestination}>

                                <Text style={styles.styleText2}>combien de voyageurs?</Text>
                                <View style={styles.section1}>
                                    <View style={styles.rightborder}>
                                        <Icon name="angle-down" type="FontAwesome" color="#772f7b" size={30} />
                                    </View>

                                    <Picker style={styles.PickerStyleClass}
                                        selectedValue={this.state.nbrVoyageurs}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ nbrVoyageurs: itemValue })
                                        } itemStyle={styles.item} prompt='Nombre de voyageurs'>
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" />
                                        <Picker.Item label="6" value="6" />
                                        <Picker.Item label="7" value="7" />
                                        <Picker.Item label="8" value="8" />
                                        <Picker.Item label="9" value="9" />
                                        <Picker.Item label="10" value="10" />
                                        <Picker.Item label="11" value="11" />
                                        <Picker.Item label="12" value="12" />
                                        <Picker.Item label="13" value="13" />
                                        <Picker.Item label="14" value="14" />
                                        <Picker.Item label="15" value="15" />
                                        <Picker.Item label="16" value="16" />
                                        <Picker.Item label="17" value="17" />
                                        <Picker.Item label="18" value="18" />
                                        <Picker.Item label="19" value="19" />
                                        <Picker.Item label="20" value="20" />
                                    </Picker>


                                </View> 
                            </View>
                            <View style={styles.sectionDestination}>

                                <Text style={styles.styleText2}>quel est le budget ?</Text>
                                 <View style={styles.section2}>
                                    <View style={styles.rightborder}>
                                        <Icon name="angle-down" type="FontAwesome" color="#772f7b" size={30} />
                                    </View>

                                    <Picker style={styles.PickerStyleClass2}
                                        selectedValue={this.state.devise}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ devise: itemValue })
                                        } prompt='Devise'>
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
                               
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIcon2}>
                                        <Image source={require('../img/transport.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                        <Text style={styles.labelStyle}>TRANSPORT</Text>
                                    </View>
                                    <TextInput
                                        placeholder=" "
                                        value={transport}
                                        onChangeText={transport => this.setState({ transport })}
                                        value={this.state.transport}
                                        style={styles.inputStyle}
                                        keyboardType={'numeric'}
                                        maxLength={7}
                                    />
                                </View>
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIcon2}>
                                        <Image source={require('../img/hebergement.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                    <Text style={styles.labelStyle}>HÉBERGEMENT</Text>
                                    </View>
                                    <TextInput
                                        placeholder=" "
                                        value={hebergement}
                                        onChangeText={hebergement => this.setState({ hebergement })}
                                        value={this.state.hebergement}
                                        style={styles.inputStyle}
                                        keyboardType={'numeric'}
                                        maxLength={7}
                                    />
                                </View>
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIcon2}>
                                        <Image source={require('../img/deplacement.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                    <Text style={styles.labelStyle}>DÉPLACEMENTS</Text>
                                    </View>
                                    <TextInput
                                        placeholder=" "
                                        onChangeText={deplacement => this.setState({ deplacement })}
                                        value={this.state.deplacement}
                                        style={styles.inputStyle}
                                        keyboardType={'numeric'}
                                        maxLength={7}
                                    />
                                </View>
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIcon2}>
                                        <Image source={require('../img/alimentation.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                        <Text style={styles.labelStyle}>ALIMENTATION</Text>
                                    </View>
                                    <TextInput
                                        placeholder=" "
                                        value={alimentation}
                                        onChangeText={alimentation => this.setState({ alimentation })}
                                        value={this.state.alimentation}
                                        style={styles.inputStyle}
                                        keyboardType={'numeric'}
                                        maxLength={7}
                                    />
                                </View>
                                <View style={styles.inputView}>
                                    <View style={styles.labNdIcon2}>
                                        <Image source={require('../img/loisir.png')} style={{ height: 30, width: 30,marginLeft:5 }} />
                                        <Text style={styles.labelStyle}>LOISIRS</Text>
                                    </View>
                                    <TextInput
                                        placeholder=" "
                                        value={divers}
                                        onChangeText={divers => this.setState({ divers })}
                                        value={this.state.divers}
                                        style={styles.inputStyle}
                                        keyboardType={'numeric'}
                                        maxLength={7}
                                    />
                                </View>
                            </View>
                        </View>


                    </KeyboardAwareScrollView>
                    <View style={styles.footer}>
                        <View style={styles.footerMenu}>
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                <Image source={require('../img/menu.png')} style={{ height: 40, width: 40, }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerPlus}>
                            <TouchableOpacity onPress={this.updateVoyage}>
                                <Image source={require('../img/valider.png')} style={{ height: 40, width: 40, }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerFois}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
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
        alignSelf:'center',
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5,
        borderColor: "#772f7b",
        height: 40,
        width:83,
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
    item: {
        width: 150,
        alignSelf:'center'
    },
    pickerView: {
        borderColor: '#772f7b',
        color: '#772f7b',
        alignSelf: 'center',
        width: 80,
        height: 40,
        marginBottom: 10,
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 5,

        marginTop: 10,
        padding: 0

    },
    piker: {
        marginBottom: 10,
        width: 80,
        height: 40,
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
    topHeader: {
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
    styleText: {
        flex: 2,
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
        marginBottom: -10
    },
    labNdIcon: {
        position: 'absolute',
        top: -10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    labNdIcon2: {
        position: 'absolute',
        top: -5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    labNdIconDate: {
        position: 'absolute',
        top: -10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    buttonbackgroundImage: {
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
    },
    bodyfrom: {

        height: '90%',
        paddingBottom:10
    },
    form: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    sectionDestination: {
        position: 'relative',
        borderRadius: 3,
        marginLeft: '5%',
        marginRight: '5%',
        flex: 1,
        marginTop: 10,
        padding: 0,

        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',

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
        height: 18,
    },
    labelStyleDate: {
        color: '#f56d61',
        fontSize: 15,
        fontWeight: 'normal',
        marginLeft: '3%',
        height: 18,
        marginTop: 10
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
    sectionDate: {
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
        margin: 0,
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


    buttonSection: {
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
        borderRadius: 5,
        marginLeft: "5%"
    },
    buttonAnnuler: {
        flex: 0.4,
        alignItems: 'center',
        backgroundColor: '#fffbff',
        borderColor: '#000000',
        borderRadius: 5,
        borderWidth: 0.5,
        marginRight: "5%"

    },
    styleText3: {
        fontSize: 17,
        color: '#ffffff',
    },
    styleText4: {
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
    dates: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    dateText: {
        color: '#f56d61',
        fontSize: 15,
        marginBottom: -5
    }
};

