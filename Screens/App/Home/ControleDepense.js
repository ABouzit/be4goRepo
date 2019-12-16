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
    NativeModules, ActivityIndicator, ImageBackground
} from "react-native";
import axios from "axios";
import {Input} from "./common";
import Config from "../services/config";
import { Image} from "react-native-elements";
import {DrawerActions} from "react-navigation-drawer";
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import 'moment/locale/fr';
var RNFS = require('react-native-fs');


var ImagePicker = NativeModules.ImageCropPicker;
export  default class ControleDepense extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            token: '',
            image: null,
            id:'',
            montantScan:'',
            voyage: {
                destination: '',
                dateAller: '',
                dateRetour: '',
            },
            totalPrevus: '',
            totaleDepense: '',
            tableau:[],
            reponse:null,
            dt:null,

        };

        Moment.locale('fr');
        this.props.navigation.addListener('willFocus', () => {
            const { navigation } = this.props;
            this.state.id = navigation.getParam('itemId', '136');
            this.state.voyage = navigation.getParam('item', null);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$"),
                this.setState( {voyage: navigation.getParam('item', null)})

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
        Promise.all([
            axios.get(url),
            axios.get(url2)
        ])
        // use arrow function to avoid loosing context
        // BTW you don't need to use axios.spread with ES2015 destructuring
            .then(([prevusResponse, depensesResponse]) => {

                this.setState( {reponse: [] , tableau:[] })
                prevusResponse.data.forEach((element, index) => {

                    var depense =  depensesResponse.data.filter(element1 => element1.nomCat === element.nomCat)

                    if( depense.length > 0) {
                        this.state.reponse.push(
                            {
                                categorie: element.nomCat,
                                prevus: element.depense,
                                depense: depense[0].depense
                            })
                    } else {
                        this.state.reponse.push(
                            {
                                categorie: element.nomCat,
                                prevus: element.depense,
                                depense: 0
                            })
                    }
                })
                
                this.state.tableau.push(this.state.reponse[4]);
                this.state.tableau[0].style = styles.prvueViewStyle;
                this.state.tableau.push(this.state.reponse[3]);
                this.state.tableau[1].style = styles.prvueViewStyle;
                this.state.tableau.push(this.state.reponse[1]);
                this.state.tableau[2].style = styles.prvueViewStyle2;
                this.state.tableau.push(this.state.reponse[0]);
                this.state.tableau[3].style =styles.prvueViewStyle2;
                this.state.tableau.push(this.state.reponse[2]);
                this.state.tableau[4].style = styles.prvueViewStyle;
                console.log("taaaableuaa" + JSON.stringify(this.state.tableau))


                for(var i=0 ; i<this.state.reponse.length ; i++) {
              
                    this.setState({
                        totaleDepense: this.state.reponse[0].depense +
                            this.state.reponse[1].depense + this.state.reponse[2].depense
                            + this.state.reponse[3].depense + this.state.reponse[4].depense
                    })
                }
                for(var i=0 ; i<this.state.reponse.length ; i++) {
                    if(this.state.reponse[0].prevus==null ||this.state.reponse[0].prevus==''  ) this.state.reponse[0].prevus=0;
                    if(this.state.reponse[1].prevus==null || this.state.reponse[1].prevus=='' ) this.state.reponse[1].prevus=0;
                    if(this.state.reponse[2].prevus==null || this.state.reponse[2].prevus==''  ) this.state.reponse[2].prevus=0;
                    if(this.state.reponse[3].prevus==null ||his.state.reponse[3].prevus=='') this.state.reponse[3].prevus=0;
                    if(this.state.reponse[4].prevus==null|| this.state.reponse[4].prevus=='' ) this.state.reponse[4].prevus=0;
                    this.setState({
                        totalPrevus: parseFloat(this.state.reponse[0].prevus)
                            +parseFloat(this.state.reponse[1].prevus) + parseFloat(this.state.reponse[2].prevus)
                            + parseFloat(this.state.reponse[3].prevus) + parseFloat(this.state.reponse[4].prevus)
                    })




                    

                };
                

                console.log('////' + this.state.tableau);
                // this.setState({prevus : prevusResponse.data, depenses : depensesResponse.data});
            }).catch(err=> {

        });
    }

    componentDidMount() {

        //  this.fetchSejour();

    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
        );
    };
    pickSingleWithCamera(cropping, mediaType) {
        
        ImagePicker.openCamera({
            cropping: cropping,
            width: 500,
            height: 500,
            includeExif: true,
            mediaType:mediaType,
        }).then(image => {

            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                images: null
            });

            RNFS.readFile(image.path, 'base64').then(base64String => {
                
                this.setState({dt:true});
                axios.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDg8bS-Bz8xqOnspDDIVRObDoeEI4lXxf8",
                    {
                        "requests": [
                            {
                                "features": [
                                    {
                                        "type": "TEXT_DETECTION"
                                    }
                                ],
                                "image": {
                                    "content": base64String
                                }
                            }                    
                        ]           
                    }
                ).then(rest=>{
                     console.log('//bar code'+JSON.stringify(rest.data));
                    var mydata =rest.data;
                    if(mydata.responses && mydata.responses[0] && mydata.responses[0].textAnnotations && mydata.responses[0].textAnnotations[0]
                        && mydata.responses[0].textAnnotations[0].description) {

                        this.state.montantScan = mydata.responses[0].textAnnotations[0].description
                        console.log('//prix' + JSON.stringify(mydata.responses[0].textAnnotations[0].description));
            this.state.dt = false;
                        this.props.navigation.navigate('Dep', {

                            itemId: this.state.id,
                            montant:this.state.montantScan,
                            item:this.state.voyage
                        });
                    }
                } )
            } )

           /* ImgToBase64.getBase64String(image.path)
                .then(base64String => {

                    axios.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDg8bS-Bz8xqOnspDDIVRObDoeEI4lXxf8",
                        {
                            "requests": [
                                {
                                    "features": [
                                        {
                                            "type": "TEXT_DETECTION"
                                        }
                                    ],
                                    "image": {
                                        "content": base64String
                                    }
                                }
                            ]
                        }
                    ).then(rest=>{
                        // console.log(JSON.stringify(rest));
                        var mydata =rest.data;
                        if(mydata.responses && mydata.responses[0] && mydata.responses[0].textAnnotations && mydata.responses[0].textAnnotations[0]
                            && mydata.responses[0].textAnnotations[0].description) {

                            this.state.montantScan = mydata.responses[0].textAnnotations[0].description

                            this.props.navigation.navigate('Dep', {

                                itemId: this.state.id,
                                montant:this.state.montantScan

                            });
                        }
                    } )
                } )
                .catch(err => console.log(err));*/
        }).catch(e => alert(e));

        /*ImgToBase64.getBase64String(image.path)
            .then(base64String => doSomethingWith(base64String))
            .catch(err => doSomethingWith(err));*/


    }

    pickSingleBase64(cropit) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            includeBase64: true,
            includeExif: true,
        }).then(image => {
            console.log('received base64 image');
            this.setState({
                image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
                images: null
            });

        }).catch(e => alert(e));

    }
    nbperson() {
        if (this.state.voyage.nbrVoyageurs == 1 || !this.state.voyage.nbrVoyageurs) {
            return (
                <View style={styles.sectionMoney}>
                    <View style={styles.sectionPrevu}>
                        <Text style={styles.TotLabel}>Prévu</Text>

                        <Text style={styles.prevuTot}>{parseFloat(Math.round(this.state.voyage.prevus * 100) / 100).toFixed(2)}  {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                    </View>
                    <View style={styles.sectiondep}>
                        <Text style={styles.TotLabel}>Dépensé</Text>

                        <Text style={styles.depTot}>{parseFloat(Math.round(this.state.totaleDepense * 100) / 100).toFixed(2)}  {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                    </View>
                </View>);
        }
        else {
            return (
                <View style={styles.sectionMoney}>
                    <View style={styles.sectionPrevu}>
                        <Text style={styles.TotLabel}>Prévu</Text>

                        <Text style={styles.prevuTot}>{parseFloat(Math.round(this.state.voyage.prevus * 100) / 100).toFixed(2)}  {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                        <View style={styles.borderBottom}></View>
                        <View style={styles.VoyageurView} >
                            <View style={{ flexDirection: "row", alignItems: "center",marginRight:20,marginLeft:-10  }}>
                                <Image source={require('../img/user.png')} style={{ height: 40, width: 40,marginLeft:-5,marginRight:-5 }} />
                                <Text style={styles.nbrPerson}>X{this.state.voyage.nbrVoyageurs}</Text>
                            </View>
                            <Text style={styles.MontantPerPerson}>
                                {parseFloat(Math.round(this.state.voyage.prevus * 100 / (this.state.voyage.nbrVoyageurs * 100))).toFixed(2)}  {this.euroNdDollarConvert(this.state.voyage.devise)}
                </Text>
                        </View>
                    </View>
                    <View style={styles.sectiondep}>
                        <Text style={styles.TotLabel}>Dépensé</Text>

                    <Text style={styles.depTot}>{parseFloat(Math.round(this.state.totaleDepense * 100) / 100).toFixed(2)}  {this.euroNdDollarConvert(this.state.voyage.devise)}</Text>
                        <View style={styles.borderBottom}></View>
                        <View style={styles.VoyageurView} >
                            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20, marginLeft: -10 }}>
                                <Image source={require('../img/user.png')} style={{ height: 40, width: 40, marginLeft: -5, marginRight: -5 }} />
                                <Text style={styles.nbrPerson}>X{this.state.voyage.nbrVoyageurs}</Text>
                            </View>
                            <Text style={styles.MontantPerPerson2}>
                                {parseFloat(Math.round(this.state.totaleDepense * 100 / (this.state.voyage.nbrVoyageurs * 100))).toFixed(2)} {this.euroNdDollarConvert(this.state.voyage.devise)}
                </Text>
                        </View>
                    </View>
                </View>
            );
        }
    }
    render() {
        const {reponse, voyage,tableau, totaleDepense, totalPrevus,staticResponse, dt }  = this.state;
        console.log("totale depense:**********");
        console.log(totaleDepense);
        console.log("totale prevus:**********");
        console.log(totalPrevus);
if(this.state.dt === true )


    return (
        <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
            <View style={styles.cantainer} >


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

                    <View style={styles.sectionBudget}>
                        <View style={styles.sectionCategories}>
                            <View style={styles.cat}>
                                    <Text style={styles.catLabel}>Catégories de dépense</Text>
                                <View style={styles.borderBottom}></View>
                            </View>
                            <View style={{flex:5}}>
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/transport.png')} style={{ height: 30, width: 30, marginLeft: 5, }} />
                                    <Text style={styles.labelStyle}>TRANSPORT</Text>
                                </View>
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/hebergement.png')} style={{ height: 30, width: 30, marginLeft: 5, }} />
                                        <Text style={styles.labelStyle}>HÉBERGEMENT</Text>
                                </View>
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/deplacement.png')} style={{ height: 30, width: 30, marginLeft: 5, }} />
                                        <Text style={styles.labelStyle}>DÉPLACEMENTS</Text>
                                </View>
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/alimentation.png')} style={{ height: 30, width: 30, marginLeft: 5, }} />
                                    <Text style={styles.labelStyle}>ALIMENTATION</Text>
                                </View>
                                <View style={styles.labNdIcon2}>
                                    <Image source={require('../img/loisir.png')} style={{ height: 30, width: 30, marginLeft: 5,}} />
                                   
                                    <Text style={styles.labelStyle}>LOISIRS</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.sectionCategoriesDep}>
                            <View style={styles.prevu}>
                                    <Text style={styles.prevLabel}>Prévu</Text>
                                <View style={styles.borderBottom2}></View>
                            </View>
                            <ActivityIndicator
                                animating={true}
                                style={styles.indicator}
                                size="large"
                                style={{ flex: 5 }}

                            />

                        </View>
                        <View style={styles.sectionCategoriesPrev}>
                            <View style={styles.prevu}>
                                    <Text style={styles.catLabel}>Dépensé</Text>
                                <View style={styles.borderBottom2}></View>
                            </View>
                            <ActivityIndicator
                                animating={true}
                                style={styles.indicator}
                                size="large"
                                
                            />
                        </View>
                    </View>
                        {this.nbperson()}
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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('MesR')}>
                        <Icon name="plus" type="FontAwesome" color="white" size={35} />
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


        if (this.state.reponse == null)
          return(
              <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                  <View style={styles.cantainer} >


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

                          <View style={styles.sectionBudget}>
                              <View style={styles.sectionCategories}>
                                  <View style={styles.cat}>
                                          <Text style={styles.catLabel}>Catégories de dépense</Text>
                                      <View style={styles.borderBottom}></View>
                                  </View>
                                  <View style={{ flex: 5 }}>
                                      <View style={styles.labNdIcon2}>
                                          <Image source={require('../img/transport.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                          <Text style={styles.labelStyle}>TRANSPORT</Text>
                                      </View>
                                      <View style={styles.labNdIcon2}>
                                          <Image source={require('../img/hebergement.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                              <Text style={styles.labelStyle}>HÉBERGEMENT</Text>
                                      </View>
                                      <View style={styles.labNdIcon2}>
                                          <Image source={require('../img/deplacement.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                              <Text style={styles.labelStyle}>DÉPLACEMENTS</Text>
                                      </View>
                                      <View style={styles.labNdIcon2}>
                                          <Image source={require('../img/alimentation.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                          <Text style={styles.labelStyle}>ALIMENTATION</Text>
                                      </View>
                                      <View style={styles.labNdIcon2}>
                                          <Image source={require('../img/loisir.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                          <Text style={styles.labelStyle}>LOISIRS</Text>
                                      </View>
                                  </View>
                              </View>
                              <View style={styles.sectionCategoriesDep}>
                                  <View style={styles.prevu}>
                                          <Text style={styles.prevLabel}>Prévu</Text>
                                      <View style={styles.borderBottom2}></View>
                                  </View>
                                  <ActivityIndicator
                                      animating={true}
                                      style={styles.indicator}
                                      size="large"
                                  />

                              </View>
                              <View style={styles.sectionCategoriesPrev}>
                                  <View style={styles.prevu}>
                                          <Text style={styles.catLabel}>Dépensé</Text>
                                      <View style={styles.borderBottom2}></View>
                                  </View>
                                  <ActivityIndicator
                                      animating={true}
                                      style={styles.indicator}
                                      size="large"
                                  />
                              </View>
                          </View>
                         {this.nbperson()}
                      </View>
                      </KeyboardAwareScrollView>
                  </View>
                  <View style={styles.footer}>
                      <View style={styles.footerMenu}>
                          <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                              <Image source={require('../img/menu.png')} style={{ height: 40, width: 40 }} />
                          </TouchableOpacity>
                      </View>
                      <View style={styles.footerMenu}>
                          <TouchableOpacity onPress={() => {

                              this.props.navigation.navigate('Dep', {

                                  itemId: this.state.id,
                                  item:this.state.voyage
                              })
                          }}>
                              <Image source={require('../img/ajoutDep.png')} style={{ height: 40, width: 40 }} />
                          </TouchableOpacity>
                      </View>
                      <View style={styles.footerPlus}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('MesR')}>
                              <Image source={require('../img/valider.png')} style={{ height: 40, width: 40 }} />
                          </TouchableOpacity>
                      </View>
                      <View style={styles.footerFois}>
                          <TouchableOpacity onPress={() => {
                             
                              this.props.navigation.navigate('RetirerDep', {

                                  itemId: this.state.id,
                                    
                              })
                          }}>
                              <Image source={require('../img/retraitDep.png')} style={{ height: 40, width: 40 }} />
                          </TouchableOpacity>
                      </View>
                      <View style={styles.footerFois}>
                          <TouchableOpacity onPress={() => this.pickSingleWithCamera(true,'photo')}>
                              <Image source={require('../img/cameraIcon.png')} style={{ height: 40, width: 40 }} />
                          </TouchableOpacity>
                      </View>
                  </View>
              </ImageBackground>
              );
        else {
        console.log(this.state.tableau);
            return (
                /*<ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
            <View style={styles.cantainer} >
                <View>
                  
                    <View style={styles.header2}>
                        <Image source={require('../img/controler_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage}  />
                        <View style={styles.leftv}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        height: "15%",
                        marginTop: 10,
                        marginLeft: 20,
                        marginRight: 20,

                    }}>
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <Text style={{
                                backgroundColor: 'transparent',
                                color: '#772f7b',
                                fontSize: 30,
                                fontWeight: 'bold',

                            }}> {voyage.destination} </Text>
                            <Text style={{
                                backgroundColor: 'transparent',
                                color: '#f56d61',
                                fontSize: 15,
                                fontWeight: 'bold', 
                            }}> du  {Moment(voyage.dateAller).format('DD-MM-YYYY')} au {Moment(voyage.dateRetour).format('DD-MM-YYYY')}</Text>
                        </View> 
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: 10
                        }}>
                            <View style={{flex: 0.5}}>
                                <TouchableOpacity  onPress={() => this.pickSingleWithCamera(true)}  >
                                    <Image style={{ height: 25,
                                        width: 200, marginTop: 10}} source={require('../img/Tiket.png')} resizeMode={'contain'} />
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>

                    <View style={{
                        height: "35%",
                        marginTop: 15,
                        marginLeft: 20,
                        marginRight: 20,
                    }}>
                        <View style={{flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: "#FF5F44"}}>
                            <Text style={{color: "#FFF",fontWeight: 'bold', marginLeft: "55%"
                            }}> Prévu </Text>
                            <Text style={{color: "#FFF",fontWeight: 'bold',
                            }}> Dépensé </Text>
                        </View>
                        <FlatList
                            data={tableau}

                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) =>
                                <View style={{flexDirection: 'row',
                                    justifyContent: 'space-between',}}>
                                    <View style={{height: 40, backgroundColor:"#fff2f1", width: "50%",
                                        borderColor: "#FFF",
                                        borderWidth: 0.5,}}>
                                        <Text style={{fontFamily: 'Verdana',
                                            fontSize: 20,
                                            color: '#772f7b',fontWeight: 'bold'}}>{item.categorie}</Text>
                                    </View>
                                    <View style={{height: 40, backgroundColor:"#fff2f1", width: "25%",
                                        borderColor: "#FFF",
                                        borderWidth: 0.5 }}>
                                        <Text style={{fontFamily: 'Verdana',
                                            fontSize: 15,
                                            color: '#772f7b',textAlign: 'right',marginTop: 8}}>{parseFloat(Math.round(item.prevus * 100) / 100).toFixed(2)}</Text>

                                    </View>
                                    <View style={{height: 40, backgroundColor:"#fff2f1", width: "25%",
                                        borderColor: "#FFF",
                                        borderWidth: 0.5,}}>
                                        <View>
                                            <Text style={{fontFamily: 'Verdana',
                                                fontSize: 15,
                                                color: '#772f7b',marginLeft: 2,textAlign: 'right',marginTop: 8}} >{parseFloat(Math.round(item.depense * 100) / 100).toFixed(2)}</Text>
                                        </View>

                                    </View>
                                </View>

                            }
                            keyExtractor={item => item.idVoyage}
                        />
                        <View style={{flexDirection: 'row',
                            justifyContent: 'space-between',marginTop: 0}}>
                            <View style={{height: 40, width: "50%",}}>
                                <Text style={{fontFamily: 'Verdana',
                                    fontSize: 20,
                                    color: '#FF5F44',fontWeight: 'bold'}}>Total</Text>
                            </View>
                            <View style={{height: 40, width: "25%" }}>
                                <Text style={{fontFamily: 'Verdana',
                                    fontSize: 18,
                                    color: '#FF5F44',fontWeight: 'bold',textAlign: 'right'}}>{parseFloat(Math.round(voyage.prevus * 100) / 100).toFixed(2)}</Text>

                            </View>
                            <View style={{height: 40, width: "25%" }}>
                                <Text style={{fontFamily: 'Verdana',
                                    fontSize: 18,
                                    color: '#FF5F44',fontWeight: 'bold',textAlign: 'right'}} >{parseFloat(Math.round(totaleDepense * 100) / 100).toFixed(2)}</Text>

                            </View>
                        </View>
                    </View>
                    <View style={{
                        height: "15%",
                        marginTop: 10,
                        marginLeft: 20,
                        marginRight: 20,
                    }}>
                        <View style={{height: "40%", backgroundColor: "#FF5F44"}}>
                            <TouchableOpacity onPress={() => {

                                this.props.navigation.navigate('Dep', {

                                    itemId: this.state.id,

                                });
                            }} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                }}>Ajout Dépense</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{height: "40%", backgroundColor: "#fdf1f0", marginTop: 4, borderColor: "#FF5F44",
                            borderWidth: 1
                        }}>
                            <TouchableOpacity onPress={() => {

                                this.props.navigation.navigate('RetirerDep', {

                                    itemId: this.state.id,


                                });
                                console.log("Controle id**********" + this.state.id);
                            }} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{

                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#FF5F44',
                                }}>Retrait Dépense</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={{
                        height: "10%",
                        borderBottom: 0.5,
                        marginTop: 20,
                        marginLeft: 20,
                        marginRight: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{height: "50%", width:"40%", backgroundColor: "#772f7b", marginTop: 4, borderColor: "#772f7b",
                            borderWidth: 1,borderRadius:3,marginLeft: 15
                        }}>
                            <TouchableOpacity onPress={() => {

                                this.props.navigation.navigate('MesR')}} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{
                                    fontSize: 15,
                                    color: '#fff',
                                }}>Valider</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{height: "50%", width:"40%", backgroundColor: "#fdf1f0", marginTop: 4, borderColor: "#772f7b",
                            borderWidth: 1,borderRadius:3, marginRight: 15
                        }}>
                            <TouchableOpacity onPress={() => {

                                this.props.navigation.navigate('Sej')}}
                                              style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{

                                    fontSize: 15,
                                    color: '#772f7b',
                                }}>Annuler</Text>
                            </TouchableOpacity>

                        </View>

                    </View>



                </View>
            </View>
                </ImageBackground>*/
    
                <ImageBackground source={require('../img/background.jpg')} style={{ width: '100%', height: '100%' }} >
                    <View style={styles.cantainer} >


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

                            <View style={styles.sectionBudget}>
                                <View style={styles.sectionCategories}>
                                    <View style={styles.cat}>
                                            <Text style={styles.catLabel}>Catégories de dépense</Text>
                                        <View style={styles.borderBottom}></View>
                                    </View>
                                   <View style={{flex:5}}>
                                        <View style={styles.labNdIcon2}>
                                            <Image source={require('../img/transport.png')} style={{ height: 30, width: 30,marginLeft:5 }} />
                                            <Text style={styles.labelStyle}>TRANSPORT</Text>
                                        </View>
                                        <View style={styles.labNdIcon2}>
                                            <Image source={require('../img/hebergement.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                                <Text style={styles.labelStyle}>HÉBERGEMENT</Text>
                                        </View>
                                        <View style={styles.labNdIcon2}>
                                            <Image source={require('../img/deplacement.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                                <Text style={styles.labelStyle}>DÉPLACEMENTS</Text>
                                        </View>
                                        <View style={styles.labNdIcon2}>
                                            <Image source={require('../img/alimentation.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                            <Text style={styles.labelStyle}>ALIMENTATION</Text>
                                        </View>
                                        <View style={styles.labNdIcon2}>
                                            <Image source={require('../img/loisir.png')} style={{ height: 30, width: 30, marginLeft: 5 }} />
                                            <Text style={styles.labelStyle}>LOISIRS</Text>
                                        </View>
                                    </View>
                                </View>
                                <View  style={styles.sectionCategoriesDep}>
                                    <View style={styles.prevu}>
                                            <Text style={styles.prevLabel}>Prévu</Text>
                                        <View style={styles.borderBottom2}></View>
                                    </View>
                                    <View style={{ flex: 5 }}>
                                <FlatList
                                    data={tableau}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) =>
                                        <View style={styles.prvueViewStyle}>
                                            <Text style={styles.PrvueStyle}>{parseFloat(Math.round(item.prevus * 100) / 100).toFixed(2)}</Text>
                                        </View>
                                    }
                                    keyExtractor={item => item.idVoyage}
                                />
                                    </View>
                                </View>
                                <View style={styles.sectionCategoriesPrev}>
                                    <View style={styles.prevu}>
                                            <Text style={styles.catLabel}>Dépensé</Text>
                                        <View style={styles.borderBottom2}></View>
                                    </View>
                                    <View style={{ flex: 5 }}>
                                    <FlatList
                                    data={tableau}
                                    

                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) =>
                                        <View style={styles.prvueViewStyle}>
                                            <Text style={styles.labelStyle}>{parseFloat(Math.round(item.depense * 100) / 100).toFixed(2)}</Text>
                                        </View>
                                    }
                                    keyExtractor={item => item.idVoyage}
                                        /></View>
                                </View>
                            </View>
                           {this.nbperson()}
                       </View>
                        </KeyboardAwareScrollView>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footerMenu}>
                            <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                                <Image source={require('../img/menu.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                      <View style={styles.footerMenu}>
                          <TouchableOpacity onPress={() => {

                                this.props.navigation.navigate('Dep', {

                                    itemId: this.state.id,
                                    item:this.state.voyage
                                })}}>
                                <Image source={require('../img/ajoutDep.png')} style={{height:40,width:40}} />
                          </TouchableOpacity>
                      </View>
                        <View style={styles.footerPlus}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MesR')}>
                                <Image source={require('../img/valider.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                      <View style={styles.footerFois}>
                          <TouchableOpacity onPress={() => {

                                this.props.navigation.navigate('RetirerDep', {

                                    itemId: this.state.id,

                                })
                            }}>
                                <Image source={require('../img/retraitDep.png')}   style={{height:40 , width:40}} />
                          </TouchableOpacity>
                      </View>
                        <View style={styles.footerFois}>
                            <TouchableOpacity onPress={() => this.pickSingleWithCamera(true,'photo')}>
                                <Image source={require('../img/cameraIcon.png')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
        );}
    }
}

const styles = {
    TotLabel:{
        fontFamily: 'bradhitc',
        color: '#772f7b',
    },
    prevuTot: {
        fontFamily: 'bradhitc',
        color: 'rgb(255,111,97)',
        fontSize: 20,
        
    },
    depTot: {
        fontFamily: 'bradhitc',
        color: '#772f7b',
        fontSize:20,
        
    },
    catLabel: {
        fontFamily: 'bradhitc',
        color: '#772f7b',
    },
    prevLabel: {
        fontFamily: 'bradhitc',
        color: 'rgb(255,111,97)',
    },
    cat:{
        marginTop:5,
        flex:1
    },
    prevu: {
        marginTop: 5,
        alignItems:'center',
        flex:1
    },
   
    borderBottom:{
        marginTop:5,
        width:80,
        borderBottomWidth:1,
        borderColor: '#772f7b',
        alignSelf:'center'
    },
    borderBottom2: {
        marginTop: 5,
        width: 30,
        borderBottomWidth: 1,
        borderColor: '#772f7b',
        alignSelf: 'center'
    },
    labNdIcon2: {
        marginBottom:10,
        flexDirection: 'row',
    },
    prvueViewStyle: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'flex-end',
        paddingRight: 5
    },
   
    sectionMoney:{
        flex:1,
        flexDirection:'row'
    }, 
    sectionCategoriesDep:{

        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 5,
        marginRight:10,
        flex: 0.25,
        marginTop: '5%',
        padding: 0,
       
    },
    sectiondep: {
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 5,
        marginRight: '5%',
        marginLeft: 10,
        alignItems: 'center',
        marginTop: '5%',
        padding: 0,
        flex: 0.5,
        marginBottom: '5%',
    },
    sectionPrevu: {
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 5,
        marginLeft: '5%',
        alignItems:'center',
        marginTop: '5%',
        padding: 0,
        flex: 0.5, 
        marginBottom: '5%',
    },
    sectionCategoriesPrev: {
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 5,
        marginRight: '5%',
        marginTop: '5%',
        padding: 0,
        flex:0.25,
    },
    sectionCategories:{
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 5,
        marginLeft: '5%',
        marginRight: 10,
       
        marginTop: '5%',
        padding: 0,
        flex:0.5
    },
    sectionBudget:{ 
        flex:4,
        flexDirection:'row'
    },
    day:{
        color: 'rgb(255,111,97)',
        fontFamily: 'bradhitc',
        fontSize:23
    },
    mounth:{
        color: 'rgb(255,111,97)',
        fontSize:10,
        fontWeight:'bold'
    },
    year:{
        color: 'rgb(255,111,97)',
        fontSize: 10,
         fontWeight: 'bold'
    },
    destination:{
        marginTop:5,
        marginBottom:-3,
        fontSize:40,
        fontFamily: 'bradhitc',
        textAlign:'center',
        color: '#772f7b',
    },
    text1 :{
        alignItems:'center', 
        padding:10,
        position:'absolute',
        justifyContent:'center',
        borderWidth:1,
        borderColor: '#772f7b',
        borderRadius:50,
        height:70,
        width:70,
        bottom:0,
        marginBottom:15,
        marginLeft:15,
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
        right:15,
        marginBottom: 15,
       
    },
    fromTo:{
        flexDirection:'row',
        justifyContent:'space-between',
        bottom:'-1%',
        width:'100%',

    },
    FlecheImage: {
        marginTop: -20,
        marginBottom: 20,
        alignItems: 'center',
        width: '55%',
        height: 100,
        marginLeft: -15,
    },
    rightv: {
        width: "30%",
    },
    
    cantainer: {
        backgroundColor:'rgb(255,255,255)',
        flex: 1,
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
    leftv: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        flex:5
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
        height : '70%',
        marginTop:'10%'
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
    rightborder: {
        backgroundColor :'#f56d61',
        width: '1.5%',
    },
    labelStyle: {
        paddingTop:10,
        fontSize: 13,
        fontFamily: 'bradhitc',
        color: '#772f7b',
        height: '100%',
        padding: 2,
    },
    PrvueStyle:{

        paddingTop: 10,
        fontSize: 13,
        fontFamily: 'bradhitc',
        color: 'rgb(255,111,97)',
        height: '100%',
        paddingBottom:1.5
    },
    inputStyle: {
        color: '#772f7b',
        height: 32,
        fontSize: 20,
        paddingBottom: -4,
        textAlign: 'right',
        justifyContent: 'center',
        
    },
    inputView: {
        flex: 1,
        width: '100%',
        alignItems: 'stretch',
        marginRight: '3%',
        marginLeft: '5%',
        height: '100%',
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
        justifyContent: 'space-between',
        marginLeft: '5%',
        marginRight: '5%',
        height: 30,
        marginTop: 20,
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
   
    sectionDestination: {
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgb(206,177,206)',
        borderRadius: 5,
        marginLeft: '7%',
        marginRight: '7%',
        flex: 2,
        marginTop: '5%',
        padding: 0,


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
        marginLeft: 10,
        height: 30, width: 40 
    },
    VoyageurView: {
        flexDirection: 'row',
        justifyContent:"space-between" ,
        alignItems: "center",
        marginBottom: 10
    },
    nbrPerson: {
        fontSize: 18,
        color: 'rgb(120,43,120)'
    },
    MontantPerPerson: {
        
        color: 'rgb(255,111,97)',
        fontFamily: 'bradhitc',
        fontWeight: '800'
    },
    MontantPerPerson2: {

        color: 'rgb(120,43,120)',
        fontFamily: 'bradhitc',
        fontWeight: '800'
    }
};
