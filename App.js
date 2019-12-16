/*import { StyleSheet } from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import { HomeScreen } from './Screens/App/Accueil/Login';
import { OtherScreen } from './Screens/App/OtherScreen';
import { AuthLoadingScreen } from './Screens/Auth/AuthLoading/AuthLoadingScreen';
import { SignInScreen } from './Screens/Auth/SignIn/SignInScreen';*/
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  AsyncStorage
} from "react-native"; import React, { Component } from 'react';
import MonCompte from './Screens/App/Home/MonCompte';
import Voyage from './Screens/App/Home/Voyage';
import MesSejours from './Screens/App/Home/MesSejours';
import { Container, Content, Icon, Header, Body } from 'native-base'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'; 
import { createStackNavigator } from 'react-navigation-stack'; 
import ModifierBudget from "./Screens/App/Home/ModifierBudget";
import ControleDepense from "./Screens/App/Home/ControleDepense";
import Depense from './Screens/App/Home/Depense'; 
import RetirerDepense from "./Screens/App/Home/RetirerDepense";
import Camera from "./Screens/App/Home/Camera";
import ReleveDepense from "./Screens/App/Home/ReleveDepense";
import MesReleves from "./Screens/App/Home/MesReleves";
import Auth from './Screens/App/screens/Auth';
import Registration from './Screens/App/Home/Registration';
import Login from './Screens/App/Home/Login';
import Accueil from './Screens/App/Home/Accueil';
import LogOut from "./Screens/App/Home/LogOut";
import Alerte from "./Screens/App/Home/Alerte";
import RecuperationMotDePasse from "./Screens/App/Home/RecuperationMotDePasse";
/* 
import { Loading } from './screens/app/Home/common/';
import LoggedIn from './screens/spp/screens/LoggedIn';
import Depense from './screens/app/Home/Depense';

import deviceStorage from './Screens/App/services/deviceStorage.js';
//import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';



import MesReleves from "./Screens/App/Home/MesReleves";
import RetirerDepense from "./Screens/App/Home/RetirerDepense";
import Camera from "./Screens/App/Home/Camera";
import Alerte from "./Screens/App/Home/Alerte";


*/


//const AppStack = createStackNavigator({ Accueil: HomeScreen, Other: OtherScreen });
/*export default class App extends Component {
 constructor() {
   super();
   this.state = {
     jwt: '',
     loading: true

   }



   this.newJWT = this.newJWT.bind(this);
   this.deleteJWT = deviceStorage.deleteJWT.bind(this);
   this.loadJWT = deviceStorage.loadJWT.bind(this);
   this.loadJWT();
 }



 newJWT(jwt){
   this.setState({
     jwt: jwt
   });
 }


 render() {
   if (this.state.loading) {
     return (
       <Loading size={'large'} />
      );
   } else if (!this.state.jwt) {
     return (
       <Auth newJWT={this.newJWT} />
     );
   } else if (this.state.jwt) {
     return (
       <Voyage jwt={this.state.jwt} deleteJWT={this.deleteJWT} />
     );
   }
 }
}*/
var result2=null
AsyncStorage.getItem('id_token', (err, result) => {
  console.log(result);
  if (result != null)result2='ta9';
  else result2=null});

const CustomDrawerContentComponent = (props) => {
  AsyncStorage.getItem('id_token', (err, result) => {
    console.log(result);
    if (result != null) result2 = 'ta9';
    else result2 = null
  });

  var items=[];
  console.log('result///'+result2);
 if(result2==null)
    props.navigation.state.routes.map(routerName => { if (routerName.routeName != 'Logout') {items.push(routerName);}; });
  else { props.navigation.state.routes.map(routerName => { items.push(routerName); console.log(routerName) });}
  return (

    <Container>
      <Header style={styles.drawerHeader}>
        <Body>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
            <Image
              style={styles.drawerImage}
              resizeMode={'contain'}
              source={require('./Screens/App/img/logo.png')} />
          </View>
        </Body>
      </Header>
      <Content>
        <DrawerItems {...props} items={items} />
      </Content>

    </Container>

  );
  
 }

  
const AppStack = createDrawerNavigator({
  Home: {
    screen: Accueil,
    navigationOptions: {
      title: 'Accueil'
    }
  },
  Vo: {
    screen: Voyage,
    navigationOptions: {
      title: 'Nouveau séjour'
    }
  },
  Sej: {
    screen: MesSejours,
    navigationOptions: {
      title: 'Mes séjours'
    }
  },
 
  MesR: {
    screen: MesReleves,
    navigationOptions: {
      title: 'Mes relevés' 
    }
  }
  , Notification: {
    screen: Alerte,
    navigationOptions: {
      title: 'Mes alertes'
    }
  },
  MonCompte: {
    screen: MonCompte,
    navigationOptions: {
      title: 'Mon compte'
    }
  },
  
  Logout: {
    screen: LogOut,
    navigationOptions: {
      title: ' Se deconnecter',


    },
  },

  ReleveDep: {
    screen: ReleveDepense,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  Cntrl: {
    screen: ControleDepense,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  Modifier: {
    screen: ModifierBudget,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  Dep: {
    screen: Depense,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  cam: {
    screen: Camera,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  RetirerDep: {
    screen: RetirerDepense,
    navigationOptions: {
      drawerLabel: () => null,
    }
  },
  
}, {
  drawerPosition: 'left',
  contentComponent: CustomDrawerContentComponent
});
const AuthStack = createStackNavigator({ SignIn: { screen: Login }, SignUp: { screen: Registration }, Recup: {screen: RecuperationMotDePasse}},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
  );

const stackR = createStackNavigator({
  fullstack: AppStack,
  Sej: { screen: MesSejours } ,Cntrl : { screen: ControleDepense}
}, {
  headerMode: 'none',
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },

});
export default createAppContainer(
  createSwitchNavigator(
    {
      
      AuthLoading: Accueil,
      Accueil: AuthStack,
      //stackdep:stackR,
      App: AppStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 100,
    backgroundColor: 'white'
  },
  drawerImage: {
    width: "50%",
  }

})
