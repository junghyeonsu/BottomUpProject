import React from 'react';
import { Text, TextInput, ScrollView, TouchableOpacity, View, KeyboardAvoidingView, Alert, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import GradientButton from 'react-native-gradient-buttons';
import * as firebase from "firebase";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogButton,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import "firebase/database";

import styles from "../design/styles";

console.disableYellowBox = true;
const firebaseConfig = {
  apiKey: "AIzaSyCipbhAk-bVbgdubYf_lLvRPXsSHFQhZS4",
  authDomain: "bottom-up-project.firebaseapp.com",
  databaseURL: "https://bottom-up-project.firebaseio.com",
  projectId: "bottom-up-project",
  storageBucket: "bottom-up-project.appspot.com",
  messagingSenderId: "109120495683",
  appId: "1:109120495683:web:84487d9538b2de43a5f4f6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var database = firebase.database()

class City extends React.PureComponent {
  
  state = {
    searchString: '',
    dataList: [],
    region: [],
    searchreg: [],
    menuDialog:false,
  }
  componentDidMount() {
    var arr = []
    const reg = this.props.navigation.getParam('regionList');
    for (var i = 0; i < reg.length; i++) {
      var region1 = reg[i].split('/')[0];
      arr.push(region1)
    }
    this.setState({
      region: arr
    })
  }

  home = () => {
    this.setState({ menuDialog: false });
    this.props.navigation.navigate('Home');
  }

  back = (e) => {
    this.props.navigation.goBack();
  }

  mypage = async () => {
    var uid = this.props.navigation.getParam("uid");
    const snapshot = await database.ref(`Users/UserInfo/${uid}`).once('value');
    const favoriteSnapshot = await database.ref(`Users/UserInfo/${uid}/favorite/list`).once('value');
    
    var userName = snapshot.val()["name"];
    var userID = snapshot.val()["id"];
    var userPhone = snapshot.val()['phone'];
    var favoriteList = []
    if(favoriteSnapshot.exists && favoriteSnapshot.val() !== null){
      favoriteList = Object.values(favoriteSnapshot.val());
    }
    this.setState({ menuDialog: false });
    this.props.navigation.navigate('UserInfo', { uid: uid, userName: userName, userID: userID, userPhone: userPhone, favoriteList: favoriteList });
  }

  gotoNextView = async (region) => {
    const regionName = this.props.navigation.getParam('name')
    const uid = this.props.navigation.getParam("uid");
    const prevData = region.split('/');
    const testSnapshot = await database.ref().once('value');
    var userTasteDict = testSnapshot.child(`Users/UserInfo/${uid}/taste`).val();
    
    var userTasteList = Object.keys(userTasteDict).map(function (key) {
      return [key, userTasteDict[key]];
    });
    userTasteList.sort(function (first, second) {
      return second[1] - first[1];
    });
    userTasteList = userTasteList.map(function (value, index) { return value[0]; });
    
    var marketList = testSnapshot.child(`Data/${regionName}/${prevData[0]}/${prevData[1]}`).val();
    var resultMarketList = [];
    for(const tasteInfo of userTasteList){
      for (const marketInfo of marketList) {
        var chk = true;
        if (marketInfo["음식태그"].indexOf(tasteInfo) !== -1) {
          for(const result of resultMarketList){
            if (result == marketInfo) {
              chk = false;
            }
          }
          if (chk) {
            resultMarketList.push(marketInfo);
          }
        }
      }
    }

    var favoriteSnapshot = testSnapshot.child(`Users/UserInfo/${uid}/favorite/list`).val();
    if(favoriteSnapshot !== null){
      favoriteSnapshot = Object.values(favoriteSnapshot);
      for(const favoriteInfo of favoriteSnapshot){
        const marketData = favoriteInfo["상가이름"];
        const locData = favoriteInfo["주소도로명"];
        for(const result of resultMarketList){
          if (result["상가이름"] == marketData && result["주소도로명"] == locData) {
            result["선호"] = true;
          }
        }
      }
    }

    var seasonList = ["시장정보","봄","여름","가을","겨울","연중"];
    var specialtyList = [];
    const specialtySnapshot = testSnapshot.child(`Specialty`).val();
    for(const specialtyInfo of specialtySnapshot){
      var regionData = specialtyInfo["시도"];
      var cityData = specialtyInfo["시군구"];
      var marketData = specialtyInfo["시장명"];
      if (regionData == regionName && cityData == prevData[0] && marketData == prevData[1]){
        for(const season of seasonList){
          specialtyList.push(specialtyInfo[`${season}`])
        }  
      } 
    }
    this.props.navigation.navigate('Sijang', { name: `${prevData[1]}`, marketList: resultMarketList,specialtyList:specialtyList, uid: uid })
  }
  logout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
        {
          text: 'Yes', style: 'cancel', onPress: () => {
            this.setState({ menuDialog: false });
            this.props.navigation.navigate('Login');
          }
        },
        { text: 'NO', onPress: () => { }, style: 'cancel' },
      ]
    )
  }

  updateSearch = (text) => {
    this.setState({
      searchString: text
    })
    const reg = this.props.navigation.getParam('regionList');

    var arr = [];
    for (var i = 0; i < reg.length; i++) {
      if (text == this.state.region[i] && this.state.region[i] == reg[i].split('/')[0]) {
        arr.push(reg[i]);
      }
    }
    this.setState({
      searchreg: arr
    })
  }

  render() {
    const { searchString } = this.state;
    const regionName = this.props.navigation.getParam('name')
    const regionList = this.props.navigation.getParam("regionList")

    const uid = this.props.navigation.getParam("uid")
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior={'height'}>
      <SafeAreaView style={{flex : 1}}>
      <View style={styles.container}>
        <View style={styles.TopBar}>

          <View style={{ flex: 2 }}>
            <TouchableOpacity style={styles.TopButton} onPress={() => {
              this.setState({
                menuDialog: true
              });
            }}>
              <AntDesign name="bars" size={25} color="white" />
            </TouchableOpacity>

            <Dialog
              onTouchOutside={() => {
                this.setState({ menuDialog: false });
              }}
              width={0.9}
              visible={this.state.menuDialog}
              dialogAnimation={new ScaleAnimation()}
              onHardwareBackPress={() => {
                console.log('onHardwareBackPress');
                this.setState({ menuDialog: false });
                return true;
              }}
              dialogTitle={
                <DialogTitle
                  title="Menu"
                  hasTitleBar={true}
                  style={{ color: '#6A6F75', fontSize: 24 }}
                />
              }
              actions={[
                <DialogButton
                  text="DISMISS"
                  onPress={() => {
                    this.setState({ menuDialog: false });
                  }}
                  key="button-1"
                />,
              ]}
            >
              <DialogContent>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.dialog_Button} onPress={this.home}>
                      <AntDesign name="home" size={30} color="#799FA7" />
                      <Text style={styles.small_text}>홈으로</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dialog_Button} onPress={this.mypage}>
                      <AntDesign name="user" size={30} color="#799FA7" />
                      <Text style={styles.small_text}>마이페이지</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dialog_Button} onPress={this.logout}>
                      <AntDesign name="deleteuser" size={30} color="#799FA7" />
                      <Text style={styles.small_text}>로그아웃</Text>
                    </TouchableOpacity>

                  </View>

                  <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => {
                      this.setState({ menuDialog: false });
                    }}>
                    <Text style={{ fontSize: 20, color: "#81888F" }}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              </DialogContent>
            </Dialog>

          </View>

          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text style={styles.TopBarText}>
              시장 선택
          </Text>
          </View>

          <View style={{ flex: 2 }}>
            <TouchableOpacity style={styles.TopButton} onPress={this.back}>
              <AntDesign name="back" size={25} color="white" />
            </TouchableOpacity>
          </View>

        </View>

          <View style={styles.view}>
            <ScrollView>
              {!this.state.region.includes(this.state.searchString) ? regionList.map((region, i) => {
                return (
                  <GradientButton 
                  key={i} 
                  style={{ marginVertical: 8, marginLeft: 30 }} 
                  text={region}
                  prev={region} 
                  gradientBegin="#DB9A96"
                  gradientEnd="#DB9A96"
                  onPressAction={() => this.gotoNextView(region)} 
                  width='80%' 
                  />)
              }) : this.state.searchreg.map((region, i) => {
                return (
                  <GradientButton 
                  key={i} style={{ marginVertical: 8, marginLeft: 30 }} 
                  gradientBegin="#DB9A96"
                  gradientEnd="#DB9A96"
                  text={region}
                  prev={region} onPressAction={() => this.gotoNextView(region)} 
                  width='80%'
                  />)
              })}
            </ScrollView>
          </View>

          <View style={styles.SearchSpace}>
            <TextInput
              style={styles.input}
              placeholder="시장을 검색하세요"
              onChangeText={this.updateSearch}
              value={searchString}
            />
          </View>
          
      </View>
      </SafeAreaView>
      </KeyboardAvoidingView>
      
    )
  }
}

export default City;