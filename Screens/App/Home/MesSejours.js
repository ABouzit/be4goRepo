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
    ImageBackground
} from "react-native";
import axios from "axios";
import { Input } from "./common";
import Config from "../services/config";
import {  Image } from "react-native-elements";
import { DrawerActions } from "react-navigation-drawer";
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Row } from "native-base";
import moment from "moment";

export default class MesSejours extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '', 
            token: '',
            id: '',
            data: null,
            charged:false
        };


        this.props.navigation.addListener('willFocus', () => {
            this.getToken();
            const { navigation } = this.props;
            //this.state.id = navigation.getParam('itemId', '136');
            this.getToken().then(token => {
              
                if (token != null) {
                    this.fetchSejours(token);
                }
                else {
                    Alert.alert('Vous devez être connecté pour effectuer cette opération'); this.props.navigation.navigate('SignIn')
                }

            });
         
        })


        //this.createVoyage = this.createVoyage.bind(this);
        //this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }

    getToken = async () => {
       const userToken = await AsyncStorage.getItem('id_token');
        const token = userToken;
        this.setState({ token: userToken });
       
      return Promise.resolve(token);
    }

    /* Function display user data, when user click on sectionlist items */

    

    fetchSejours(token) {

        const headers = {
            'Authorization': 'Bearer ' + token 
        };

        axios.get(Config.SERVER_URL + '/api/depenseprevus'
            , {
                headers: headers,
            }).then((res) => {

                console.log("res '" + JSON.stringify(res.data));

                //concate list with response
                // console.log("daaat"+data);


                this.setState({
                    data: res.data,
                    charged:true

                });

            }).catch((error) => {
                this.setState({
                    error: 'Error retrieving data',
                    loading: false
                });
            });
    }
    componentDidMount() {
        this.fetchSejours();

    }
    setCategory = (e) => {
        console.log(e)
    }



    GetSectionListItem = (item) => {
        Alert.alert(item)
    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
    };

    _twoOptionAlertHandler = (item) => {
        //function to make two option alert
        Alert.alert(
            //title
            'Alerte',
            //body
            'Vous voulez vraiment supprimez ce voyage?',
            [
                { text: 'Oui', onPress: () => this.deleteVoyage(item.idVoyage) },
                { text: 'Non', onPress: () => console.log('No Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        );


    }


    deleteVoyage(id) {
        axios.delete(Config.SERVER_URL + '/api/voyages/' + id).then((res) => {
            if (res.data == 'voyage supprimé') {
                this.GetSectionListItem(res.data)
            }
            else {
                this.GetSectionListItem("Erreur")
            }

            console.log("res" + res.data);

            this.getToken().then(token => {
                this.fetchSejours(token);
            });





        })
    }
    euroNdDollarConvert(devise){
        if (devise == "EUR") return "€";
       else if (devise == "GBP") return "£";
       else if (devise == "USD") return "$";
        else return devise;
    }
    displayNbrVoyageur(item) {
        if (item.nbrVoyageurs != undefined && item.nbrVoyageurs !=1) {
            return (<View style={styles.VoyageurView} >
                <View style={{flexDirection:"row",alignItems:"center",marginRight:20,}}>
                    <Image source={require('../img/user.png')} style={{ height: 40, width: 40}} />
                    <Text style={styles.nbrPerson}> X {item.nbrVoyageurs}</Text>
                </View>
                <Text style={styles.MontantPerPerson}>
                    {parseFloat(Math.round(item.prevus * 100) / (item.nbrVoyageurs * 100)).toFixed(2)} {this.euroNdDollarConvert(item.devise)}
                </Text>
            </View>);
        }
        else return
    }
    displayDetailOrCntNdedit(item){
        Moment.locale('en');
        var dnow = Moment().format();
        var dFinSejour = Moment(item.dateRetour).format();
        if(dnow<dFinSejour){ 
           return (
                        <View style={styles.flatFooter}>
                  
                   <TouchableOpacity onPress={() => {

                       this.props.navigation.navigate('Modifier', {

                           objectVoyage: item,

                       });
                   }}><Image source={require('../img/edit.png')} style={{ height: 40, width: 40, }} /></TouchableOpacity>
                   <TouchableOpacity onPress={() => {

                       this.props.navigation.navigate('Cntrl', {

                           itemId: item.idVoyage,
                           item: item,

                       });
                   }} ><Image source={require('../img/control.png')} style={{ height: 40, width: 40, }}  /></TouchableOpacity>
                   
                           
                        </View>);
        }
        else return (
                        <View style={styles.flatFooter}>
                <TouchableOpacity onPress={() => {

                    this.props.navigation.navigate('ReleveDep', {

                        itemId: item.idVoyage,
                        item: item,

                    });
                }}><Image source={require('../img/voir.png')} style={{ height: 40, width: 40, }} /></TouchableOpacity>
                
                        </View>);
    }
    render() {
        Moment.locale('en');
        const { data, users } = this.state;

        if (this.state.charged==false) {
            return (
               
                <View style={styles.cantainer} >
                    
                        <View style={styles.header2}>
                            <Image source={require('../img/mes_sejours.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                            <View style={styles.leftv}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                    <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    
                        <View style={styles.bodyfrom}>
                        
                            <ActivityIndicator
                                animating={true}
                                style={styles.indicator}
                                size="large"
                            />
                       

                        </View>
                         
                        <View style={styles.footer}>
                            <View style={styles.footerMenu}>
                                <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                    <Image source={require('../img/menu.png')} style={{ height: 40, width: 40 }} />
                                </TouchableOpacity>
                            </View>
                            <View style ={styles.footerPlus}>
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
            );
        }
        if (this.state.data==''&&this.state.charged==true) {
            return (
                 <View style={styles.cantainer} >
                    
                        
                        <View style={styles.header2}>
                            <Image source={require('../img/mes_sejours.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                            <View style={styles.leftv}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                    <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bodyfrom2}>

                       
                            <Text style={{
                                fontSize: 40,
                                fontFamily: 'bradhitc',
                                textAlign: 'center',
                                 color: '#f56d61',textAlign:"center" }}>Aucun séjour n'a été
                            planifié pour le moment.</Text>
                        

                        </View>
                    
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


            );
        }
 

        return (
            <View style={styles.cantainer} >
               
                   
                    <View style={styles.header2}>
                        <Image source={require('../img/mes_sejours.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bodyfrom}>
                        
                        <FlatList
                            data={data}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) =>
                                <View style={styles.SejoursCore}>
                                    <View style={styles.flatHeader}>
                                        <Text style={styles.textHeadFlat}>{item.destination}</Text>
                                        <View style={styles.icontrash}>
                                            <TouchableOpacity onPress={() => { this._twoOptionAlertHandler(item) }}>
                                        <Image source={require('../img/croix.png')} name={"close"} type={"font-awesome"} style={{width:20,height:20}}  /></TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.flatHeader2}>
                                        <Text style={styles.textHeadFlat2}>du {Moment(item.dateAller).format('DD/MM/YYYY')} au {Moment(item.dateRetour).format('DD/MM/YYYY')} </Text>
                                    </View>
                                    <View style={styles.coreFlat}>
                                        

                                        <View style={styles.SejoursBody}>
                                            
                                            <Image source={require('../img/budget.png')} name={"close"} type={"font-awesome"} style={{ height: 40, width: 40 }} />
                                           
                                            <Text style={styles.budgetNumber}>{parseFloat(Math.round(item.prevus * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(item.devise)}</Text>
                                        </View>
                                        {this.displayNbrVoyageur(item)}
                                    </View>
                                    {this.displayDetailOrCntNdedit(item)}
                                   
                                </View>
                            }
                            keyExtractor={item => item.idVoyage.toString()}
                        />
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footerMenu}>
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                <Image source={require('../img/menu.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerPlus}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Vo')}>
                                <Image source={require('../img/plus.png')} name={"close"} type={"font-awesome"} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerFois}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                                <Image source={require('../img/croix.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rightv: {
        width: "30%",
    },
    leftv: {
        position: "absolute",
        left: 20,
        alignItems:"baseline",
        width: "20%",
        justifyContent: 'center',
    },
    cantainer: {
        flexDirection:"column",
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
        height: "100%",
        width: "100%",
        position:"relative"
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    bodyfrom: {
        flex:1,
        marginTop: 45,
        padding: 10,

    },
    bodyfrom2: {
        flex: 1,
        marginTop: 45,
        padding: 10,
        justifyContent:'center'
    },
    h2text: {
        marginTop: 10,
        fontFamily: 'Helvetica',
        fontSize: 36,
        fontWeight: 'bold',
    },
    flatHeader: {
        alignItems:"center",
        backgroundColor: 'rgb(255,205,197)',
        height: 35
    },
    flatHeader2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255,242,240)',
    },
    textHeadFlat: {
        textAlign: 'center',
        marginTop: 0,
        width: '100%',
        fontFamily: 'bradhitc',
        fontSize: 25,
        color: '#fFF',
    },
    textHeadFlat2: {
        fontFamily: 'Verdana',
        fontSize: 15,
        color: 'rgb(255,116,103)',
    },
    icontrash: {
        position:"absolute",
       right:10, 
       top:7,
       color:'rgba(190,146,183,0.5)',
       justifyContent:"center"
    },
    coreFlat: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:"center",
        width:'100%',
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
        color: 'rgb(120,43,120)',
        fontSize: 30,
        marginLeft:20,
        fontFamily: 'bradhitc',

    },
    cercleControle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        height: 80,
        width: 80,  //The Width must be the same as the height
        borderRadius: 140, //Then Make the Border Radius twice the size of width or Height
        backgroundColor: '#782b79',

    },
    cercleModifier: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        height: 80,
        width: 80,  //The Width must be the same as the height
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
    footer:{
        flexDirection:'row',
        borderTopWidth:2,
        borderColor: 'rgba(120,43,120,0.8)',
        height:45,
        minHeight:45,
        backgroundColor: 'rgb(120,43,120)',
        position:"relative",
        justifyContent: "space-around",
        alignItems:'center',
        paddingBottom:5

    },
    footerPlus:{
        height:60,
        width:60,
        borderRadius:50,
        backgroundColor:'rgb(255,111,97)',
        alignSelf:"center",
        bottom:0,
        borderWidth:2,
        borderColor:'white',
        alignItems:"center",
        justifyContent:"center"

    },
    footerFois:{
        height:'100%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf:"center",
        marginRight:10
        
    },
    footerMenu:{
        height:'100%',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center", 
        marginLeft:10
    },
    SejoursBody:{
        position:"relative",
        flexDirection:'row',
        justifyContent:"space-evenly",
        alignItems:"center",
        
    },
    SejoursCore:{
        marginBottom:10,
        backgroundColor: "rgba(255,255,255,0.8)"
    },
    flatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: 'rgb(255,205,197)',
        height:35
    },
    VoyageurView:{
        flexDirection:'row',
        justifyContent:"space-around",
        alignItems:"center",
        marginBottom: 10
    },
    nbrPerson:{
        fontSize:20,
        color:'rgb(120,43,120)'
    },
    MontantPerPerson:{
        fontSize:25,
        color:'rgb(255,111,97)',
        fontFamily: 'bradhitc',
        fontWeight:'800'
    }

});
/*
 onPress={() => {
                                     1. Navigate to the Details route with params
this.props.navigation.navigate('Modifier', {

    itemId: item.idVoyage,

});
}}
Menu
 <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                    <Icon name="left" type="font-awesome" color="white" size={35} />
                                </TouchableOpacity>
 */
