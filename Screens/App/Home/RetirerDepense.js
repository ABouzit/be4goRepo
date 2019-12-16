import React, { Component, Fragment } from 'react';
import { View, Text, Alert, Picker, TouchableOpacity, TextInput, FlatList, TouchableWithoutFeedback,  ImageBackground } from 'react-native';
import { Input, TextLink, Loading, Button } from './common';
import axios from 'axios';
import { Image} from "react-native-elements";
import {DrawerActions} from "react-navigation";
import Config from "../services/config";
import Moment from 'moment';
import Modalbox from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class RetirerDepense extends Component {
    
    constructor(props) {
       
        super(props);
        this.state = {

            isLoading: true,
            throttlemode:'',
            idCat:'',
            modalVisible2:true,
            selectedItem:[],
            devise:''
        }
      
        this.props.navigation.addListener('willFocus', () => {
            console.log('///////////////////////////const' + JSON.stringify(this.state));
            const { navigation } = this.props;
            this.state.id = navigation.getParam('itemId', '136');
            this.state.devise = navigation.getParam('devise','mok' );
            this.state.modalVisible = true;

            
            console.log("navigation******id********" + this.state.id) ;

        })
      
        console.log('1111111')
        console.log('////////:'+this.state.modalVisible);
    }
    euroNdDollarConvert(devise) {
        if (devise == "EUR") return "€";
        else if (devise == "GBP") return "£";
        else if (devise == "USD") return "$";
        else return devise;
    }
    isInArray(item) {
        for (var i = 0; i < this.state.selectedItem.length; i++) {
            if (item == this.state.selectedItem[i]) { 
                
                 return i; }
           
        }
        return -1; 
    }
         selectedItems(item){
             console.log( 'kaim'+this.isInArray(item));
             if(this.isInArray(item)!=-1){
                
                 this.state.selectedItem.splice(this.isInArray(item),1);
                
             }
                 
             
             else { 
                 this.state.selectedItem.push(item);
             }
       
    }
    setModalVisible(visible) {
        console.log('e0ncore');
        this.props.navigation.navigate('Cntrl');
        
      }
    getDepense(id){
        console.log("getDepense*********ide" + this.state.id);


        axios.get(Config.SERVER_URL+'/depensesByCat/'+id+'/' + this.state.id).then((res) => {

            console.log(res)
            console.log('res')
            this.setState({ data: res.data
            });
            console.log('stat');
        }).catch((error) => {
            this.setState({
                error: 'Error retrieving data',
                loading: false
            });
            console.log("errrr")
            console.log(error)
        });
    }
    onPickerValueChange=(value, index)=>{
        console.log('[')
        this.state.selectedItem = [];
        this.setState(
            {
                "throttlemode": value
            },
            () => {
                // here is our callback that will be fired after state change.

                this.getDepense(value);
            }
        );
    }
    _twoOptionAlertHandler=()=>{
        //function to make two option alert
        
        if(this.state.selectedItem.length!=0)
        Alert.alert(
            //title
            'Alerte',
            //body
            'Vous voulez vraiment supprimez cette depense?',
            [
                {text: 'Oui', onPress: () => this.actionOnRow()},
                {text: 'Non', onPress: () => console.log('No Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        );


    }
    actionOnRow() {
        for (var i = 0; i < this.state.selectedItem.length; i++) {
            console.log(i+'hahia i')
            console.log("**********idCat" + this.state.idCat);
            console.log('ids' + this.state.selectedItem[i].idDepense);
            axios.delete(Config.SERVER_URL + '/api/depenses/' + this.state.selectedItem[i].idDepense).then((res) => {
                console.log("res " + res.data);
                console.log(i + 1 + '//' + this.state.selectedItem.length,'i+1==this.state.selectedItem.length')
                if(i==this.state.selectedItem.length){
                
                this.setState({ data: [], throttlemode: '' });
                this.state.selectedItem = [];
                this.getDepense(this.state.throttlemode);
                this.setModalVisible(false);
                }
            }).catch((error) => {
                this.setState({
                    error: 'Error retrieving data',
                    loading: false
                });
                console.log("err")
                console.log(error)
            }) ;

            
        }
       
    }
   
    
    render() {
       
       
        const {data} = this.state;
        return (
                <View style={styles.cantainer} >
                    <View style={styles.header2}>
                        <Image source={require('../img/controler_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage} />
                        <View style={styles.leftv2}>
                            <TouchableOpacity onPress={() => { this.props.navigation.goBack();}}>
                                <Icon name="angle-left" type="FontAwesome" color="white" size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Modalbox
                        animationDuration={0}
                        swipeToClose={false}
                        backdrop={true}
                        backdropPressToClose={false}
                        isOpen={this.state.modalVisible2}
                      
                        position={'center'}
                        style={styles.modal}>
            <View  >
                <View >
                  
                    <View style={styles.header3}>
                       
                                         <Image source={require('../img/retirer_depense.jpg')} resizeMode={'stretch'} style={styles.buttonbackgroundImage}  />
                                        <View style={styles.icontrash}>
                                    <TouchableOpacity onPress={() => {
                                        this.state.selectedItem = []; this.setState({ data: [], throttlemode: '' });
                                        ; this.setModalVisible(false); }}>
                                                <Image source={require('../img/croix.png')} name={"close"} type={"font-awesome"} style={{ width: 20, height: 20 }} /></TouchableOpacity>
                                        </View>
                                       
                    </View>
                    <View style={styles.section1}>
                                    <View style={styles.rightborder}>
                                        <Icon name="angle-down" type="FontAwesome" color="#772f7b" size={30} />
                                    </View> 

                        <Picker style={styles.PickerStyleClass}
                                selectedValue={this.state.throttlemode} 
                                onValueChange={this.onPickerValueChange} itemTextStyle={{height: 40, textAlign: "center", fontSize: 20,     fontWeight: 'bold'
                        }} >
                            <Picker.Item label="Sélectionnez la catégorie de dépense"  />
                            <Picker.Item style={{height: 40, textAlign: "center", fontSize: 20,     fontWeight: 'bold'}} label="Transport" value="1" />
                            <Picker.Item label="Hébergement" value="5" />
                            <Picker.Item label="Déplacement" value="2" />
                            <Picker.Item label="Alimentation" value="4" />
                            <Picker.Item label="Divers" value="3" />
                                       
                        </Picker>
                        
                                   
                    </View> 
                    <View style={{marginTop: '5%', justifyContent: "center", alignItems: "center", marginLeft: '5%',
                        marginRight: '5%',}}>
                        <Text style={{fontSize: 16, color: "#772f7b", textAlign:'center',fontWeight:'bold'}}>
                            Sélectionner une ou plusieurs operations a supprimer
                        </Text>
                    </View>
                    <View  style={styles.bodyfrom}>

                        <FlatList

                            data={data}

                            renderItem={({item}) => (
                                <TouchableWithoutFeedback  onPress={ () => 
                                    {/*this._twoOptionAlertHandler(item)*/
                                        this.selectedItems(item);
                                        console.log(this.state.selectedItem);
                                    this.props.navigation.navigate('RetirerDep', {

                                        itemId: this.state.id,


                                    })
                                }}
                                    key={item.idDepense}>
                                   
                                  
                                    <View style={[this.isInArray(item)!=-1 ? styles.sectionFlatS : styles.sectionFlat]} key={item.idDepense}> 
                                        <View style={{ flexDirection: 'row' }} key={item.idDepense}>
                                            <Text style={[this.isInArray(item)!=-1 ? styles.labelStyleS : styles.labelStyle]}>{Moment(item.dateDepense).format('DD/MM/YYYY')}</Text>
                                            <Text style={[this.isInArray(item)!=-1 ? styles.labelStyle1S : styles.labelStyle1]}>{"  " + item.libelle + "    "}</Text>
                                        </View>
                                          
                                        <View style={{ flexDirection: 'row' }} key={item.idDepense}><Text style={[this.isInArray(item) != -1 ? styles.labelStyle2S : styles.labelStyle2]}>{parseFloat(Math.round(item.montantDevise * 100) / 100).toFixed(2)}{this.euroNdDollarConvert(item.devise)}</Text>
                                   </View>
                                   </View>
                                </TouchableWithoutFeedback>


                            )}
                            keyExtractor={item => item.idDepense}
                        />
                                    
                    </View>
                    
                                
                </View>
                           
            </View>
                        <TouchableOpacity style={styles.button} onPress={() => this._twoOptionAlertHandler()} >
                            <Text style={styles.styleText3}> Retirer </Text>
                        </TouchableOpacity>
            </Modalbox>
            </View>
        )
    }
}
const styles = {
    styleText3: {
        fontSize: 17,
        color: '#ffffff',
    },
    button: {
        alignSelf:'center',
        position:'absolute',
        bottom:30,
        height:40,
        width:'40%',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#782b79',
        borderColor: '#000000',
        borderRadius: 5,
        marginLeft: "5%"
    },
     icontrash: {
        position:"absolute",
       right:10, 
       alignSelf:'center',
       color:'rgba(190,146,183,0.5)',
       justifyContent:"center"
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
        height: '10%',
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
    header3: {
        height: 40,
        justifyContent: 'center'
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
        height:'46%',
        marginTop: '4%',
        marginLeft: '5%',
        marginRight: '5%',
    },
    form: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    section1: {
        marginLeft: '5%',
        marginRight: '5%',
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius:5,
        borderColor: "#772f7b",
        height: 40,
        marginTop: '5%',
        padding: 0

    },
    sectionFlat: {
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderColor: '#772f7b',
        height: 40,
        marginTop: 4,
        padding: 0,
        borderRadius:5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionFlatS: {
        flexDirection: 'row',
        borderWidth: 0.5,
        backgroundColor: 'rgb(255,112,98)',
        borderColor: '#fff',
        height: 40,
        marginTop: 4,
        padding: 0,
        alignSelf:'stretch',
        borderRadius: 5,
        justifyContent:'space-between',
        alignItems:'center',
    },
    rightborder: {
        zIndex:2,
        position:'absolute',
        right:0,
        backgroundColor :'rgba(0,0,0,0)',
        width: 40,height:39,
        borderLeftWidth:0.5,
        borderColor: '#772f7b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightborder1: {
        backgroundColor :'#f56d61',
        width: '1.5%',
    },
    labelStyle: {
        color: '#772f7b',
        fontSize: 13,
        height: '100%',
        marginLeft: 3,
        padding: 2,
        fontWeight:'bold'

    },labelStyle1: {
        color: '#772f7b',
        fontSize: 13,
        height: '100%',
        marginLeft: 10,
        padding: 2,
        fontWeight: 'bold'
    },labelStyle2: {
        color: '#772f7b',
        fontSize: 13,
        height: '100%',
        padding: 2,
        marginRight: 5,
        fontWeight: 'bold'
        
    },
    labelStyleS: {
        color: '#fff',
        fontSize: 13,
        height: '100%',
        marginLeft: 3,
        padding: 2,
        fontWeight: 'bold'
    }, labelStyle1S: {
        color: '#fff',
        fontSize: 13,
        height: '100%',
        marginLeft: 10,
        padding: 2,
        fontWeight: 'bold'
       
    }, labelStyle2S: {
        color: '#fff',
        fontSize: 13,
        height: '100%',
        padding: 2,
        marginRight: 5,
        fontWeight: 'bold'
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
    PickerStyleClass:{
        zIndex:10,
        width: "100%",
        paddingTop:10,
        paddingBottom:5,
        backgroundColor:'rgba(0,0,0,0)',
        height: '90%',
        color:"#772f7b",
        borderRadius:10,
        
    },
    section: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#000',
        height: 32,
        marginTop: 4,
        padding: 0,
    },
    buttonSection:{
        width: "50%",
        height: 40,
        marginTop: 20,

    },

    buttonAnnuler: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffbff',
        borderColor: '#000000', 
        borderRadius:5,
        borderWidth: 0.5,

    },
    styleText4:{
        fontSize: 17,
        color: '#782b79',
    },
    modal: {
        height: '60%',
        width: '95%',
        borderWidth: 1,
        borderColor: 'black'
    },
    cantainer: {
        flex: 1,
    },
    leftv2: {
        position: "absolute",
        left: 20,
        alignItems: "baseline",
        width: "20%",
        justifyContent: 'center',
    },

};
