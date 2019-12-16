import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    Alert,
    AsyncStorage,
    TouchableOpacity,
    ActivityIndicator,
    
} from "react-native";
import axios from "axios";
import Config from "../services/config";
import { Image} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import {DrawerActions} from "react-navigation-drawer";
import Moment from 'moment';
import 'moment/locale/fr';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class ReleveDepense extends Component {
    totalDepense = 0;
    totalPrevus = 0;
    constructor(props) {
        super(props);
        this.state = {

            token: '',
            id:'',
            voyage: {
                destination: '',
                dateAller: '',
                dateRetour: '',
                devise:''
            },
            tableau:[],
        };
        Moment.locale('fr');

        this.props.navigation.addListener('willFocus', () => {
            const { navigation } = this.props;
            this.state.id = navigation.getParam('itemId', '136');
            this.state.voyage = navigation.getParam('item', null);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$"),
                this.setState( {voyage: navigation.getParam('item', null)})
            console.log(JSON.stringify(this.state.voyage)+'hana hana hana hana hana hana haa ahana hana ahana ahaana ');
            this.fetchSejour();

            //this.getblogs(id);
        })



        //this.createVoyage = this.createVoyage.bind(this);
        //this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }
 


    /* Function display user data, when user click on sectionlist items */

    euroNdDollarConvert(devise) {
        if (devise == "EUR") return "€";
        else if (devise == "GBP") return "£";
        else if (devise == "USD") return "$";
        else return devise;
    }
    fetchSejour(){

        var url = Config.SERVER_URL+'/api/prevus/'+this.state.id;
        var url2 = Config.SERVER_URL+'/api/voyage/depenses/'+this.state.id;
        var url3 = Config.SERVER_URL+'/api/voyage/getReleveVoyage1/'+this.state.id;
        Promise.all([
            axios.get(url),
            axios.get(url2),
            axios.get(url3)
        ])
        // use arrow function to avoid loosing context
        // BTW you don't need to use axios.spread with ES2015 destructuring
            .then(([prevusResponse, depensesResponse, releveVoyage]) => {



                console.log("releveVoyageµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ£££££££££££££££££££££££££££££££££");
                console.log(releveVoyage);
                this.setState( {reponse: [] , depenseTransport: [],tableau:[], depenseHebergement: [],
                    depenseDeplacement: [], depenseAlimentation: [], depenseDivers: []})
                prevusResponse.data.forEach((element) => {
                    var depense =  depensesResponse.data.filter(element1 => element1.nomCat === element.nomCat)
                    if( depense.length > 0) {
                        this.state.reponse.push(
                            {
                                "categorie": element.nomCat,
                                "prevus": element.depense,
                                "depense": depense[0].depense,
                                "sousdepense": []
                            })
                    } else {
                        this.state.reponse.push(
                            {
                                "categorie": element.nomCat,
                                "prevus": element.depense,
                                "depense": "0",
                                "sousdepense": []

                            })
                    }
                })
                this.state.tableau.push(this.state.reponse[4]);
                this.state.tableau.push(this.state.reponse[3]);
                this.state.tableau.push(this.state.reponse[1]);
                this.state.tableau.push(this.state.reponse[0]);
                this.state.tableau.push(this.state.reponse[2]);
                this.state.depenseTransport = releveVoyage.data.filter(releve => releve.nomCat === 'Transport');
                this.state.depenseHebergement = releveVoyage.data.filter(releve => releve.nomCat === 'Hebergement');
                this.state.depenseDeplacement = releveVoyage.data.filter(releve => releve.nomCat === 'Deplacement');
                this.state.depenseAlimentation = releveVoyage.data.filter(releve => releve.nomCat === 'Alimentation');
                this.state.depenseDivers = releveVoyage.data.filter(releve => releve.nomCat === 'Divers');
                this.state.tableau.forEach(tableau =>{
                    if(tableau.categorie === "Transport") {
                        tableau.sousdepense = this.state.depenseTransport;
                    } else
                    if(tableau.categorie === "Hebergement") {
                        tableau.sousdepense = this.state.depenseHebergement;

                    } else
                    if(tableau.categorie === "Deplacement") {
                        tableau.sousdepense = this.state.depenseDeplacement;

                    } else
                    if(tableau.categorie === "Alimentation") {
                        tableau.sousdepense = this.state.depenseAlimentation;

                    } else
                    if(tableau.categorie === "Divers") {
                        tableau.sousdepense = this.state.depenseDivers;

                    }
                })
                console.log("this.state.reponse");
                console.log(this.state.prevus);
            }).catch(err => {
            console.log("this.state.reponseERRRRRRRRRRrrrrrrrrrrrrrrrrrrrrrrr");
            console.log(err);
        });

    }



findIcon(index){
    if(index==0){
        return require('../img/transport.png');
    }
    if(index==1){
        return require('../img/hebergement.png');
    }
    if(index==2){
        return require('../img/deplacement.png');
    }
    if (index ==3) {
        return require('../img/alimentation.png');
    }
    if (index ==4) {
        return require( '../img/loisir.png');
    }
}


    render() {
        
        const {reponse, voyage , tableau} = this.state;
        console.log(tableau);
        if (!this.state.reponse) {
            return (
                
                <View style={styles.cantainer} >
                    
                        <View style={styles.header2}>
                            <Image source={require('../img/Releve_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage}  />
                            <View style={styles.leftv}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                    <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    <View style={styles.sectionDestination}>

                        <Text style={styles.destination}>{voyage.destination}</Text>

                        <View style={styles.fromTo} >
                            <View style={styles.text1}>
                                <Text style={styles.day}>{Moment(voyage.dateAller).format('D')}</Text>
                                <Text style={styles.mounth}>{Moment(voyage.dateAller).format('MMM')}</Text>
                                <Text style={styles.year}>{Moment(voyage.dateAller).format('YYYY')}</Text>
                            </View>
                            <View style={styles.FlecheImage}>
                                <Image source={require('../img/fleche.png')} resizeMode={'stretch'} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={styles.text2}>
                                <Text style={styles.day}>{Moment(voyage.dateRetour).format('D')}</Text>
                                <Text style={styles.mounth}>{Moment(voyage.dateRetour).format('MMM')}</Text>
                                <Text style={styles.year}>{Moment(voyage.dateRetour).format('YYYY')}</Text>

                            </View>

                        </View>
                    </View>
                        <View style={styles.releveForm}>
                            <View style={styles.headerFlat}>
                                <View style={styles.prevNdDep}>
                                <Text style={{color: "#FFF",width:'20%',textAlign:"center"}}> Prévu</Text>
                                <Text style={{ color: "#FFF", width: '20%', textAlign: "center"}}> Dépensé</Text>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 0.9}}>
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/transport.png')} style={{ height: 25, width: 25, marginLeft: 5}} />
                                    <Text style={styles.labelStyle}>Transport</Text>
                                   
                                </View>
                                    <ActivityIndicator
                                        animating={true}
                                        style={styles.indicator}
                                        size="large"
                                    />
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/hebergement.png')} style={{ height: 25, width: 25, marginLeft: 5 }} />
                                    <Text style={styles.labelStyle}>Hebergement</Text>
                                    
                                </View>
                                <ActivityIndicator
                                    animating={true}
                                    style={styles.indicator}
                                    size="large"
                                />
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/deplacement.png')} style={{ height: 25, width: 25, marginLeft: 5 }} />
                                    <Text style={styles.labelStyle}>Deplacement</Text>
                                    
                                </View>
                                <ActivityIndicator
                                    animating={true}
                                    style={styles.indicator}
                                    size="large"
                                />
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/alimentation.png')} style={{ height: 25, width: 25, marginLeft: 5 }} />
                                    <Text style={styles.labelStyle}>Alimentation</Text>
                                    
                                </View>
                                <ActivityIndicator
                                    animating={true}
                                    style={styles.indicator}
                                    size="large"
                                />
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/loisir.png')} style={{ height: 25, width: 25, marginLeft: 5 }} />
                                    <Text style={styles.labelStyle}>Loisir</Text>
                                   
                                </View>
                                <ActivityIndicator
                                    animating={true}
                                    style={styles.indicator}
                                    size="large"
                                />
                               


                                </View>

                            </View>

                        </View>

                    <View style={styles.footerFlat}></View>
                    <View style={styles.viewFooter}>
                        <View style={styles.footer}>
                            <View style={styles.footerMenu}>
                                <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                    <Image source={require('../img/menu.png')} style={{ height: 40, width: 40 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footerPlus}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Vo')}>
                                    <Image source={require('../img/plus.png')} style={{ height: 40, width: 40 }} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footerFois}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                                    <Image source={require('../img/croix.png')} style={{ height: 40, width: 40 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                
            )
        };

        return (
            
            <View style={styles.cantainer} >
                
                    
                    <View style={styles.header2}>
                        <Image source={require('../img/Releve_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage}  />
                    <View style={styles.leftv}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                        </TouchableOpacity>
                    </View>
                    </View>
                <View style={styles.sectionDestination}>

                    <Text style={styles.destination}>{voyage.destination}</Text>

                    <View style={styles.fromTo} >
                        <View style={styles.text1}>
                            <Text style={styles.day}>{Moment(voyage.dateAller).format('D')}</Text>
                            <Text style={styles.mounth}>{Moment(voyage.dateAller).format('MMM')}</Text>
                            <Text style={styles.year}>{Moment(voyage.dateAller).format('YYYY')}</Text>
                        </View>
                        <View style={styles.FlecheImage}>
                            <Image source={require('../img/fleche.png')} resizeMode={'stretch'} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View style={styles.text2}>
                            <Text style={styles.day}>{Moment(voyage.dateRetour).format('D')}</Text>
                            <Text style={styles.mounth}>{Moment(voyage.dateRetour).format('MMM')}</Text>
                            <Text style={styles.year}>{Moment(voyage.dateRetour).format('YYYY')}</Text>

                        </View>

                    </View> 
                </View>
                    <View style={styles.releveForm}>
                    <View style={styles.headerFlat}>
                        <View style={styles.prevNdDep}>
                            <Text style={{ color: "#FFF", width: '20%', textAlign: "center" }}> Prévu</Text>
                            <Text style={{ color: "#FFF", width: '20%', textAlign: "center" }}> Dépensé</Text>
                        </View>
                    </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                
                                data={tableau}
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <View>
                                    <View style={styles.labNdIcon2}>
                                        <View style={{flexDirection:'row',flex:3}}>
                                        <Image source={this.findIcon(index)} style={{ height: 25, width: 25, marginLeft: 5 }} />
                                        <Text style={styles.labelStyle}>{item.categorie}</Text>
                                            </View>
                                            <View style={styles.prevNdDep}>
                                                <Text style={styles.labelStyle2}> {parseFloat(Math.round(item.prevus * 100) / 100).toFixed(2)}</Text>
                                                <Text style={styles.labelStyle2}> {parseFloat(Math.round(item.depense * 100) / 100).toFixed(2)}</Text>
                                            </View>
                                    </View>
                                       
                                    <FlatList
                                        data={item.sousdepense}
                                        scrollEnabled={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item2, index }) =>
                                            <View>
                                                <View style={styles.coreFlat2}>
                                                    <View style={{flex:1.5}}>
                                                        <Text style={{ color: "#772f7b",fontSize:13 ,width:'100%',textAlign:"center"}}>{item.sousdepense[index].date}</Text>
                                                    </View>
                                                    <View style={ {flex: 2.5 }}>
                                                        <Text style={{ color: "#772f7b", fontSize: 13, width: '100%', }}>{item.sousdepense[index].libelle}</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: "#772f7b", fontSize: 13, width: '100%', textAlign: "center" }}>{parseFloat(Math.round(item.sousdepense[index].montant * 100) / 100).toFixed(2)}</Text>
                                                    </View>
                                                    
                                                </View>
 
                                            </View>
 
                                        }
                                        keyExtractor={item => item.idVoyage}
                                    />
                                        
                                    </View>
                                }
                            />
                            </View>
                    </View>
                        <View style={styles.footerFlat}>
                    <View style={styles.prevNdDep}>
                        <View style={{ flex: 1, justifyContent: "center" }}><View style={styles.headerFlat3}>
                            <Text style={{ color: "#FFF", textAlign: "center",fontSize:15,fontWeight:"bold"}}>Prévu</Text></View>
                            <View style={styles.headerFlat5}>
                            <Text style={styles.labelStyle4}>{!voyage.budget ? parseFloat(Math.round(voyage.prevus * 100) / 100).toFixed(2) : parseFloat(Math.round(voyage.budget * 100) / 100).toFixed(2) + " "} {this.euroNdDollarConvert(voyage.devise)}</Text>
                            </View>
                            </View>
                        <View style={{ flex: 1, justifyContent: "center" }}><View style={styles.headerFlat2}>
                            <Text style={{ color: "#FFF", textAlign: "center", fontSize: 15, fontWeight: "bold"}}>Dépensé</Text></View>
                            <View style={styles.headerFlat4}>
                            <Text style={styles.labelStyle4}>{parseFloat(Math.round(voyage.depense * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(voyage.devise)}</Text>
                            </View>
                            </View>
                            </View>
                        </View>
                    
                    <View style={styles.viewFooter}>
                <View style={styles.footer}>
                    <View style={styles.footerMenu}>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                            <Image source={require('../img/menu.png')} style={{ height: 40, width: 40 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footerPlus}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Vo')}>
                            <Image source={require('../img/plus.png')} style={{ height: 40, width: 40 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerFois}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                            <Image source={require('../img/croix.png')} style={{ height: 40, width: 40 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
                </View>
            
           
        );
    }
}

const styles = {
    
    labelStyle: {
        paddingTop:5,
        fontSize: 13,
        fontFamily: 'bradhitc',
        color: '#772f7b',
        height: '100%',
        padding: 2,
        fontWeight: 'bold',
       
    },
    labelStyle2: {
        paddingTop: 5,
        fontSize: 15,
        fontFamily: 'bradhitc',
        color: '#772f7b',
        height: '100%',
        padding: 2,
        fontWeight: 'bold',
        flex:1,
        textAlign: "center",
    },
    labelStyle3: {
       
        paddingTop: 5,
        fontSize: 15,
        fontFamily: 'bradhitc',
        color: '#FF5F44',
        height: '100%',
        padding: 2,
        fontWeight: 'bold',
        flex: 1,
        textAlign: "center",
    },
    labelStyle4: {
        paddingTop: 5,
        fontSize: 17,
        fontFamily: 'bradhitc',
        color: '#FF5F44',
        height: '100%',
        padding: 2,
        fontWeight: 'bold',
       
        textAlign: "center",
    },
    labNdIcon2: {
        marginBottom: 5,
        flexDirection: 'row',
         backgroundColor: "rgb(255,242,240)",
        width: "100%",
        height: 25,
    },
    text1: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#772f7b',
        borderRadius: 50,
        height: 70,
        width: 70,
        bottom: 0,
        marginBottom: 15,
        marginLeft: 15,
    },
    text2: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#772f7b',
        borderRadius: 50,
        height: 70,
        width: 70,
        bottom: 0,
        right: 15,
        marginBottom: 15,

    },
    fromTo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: '1%',
        width: '100%',
    },
    FlecheImage: {
        marginTop: -20,
        marginBottom: 20,
        alignItems: 'center',
        width: '55%',
        height: 100,
        marginLeft: -15,
    },
    day: {
        color: 'rgb(255,111,97)',
        fontFamily: 'bradhitc',
        fontSize: 23
    },
    mounth: {
        color: 'rgb(255,111,97)',
        fontSize: 10,
        fontWeight: 'bold'
    },
    year: {
        color: 'rgb(255,111,97)',
        fontSize: 10,
        fontWeight: 'bold'
    },
    destination: {
        marginTop: 5,
        marginBottom: -3,
        fontSize: 40,
        fontFamily: 'bradhitc',
        textAlign: 'center',
        color: '#772f7b',
    },
    sectionDestination: {
        position: 'relative',

        borderRadius: 3,
        marginLeft: '7%',
        marginRight: '7%',
        flex: 2.5,
        marginTop: 10,
        padding: 0,


    },
    leftv: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },
    rightv: {
        width: "30%",
    },
    indicator: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    
    cantainer: {
        flex: 1,
        height:'100%',
        position:'relative',
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
    releveForm: {
        flex:5.5,
        marginLeft: '7%',
        marginRight: '7%',
        marginTop: 10,
    },
    prevNdDep:{
        flex:2,
        flexDirection:'row',
        justifyContent: 'flex-end',
    },
    prevNdDep2: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerFlat: { 
        flex:1,
        height: 25,
        marginLeft: '7%',
        marginRight: '7%',
        flexDirection: 'row',
    },
    headerFlat: {
        height: 25,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "rgb(255,111,97)",
        flexDirection: 'row',

        width: "100%"
    }, headerFlat2: {
        height: 25,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "rgb(255,111,97)",
        flexDirection: 'row',
        marginLeft:5,
        width: "100%",
        justifyContent:'center'
    },
    headerFlat4: {
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row',
        marginLeft: 5,
        width: "100%",
        justifyContent: 'center'
    },
    headerFlat5: {
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row', 
        marginRight: 5,
        width: "100%",
        justifyContent: 'center'
    },
     headerFlat3: {
        height: 25,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "rgb(255,111,97)",
        flexDirection: 'row',
        marginRight:5,
        width: "100%",
         justifyContent: 'center'
    },
    coreFlat1: {
        marginTop: 3,
        height:25,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        backgroundColor: "#fdf1f0",
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%"
    },coreFlat2: {
        height: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%"
    },
    textAcceuil: {
        fontFamily: 'Verdana',
        fontSize: 20,
        color: '#772f7b',
    },
    viewFooter:{
        flex:1,
        justifyContent:'flex-end',
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 2,
        borderColor: 'rgba(120,43,120,0.8)',
        height: 45,
        maxHeight: 45,
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




};




