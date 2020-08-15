import React from 'react'
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

const List = ["서울", "경기", "대전", "부산", "강원", "경북", "경남", "광주", "충북", "울산", "충남", "전남", "전북", "제주", "인천", "세종"].sort()

class JeonGuk extends React.Component {
  state = {
    searchString: '',
    menuDialog: false,
  }

  home = () => {
    this.setState({ menuDialog: false });
    this.props.navigation.navigate('Home');
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
      favoriteList = favoriteSnapshot.val();
    }
    this.setState({ menuDialog: false });
    this.props.navigation.navigate('UserInfo', { uid: uid, userName: userName, userID: userID, userPhone: userPhone, favoriteList: favoriteList });
  }
  updateSearch = (text) => {
    this.setState({
      searchString: text
    })
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
  gotoNextView = async(region)=>{
    const uid = this.props.navigation.getParam("uid");
    var tempList = [];
    const snapshot = await database.ref(`Data/${region}`).once('value')
    snapshot.forEach(childSnapshot => {
      var regionData = childSnapshot.child("시군구").val()
      var marketData = childSnapshot.child("시장명").val()
      tempList.push(regionData + "/" + marketData);
    })
    await Promise.all(tempList);
    let resultList = new Set([...tempList])
    this.props.navigation.navigate('City', { name: `${region}`, regionList: [...resultList], uid: uid })
  }
  render() {
    const { searchString } = this.state;
    const uid = this.props.navigation.getParam("uid");

    return (
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
                      <AntDesign name="home" size={30} color="#6466E3" />
                      <Text style={styles.small_text}>홈으로</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dialog_Button} onPress={this.mypage}>
                      <AntDesign name="user" size={30} color="#6466E3" />
                      <Text style={styles.small_text}>마이페이지</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dialog_Button} onPress={this.logout}>
                      <AntDesign name="deleteuser" size={30} color="#6466E3" />
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
              지역 선택
          </Text>
          </View>

          <View style={{ flex: 2 }}>
          </View>

        </View>

        <KeyboardAvoidingView behavior={'height'}>

          <View style={styles.view}>
            <ScrollView>
              {!List.includes(this.state.searchString) ? List.map((region, i) => <GradientButton key={i} style={{ marginVertical: 8, marginLeft: 30 }} text={`${region}`}
                onPressAction={
                  ()=> this.gotoNextView(region)
                } width='80%' deepBlue impact />)
                : <GradientButton key={this.state.searchString} style={{ marginVertical: 8, marginLeft: 30 }} text={this.state.searchString}
                  onPressAction={
                      () => this.gotoNextView(region)
                  } width='80%' deepBlue impact />}
            </ScrollView>
          </View>

          <View style={styles.SearchSpace}>
            <TextInput
              style={styles.input}
              placeholder="지역을 검색하세요"
              onChangeText={this.updateSearch}
              value={searchString}
            />
          </View>
        </KeyboardAvoidingView>
      
      </View>

      </SafeAreaView>

    )
  }
}

export default JeonGuk;