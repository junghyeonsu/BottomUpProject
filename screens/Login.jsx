import React, { Component }  from 'react';
import { SearchBar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,

} from 'react-native';
import { Button } from 'react-native-elements'

class Sijang extends Component {

  state = {
    search: '',
    menuDialog: false,
    ID : '',
    Password : ''
  };

  updateId = (id) => {
    this.setState({ID : id})
  }
  updatepas = (pas) => {
    this.setState({Password : pas})
  }
  
  test = () => {
    this.props.navigation.goBack();
  }


  render() {

    const { search } = this.state;

    const renderItem = ({ item }) => (
      <Item name={item.name} subname={item.subname} icon={item.icon} />
    )
    
    return (
      <View style={styles.container}>
        <View style={styles.TopBar}>
          <View style={{flex: 2}}>
           
          </View>
            
          <View style={{flex: 3, alignItems: 'center'}}>
            <Text style={styles.TopBarText}>
              로그인
            </Text>
          </View>
            
          <View style={{flex: 2}}>
            <TouchableOpacity style={styles.TopButton} onPress={this.test}>
              <AntDesign name="back" size={30} color="white" />
            </TouchableOpacity>
          </View>
          
        </View>
        
        <View style={styles.MainSpace}>
          <View>
          <SearchBar
            showCancel
            round
            lightTheme
            placeholder="아이디"
            containerStyle={{width:'85%',marginLeft:'7.5%',marginBottom :'5%'}}
            onChangeText={this.updateId}
            value={this.state.ID}
          />
          <SearchBar
            showCancel
            round
            lightTheme
            placeholder="비밀번호"
            containerStyle={{width:'85%',marginLeft:'7.5%',}}
            onChangeText={this.updatepas}
            value={this.state.Password}
          />
          </View>

          <View style={{flexDirection : 'row'}}>
          <Button style={{width:83,marginLeft:33,marginTop:15}} titleStyle={{color: "white",fontSize: 15,}} 
          buttonStyle={{backgroundColor: "gray",height: 50,}} title='로그인' />
          <Button style={{width:83,marginLeft:30,marginTop:15}} titleStyle={{color: "white",fontSize: 15,}} 
          buttonStyle={{backgroundColor: "gray",height: 50}} title='회원가입'
          onPress = {() => {this.props.navigation.navigate('SignUp')}} />
          <Button style={{width:83,marginLeft:30,marginTop:15}} titleStyle={{color: "white",fontSize: 15,}} 
          buttonStyle={{backgroundColor: "gray",height: 50}} title={`아이디/비밀번호찾기`} />
          </View>
        </View>

        <View style={{height: 20}}></View>

       
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  TopBar: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#81888F',
    flexDirection: 'row'
  },

  TopBarText: {
    fontSize: 33, 
    marginTop: 25,
    color: 'white'
  },

  input :{
    alignItems: 'center',
    width : 60,
  },

  MainSpace: {
    height: 545,
    backgroundColor: '#E8EAEB',
    paddingTop : 50
  },

  SearchSpace: {
    height: 100,
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15
  },

  TopButton: {
    alignItems: 'center',
    backgroundColor: '#6A6F75',
    padding: 10,
    width : 50,
    height : 50,
    marginLeft: 20,
    marginRight: 40,
    marginTop: 70,
    marginBottom: 40
  },

  StatusButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 20,
    width: 30,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },

  item_view: {
    backgroundColor: '#DDDDDD',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 120
  },

  item_title: {
    marginTop: 8,
    fontSize: 24,
  },

  item_subtitle: {
    fontSize: 14,
  },

  item_icon: {
    height: 20,
    width: 20,
    padding: 20,
    marginRight: 20
  },

  menu_dialogContentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  menu_dialog_button: {
    width: '40%',
    height: 30,
  },

  dialog_Button: {
    alignItems: 'center',
    backgroundColor: '#6A6F75',
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 20,
    flex: 1
  },

})


export default Sijang;