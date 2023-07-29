import React, {Fragment} from 'react';
import logo from "./images/logo.jpg";
import { StyleSheet, Text, View, Image, Alert, TouchableHighlight} from 'react-native';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity  } from 'react-native';
import {navigation} from "../App.js"
const navLinks = "navLinks"
function showMenu(){
    navLinks.style.right = "0";
    console.log("ok123")

}

function hideMenu(){
    navLinks.style.right = "-200px";
    console.log("ok121323213")
}


function Navbar() {
    return (
        <Fragment>
{/*             <TouchableOpacity onPress={() =>  navigation.navigate('Profile', { name: 'Jane' })}>
              <Image style={styles.tinyLogo} source={(logo)} onPress = {() => Alert.alert('Simple Button pressed')}/>
           
            </TouchableOpacity> */}
                <View className = "nav-links" id="navLinks">
                    <View className="fa fa-times" onClick={hideMenu}></View>
                        <Text style={{color: 'blue'}}
                            onPress={() => Linking.openURL('./asd')}>
                                Home
                        </Text>
               
                    </View>

                <View className="fa fa-bars" onClick={showMenu}></View>
    
        </Fragment>
    );
  }

  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    tinyLogo: {
      width: 66,
      height: 58,
      bottom: '-5%',
      left: '5%',
      right: 0,
    },

    logo: {
      width: 66,
      height: 58,
    },
  });



  
  export default Navbar;