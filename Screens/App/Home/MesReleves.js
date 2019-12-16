import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, FlatList, Alert, AsyncStorage, TouchableOpacity, ImageBackground, ActivityIndicator, Picker} from "react-native";
import axios from "axios";
import {Input} from "./common";
import Config from "../services/config";
import { Image} from "react-native-elements";
import {DrawerActions} from "react-navigation-drawer";
import Pie from 'react-native-pie';
import Moment from 'moment';
import {GaugeProgress} from 'react-native-simple-gauge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/fr';
export default class MesReleves extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            token: '',
            id:'',
            dest:'',
            voyage:null,
            data: null,
            charged:false
        };

        Moment.locale('fr');
        this.props.navigation.addListener('willFocus', () => {
            console.log('test listener')
            const { navigation } = this.props;
            this.getToken().then(token=>{
                if (token != null) {
            this.fetchSejours(token)
                }
                else { Alert.alert('Vous devez être connecté pour effectuer cette opération'); this.props.navigation.navigate('SignIn') }

            });
           
        })
       
        console.log(JSON.stringify(this.state)+'///////');





        //this.createVoyage = this.createVoyage.bind(this);
        //this.onRegistrationFail = this.onRegistrationFail.bind(this);
    }
    euroNdDollarConvert(devise) {
        if (devise == "EUR") return "€";
        else if (devise == "GBP") return "£";
        else if (devise == "USD") return "$";
        else return devise;
    }
    getToken = async () => {
       const userToken = await AsyncStorage.getItem('id_token');
         console.log("#######################################" +userToken)
             this.setState({token: userToken});
        const token = userToken;
       
        return Promise.resolve(token); 



    }

    /* Function display user data, when user click on sectionlist items */

    calculePercent(budget, depense ) {
        if(budget == 0) return 0 ;
        let v = depense*100;
        return v/budget;
    }

    fetchSejours(token){


        const headers = {
            'Authorization': 'Bearer ' + token
        };
console.log("*********state toke" + token)
        this.setState({ voyage: null, dest: ''});
        axios.get(Config.SERVER_URL+'/api/depenseprevus'
            , {
                headers: headers,
            }).then((res) => {


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


    }
    setCategory = (e) => {
        console.log(e)
    }



    budgetTotalMulti() {
        if (this.state.voyage.nbrVoyageurs == 1 || !this.state.voyage.nbrVoyageurs){return (
            <View style={styles.sectionBudgTot}>
                <View style={styles.SejoursBody}>

                    <Image source={require('../img/budget.png')} name={"close"} type={"font-awesome"} style={{ height: 40, width: 40 }} />

                    <Text style={styles.budgetLabel}>Budget total</Text>
                </View>
                <View style={styles.SejoursBody2}>
                    <Text style={styles.budgetNumber}>{parseFloat(Math.round(this.state.voyage.prevus * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                </View>
            </View>
        );}
        else{return(
            <View style={styles.sectionBudgTot}>
                <View style={styles.SejoursBody}>

                    <Image source={require('../img/budget.png')} name={"close"} type={"font-awesome"} style={{ height: 40, width: 40 }} />

                    <Text style={styles.budgetLabel}>Budget total</Text>
                </View>
                <View style={styles.SejoursBody3}>
                    <Text style={styles.budgetNumber}>{parseFloat(Math.round(this.state.voyage.prevus * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                </View>
                <View style={styles.VoyageurView} >
                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20, marginLeft: -10 }}>
                        <Image source={require('../img/user.png')} style={{ height: 40, width: 40, marginLeft: -5, marginRight: -5 }} />
                        <Text style={styles.nbrPerson}>X{this.state.voyage.nbrVoyageurs}</Text>
                    </View>
                    <Text style={styles.MontantPerPerson2}>
                        {parseFloat(Math.round(this.state.voyage.prevus * 100 / (this.state.voyage.nbrVoyageurs * 100))).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}
                </Text>
                </View>
            </View>
        );}
    }
    RestAdepMulti(){
        if (this.state.voyage.nbrVoyageurs == 1 || !this.state.voyage.nbrVoyageurs) {
            return (
                <View style={styles.restant}>
                    <Text style={styles.budgetNumber3}>{parseFloat(Math.round((this.state.voyage.prevus - this.state.voyage.depense) * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                </View>
            );
        }
            else{
                return(
                    <View style={styles.restant}>
                        <Text style={styles.lab}>Total</Text>
                        <Text style={styles.budgetNumber4}>{parseFloat(Math.round((this.state.voyage.prevus - this.state.voyage.depense) * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                        <Text style={styles.lab}>Par personne</Text>
                        <Text style={styles.budgetNumber4}> {parseFloat(Math.round((this.state.voyage.prevus - this.state.voyage.depense) * 100 / (this.state.voyage.nbrVoyageurs * 100))).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                    </View>
                );
            }
    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
        );
    };

    onPickerValueChange = (value, index)=>{
        if(value!=undefined){
            this.state.voyage = this.state.data[index - 1];
        this.setState(
            {
                "dest": value
            }
        ,
            () => {
              
                console.log(this.state.dest);
                        
                console.log(JSON.stringify(this.state.voyage));
                
            }
        );
        }
    }
    render() {
        const { data,users,voyage  } = this.state;
        
        if (this.state.charged==false) {
            
                
            return (<ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                <View style={styles.cantainer} >

                    <View style={styles.header2}>
                        <Image source={require('../img/mes_releve.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bodyfrom2}>
                        <View style={styles.sectionDropBox}>
                            <View style={styles.section1}>
                                <View style={styles.rightborder}>
                                    <Icon name="angle-down" type="FontAwesome" color="white" size={30} />
                                </View>

                                <Picker style={styles.PickerStyleClass}
                                    selectedValue={this.state.dest}
                                    onValueChange={this.onPickerValueChange} itemTextStyle={{
                                        height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold'
                                    }} >
                                    <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label="Selectionner un voyage" />
                                    
                                </Picker>


                            </View>
                        </View>
                        <View style={styles.sectionDestination2}>
                            <ActivityIndicator
                                animating={true}
                                style={styles.indicator}
                                size="large"
                            />

                           

                        </View>
                        
                    </View>
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



            </ImageBackground>

            );
               
        }
        if (this.state.data==''&&this.state.charged==true) {
            return (<ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                <View style={styles.cantainer} >

                    <View style={styles.header2}>
                        <Image source={require('../img/mes_releve.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bodyfrom2}>
                        <View style={styles.sectionDropBox}>
                            <View style={styles.section1}>
                                <View style={styles.rightborder}>
                                    <Icon name="angle-down" type="FontAwesome" color="white" size={30} />
                                </View>

                                <Picker style={styles.PickerStyleClass}
                                    selectedValue={this.state.dest}
                                    onValueChange={this.onPickerValueChange} itemTextStyle={{
                                        height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold'
                                    }} >
                                    <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label="Selectionner un voyage" />

                                </Picker>


                            </View>
                        </View>
                        <View style={styles.sectionDestination2}>
                                <Text style={styles.destination2}>Aucun voyage n'est programee pour l'instant</Text>



                        </View>
                        
                    </View>
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



            </ImageBackground>

            );
        }
        if (this.state.dest==''){
            
            <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                <View style={styles.cantainer} >

                    <View style={styles.header2}>
                        <Image source={require('../img/mes_releve.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <KeyboardAwareScrollView>
                    <View style={styles.bodyfrom2}>
                        <View style={styles.sectionDropBox}>
                            <View style={styles.section1}>
                                <View style={styles.rightborder}>
                                    <Icon name="angle-down" type="FontAwesome" color="white" size={30} />
                                </View>

                                <Picker style={styles.PickerStyleClass}
                                    selectedValue={this.state.dest}
                                    onValueChange={this.onPickerValueChange} itemTextStyle={{
                                        height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold'
                                    }} >
                                    <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label="Selectionner un voyage" />
                                    {data.map((item) => {
                                        return (
                                            <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label={item.destination + ' - du ' + Moment(item.dateAller).format('DD/MM/YYYY') + ' au ' + Moment(item.dateRetour).format('DD/MM/YYYY')} value={item.idVoyage} />);
                                    })
                                    }
                                </Picker>


                            </View>
                        </View>
                        <View style={styles.sectionDestination2}>

                            <Text style={styles.Choix}>Choisisez un voyage</Text>

                            
                        </View>
                        
                    </View>
                    </KeyboardAwareScrollView>
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



            </ImageBackground>

        }
        if (!this.state.voyage) {
            return (<ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                <View style={styles.cantainer} >

                    <View style={styles.header2}>
                        <Image source={require('../img/mes_releve.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bodyfrom2}>
                        <View style={styles.sectionDropBox}>
                            <View style={styles.section1}>
                                <View style={styles.rightborder}>
                                    <Icon name="angle-down" type="FontAwesome" color="white" size={30} />
                                </View>

                                <Picker style={styles.PickerStyleClass}
                                    selectedValue={this.state.dest}
                                    onValueChange={this.onPickerValueChange} itemTextStyle={{
                                        height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold'
                                    }} >
                                    <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label="Selectionner un voyage" />
                                    {data.map((item) => {
                                        return (
                                            <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label={item.destination + ' - du ' + Moment(item.dateAller).format('DD/MM/YYYY') + ' au ' + Moment(item.dateRetour).format('DD/MM/YYYY')} value={item.idVoyage} />);
                                    })
                                    }
                                </Picker>


                            </View>
                        </View>
                        <View style={styles.sectionDestination2}>

                            <Text style={styles.destination2}>Veuillez sélectionner un voyage</Text>

                        </View>
                        
                    </View>
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



            </ImageBackground>

            );
        }
        return (/*
            <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
            <View style={styles.cantainer} >
               
                    <View style={styles.header2}>
                        <Image source={require('../img/mes_releve.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bodyfrom}>

                        <FlatList
                            data={data}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) =>
                                <TouchableOpacity onPress={() => {this.props.navigation.navigate('ReleveDep', {

                                    itemId: item.idVoyage,
                                    item: {
                                        destination: item.destination,
                                        dateAller: item.dateAller,
                                        dateRetour: item.dateRetour,
                                        budget:item.prevus,
                                        depense:item.depense
                                    },

                                });}}>
                                    <View style={{marginBottom: 10}}>
                                        <View style={styles.flatHeader}>
                                            <Text style={styles.textHeadFlat}>{item.destination}</Text>
                                        </View>
                                        <View style={styles.flatHeader2}>
                                            <Text style={styles.textHeadFlat2}>du {Moment(item.dateAller).format('DD-MM-YYYY')} au {Moment(item.dateRetour).format('DD-MM-YYYY')}  </Text>
                                        </View>
                                        <View style={styles.coreFlat}>
                                            <View style={{alignItems: 'center',
                                                justifyContent: 'space-around',}} >
                                                <GaugeProgress
                                                    size={200}
                                                    width={10}
                                                    fill={100}
                                                    rotation={90}
                                                    cropDegree={90}
                                                    tintColor="#772f7b"
                                                    backgroundColor="rgb(255,111,97)"
                                                    strokeCap="circle"
                                                    fill={this.calculePercent(item.prevus, item.depense)}/>
                                                    
                                                <Pie
                                                    maxAngle={270}
                                                    radius={70}
                                                    innerRadius={50}
                                                    series={[this.calculePercent(item.prevus,item.depense)]}
                                                    colors={['#772f7b']}
                                                    backgroundColor='#ddd' />
                                                <View style={styles.gauge}>
                                                    <Text style={styles.gaugeText}>Budget</Text>
                                                    <Text style={styles.gaugeText2}>{parseFloat(Math.round(item.prevus * 100) / 100).toFixed(2)}€</Text>
                                                </View>
                                            </View>
                                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={styles.depense}>Dépenses : </Text>
                                                <View style={{borderBottomWidth: 1, borderColor: '#f56d61'}}>
                                                    <Text style={styles.depenseNumber}>{parseFloat(Math.round(item.depense * 100) / 100).toFixed(2)}€</Text>
                                                </View>
                                            </View>
                                        </View>


                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.idVoyage.toString()}
                        />

                    </View>
                    <View style={{ marginTop: 20, height: "8%", paddingLeft: "25%", paddingRight: "25%" }}>
                        <TouchableOpacity style={{ height: 30,justifyContent: 'center', alignItems: 'center', backgroundColor: '#772f7b', borderRadius:4, weight: "40%" }} onPress={() => this.props.navigation.navigate('Home')}>
                            <Text style={styles.textAcceuil}>Accueil</Text>
                        </TouchableOpacity>
                    </View>
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

                
            
            </ImageBackground>*/
            <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                <View style={styles.cantainer} >

                    <View style={styles.header2}>
                        <Image source={require('../img/mes_releve.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <KeyboardAwareScrollView>
                    <View style={styles.bodyfrom}>
                        <View style={styles.sectionDropBox}>
                            <View style={styles.section1}>
                                <View style={styles.rightborder}>
                                    <Icon name="angle-down" type="FontAwesome" color="white" size={30} />
                                </View>

                                <Picker style={styles.PickerStyleClass}
                                    selectedValue={this.state.dest}
                                    onValueChange={this.onPickerValueChange} itemTextStyle={{
                                        height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold'
                                    }} >
                                    <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label="Selectionner un voyage"  />
                                   { data.map((item) => {
                                                    return (
                                                        <Picker.Item style={{ height: 40, textAlign: "center", fontSize: 15, fontWeight: 'bold' }} label={item.destination + ' - du ' + Moment(item.dateAller).format('DD/MM/YYYY') + ' au ' + Moment(item.dateRetour).format('DD/MM/YYYY')} value={item.idVoyage} />);
                                   })
                                    }
                                                        </Picker>


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
                            {this.budgetTotalMulti()}
                        <View style={styles.sectDopPrev}>
                            <View style={styles.sectionDep}>
                                <Text style={styles.budgetLabel2}>Dépensé</Text>
                                
                                <GaugeProgress
                                    size={140}
                                    width={10}
                                    fill={100}
                                    rotation={90}
                                    cropDegree={90}
                                    tintColor="#772f7b"
                                    backgroundColor="rgb(255,111,97)"
                                    strokeCap="circle"
                                    fill={this.calculePercent(voyage.prevus, voyage.depense)} 
                                    style={styles.gauge2}>
                                        <View style={styles.billsView}>
                                            <Image source={require('../img/bill.png')} name={"close"} type={"font-awesome"} style={styles.bills} />
                                        </View>
                                    </GaugeProgress>
                                    
                                    <Text style={styles.budgetNumber2}>{parseFloat(Math.round(voyage.depense * 100) / 100).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                                
                            </View>
                            <View style={styles.sectionRestDep}>
                                <Text style={styles.budgetLabel2}>Reste à dépenser</Text>
                                    {this.RestAdepMulti()}
                            </View>
                        </View>
                            <TouchableOpacity style={styles.button} onPress={() => 
                                this.props.navigation.navigate('ReleveDep', {

                                    itemId: voyage.idVoyage,
                                    item: {
                                        destination: voyage.destination,
                                        dateAller: voyage.dateAller,
                                        dateRetour: voyage.dateRetour,
                                        budget: voyage.prevus,
                                        depense: voyage.depense,
                                        devise: voyage.devise
                                    },

                                })}
                             >
                            <Text style={styles.styleText3}> Relevé détaillé </Text>
                        </TouchableOpacity>
                    </View>
                    </KeyboardAwareScrollView>
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

                
            
            </ImageBackground>
    
            );
        }
        
    }
    
styles = StyleSheet.create({
    PickerStyleClass: {
        zIndex: 10,
        width: "100%",
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0)',
        height: '90%',
        color: 'rgb(255,111,97)',
        fontSize:15,
        borderRadius: 10,

    },
    rightborder: {
        zIndex: 2,
        position: 'absolute',
        right: 0,
        backgroundColor: '#772f7b',
        width: 40, height: 39,
        borderLeftWidth: 0.5,
        borderColor: '#772f7b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section1: {
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderColor: "#772f7b",
        height: 40,
        padding: 0,
        

    },
    SejoursBody: {
        position: "relative",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",

    },
    SejoursBody2: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        flex:1,
        marginBottom:30
    },
    SejoursBody3: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    restant:{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
        marginBottom:30
    },
    budgetNumber3: {
        color: 'rgb(255,111,97)',
        fontSize: 20,
        fontFamily: 'bradhitc',
       
    }, 
    budgetNumber4: {
        color: 'rgb(255,111,97)',
        fontSize: 20,
        fontFamily: 'bradhitc',
        flex:1
    }, 
    lab:{
        flex:1,
        color: 'rgb(120,43,120)',
    },
    budgetNumber: {
        color: 'rgb(255,111,97)',
        fontSize: 30,
        marginLeft: 20,
        fontFamily: 'bradhitc',

    }, 
    budgetNumber2: {
        color: 'rgb(120,43,120)',
        fontSize: 25,
        fontFamily: 'bradhitc',
        marginTop:-10,
        textAlign:"center"
    },
    budgetLabel: {
        color: 'rgb(120,43,120)',
        fontSize: 20,
        marginLeft: 20,
        fontFamily: 'bradhitc',

    },
    budgetLabel2: {
        marginTop:5,
        color: 'rgb(120,43,120)',
        fontSize: 20,
        fontFamily: 'bradhitc',
        marginBottom:10
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
        backgroundColor:'rgb(255,255,255)'
    },
    indicator: {
        height:'100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:"center"
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
    buttonbackgroundImage: {
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
    },
        bodyfrom: {
            height: '90%',
            paddingBottom:'10%'
            
    },
    bodyfrom2: {
        flex:1,

    },
    h2text: {
        marginTop: 10,
        fontFamily: 'Helvetica',
        fontSize: 36,
        fontWeight: 'bold',
    },
    flatHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f56d61',
    },
    flatHeader2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fcf7f8',
    },
    styleText3: {
        fontSize: 17,
        color: '#ffffff',
    },
    button: {

        alignSelf: 'center',
       marginTop:20,
        height: 40,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#782b79',
        borderColor: '#000000',
        borderRadius: 5,
    },
    textHeadFlat: {
        fontFamily: 'Verdana',
        fontSize: 25,
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
        marginTop: 10,
    },
    depense: {
        color: '#782b79',
        fontFamily: 'Verdana',
        fontSize: 15,
    },
    depenseNumber: {
        color: '#782b79',
        fontSize: 38,
        marginTop: 0,
        textAlign: 'justify',
        lineHeight: 50,
        fontWeight: 'bold',

    },
    cercleControle:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        height: 120,
        width: 120,  //The Width must be the same as the height
        borderRadius:200, //Then Make the Border Radius twice the size of width or Height
        backgroundColor:'#782b79',

    },
    textAcceuil: {
        fontFamily: 'Verdana',
        fontSize: 20,
        color: '#fFF',
    },
    gauge: {
        marginTop: 13,
        position: 'absolute',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#f56d61',
        fontSize: 10,
    },
    gaugeText2: {
        backgroundColor: 'transparent',
        color: '#f56d61',
        fontSize: 20,
        fontWeight: 'bold',
    },
    leftv2: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
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
    sectionDestination: {
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 3,
        marginLeft: '7%',
        marginRight: '7%',
        flex: 3,
        marginTop: '15%',
        padding: 0,


    },
    sectionDestination2: {
        marginLeft: '7%',
        marginRight: '7%',
        flex:1,
        padding: 0,
        justifyContent: 'center',
        alignItems:"center",
        alignSelf:"center",
    },
    sectionChoix: {

        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 3,
        marginLeft: '7%',
        marginRight: '7%',
        flex: 3,
        marginTop: 10,
        padding: 0,
        justifyContent:"center"

    },
    sectionDropBox: {
        justifyContent: 'center',


    },
    sectionBudgTot: {
        position: 'relative',

        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 4,
        marginLeft: '7%',
        marginRight: '7%',
        flex: 2,
        marginTop: 10,
        padding: 0,


    },
    sectionBudgTot2: {
        position: 'relative',
        borderRadius: 4,
        marginLeft: '7%',
        marginRight: '7%',
        flex: 2,
        marginTop: 10,
        padding: 0,


    },
    sectionVide:{
        flex: 4,
        flexDirection: 'row',

    },

    sectDopPrev: {

        flex: 3.5,
        flexDirection: 'row',

    },
    sectionRestDep: {
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 3,
        marginRight: '7%',
        marginLeft: 10,
        alignItems: 'center',
        marginTop: 10,
        padding: 0,
        flex: 0.5

    },
    sectionDep: {
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 3,
        marginLeft: '7%',
        alignItems: 'center',
        marginTop: 10,
        padding: 0,
        flex: 0.5,
        position:'relative'
    },
    gaugeView:{
        position:'relative'
        
    },
    gauge2:{
    },
    billsView:{
        position: 'absolute',
        top: 80,
        right:50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bills:{
        width: 40,
        height: 40,
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
        bottom: '-1%',
        width: '100%'
    },
    FlecheImage: {
        marginTop: -20,
        marginBottom: 20,
        alignItems: 'center',
        width: '55%',
        height:100,
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
        color: '#772f7b'
    },

    destination2: {
        marginTop: 5,
        marginBottom: -3,
        fontSize: 40,
        fontFamily: 'bradhitc',
        textAlign: 'center',
        color: '#f56d61',
    },
    VoyageurView: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    nbrPerson: {
        fontSize: 18,
        color: 'rgb(120,43,120)'
    },
    MontantPerPerson2: {
        fontSize:20,
        color: 'rgb(255,111,97)',
        fontFamily: 'bradhitc',
        fontWeight: '800'
    },
});
/*color: '#f56d61'
 onPress={() => {
                                     1. Navigate to the Details route with params
this.props.navigation.navigate('Modifier', {

    itemId: item.idVoyage,

});
}}
 */
