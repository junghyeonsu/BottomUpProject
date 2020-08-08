import React from 'react';
import { StyleSheet,View,StatusBar } from 'react-native';
import Constants from 'expo-constants';
import JeonGuk from './screens/JeonGuk';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Seoul from './screens/Seoul/Seoul.jsx';
import InCheonKyungKi from './screens/InCheonKyungKi/InCheonKyungKi';
import InCheon from './screens/InCheonKyungKi/InCheon';
import DaeJeon from './screens/DaeJeonChungChung/DaeJeon';
import ChungChung from './screens/DaeJeonChungChung/ChungChung';
import Ghwangjoo from './screens/GhwangJooJeonna/Ghwangjoo';
import Jeonna from './screens/GhwangJooJeonna/Jeonna';
import KyeongBook from './screens/DaeGuKyeongBook/KyeongBook';
import DaeGu from './screens/DaeGuKyeongBook/DaeGu';
import KwangWon from './screens/KwangWon/KwangWon';
import Busan from './screens/BusanKyeonNam/Busan';
import KyeongNam from './screens/BusanKyeonNam/KyeongNam';
import JeJu from './screens/JeJu/JeJu';
import Sijang from './screens/SiJang';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Market from './screens/Market';
import City from './screens/City'
import * as firebase from "firebase";

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCipbhAk-bVbgdubYf_lLvRPXsSHFQhZS4",
  authDomain: "bottom-up-project.firebaseapp.com",
  databaseURL: "https://bottom-up-project.firebaseio.com",
  projectId: "bottom-up-project",
  storageBucket: "bottom-up-project.appspot.com",
  messagingSenderId: "109120495683",
  appId: "1:109120495683:web:84487d9538b2de43a5f4f6",
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
// Get a reference to the database service

// 회원가입할때 필요할것
// function writeUserData(userId, name, email, imageUrl) {    
//   firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }

class First extends React.Component {
  render() {

    return (
      <View style={styles.container}>
        <StatusBar Constants = {Constants} />
        <JeonGuk navigation = {this.props.navigation}/>
      </View>
    );
  }
}

const App = createStackNavigator(
  {
    City:{
      screen : City,
      navigationOptions: {
        headerShown: false
      }
    },
    Sijang : {
      screen: Sijang,
      navigationOptions: {
        headerShown: false
      }
    },
    Home: {
      screen: First,
      navigationOptions: {
        headerShown: false
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        headerShown: false
      }
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        headerShown: false
      }
    },
    Market : {
      screen: Market,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    initialRouteName: 'Home' // 처음 보여 줄 화면을 설정합니다.
  },
);

const AppContainer = createAppContainer(App);

export default () => (
  <AppContainer />
);


const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#C2185B',
    height: Constants.statusBarHeight
  },
  container: {
    flex: 1
  }
});