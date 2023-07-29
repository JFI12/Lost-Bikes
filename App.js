import { StatusBar } from 'expo-status-bar';
import Profile from './pages/profile';
import {useNavigation} from '@react-navigation/core';
import React, {Fragment, useState, useEffect, createContext} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, Button, Alert, TextInput, KeyboardAvoidingView  } from 'react-native';
import { TouchableOpacity  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import styless from "./pages/Stylesheet.js"
import logo from "./pages/images/logo.jpg";
import firebase from 'firebase/compat/app';
import { app } from "./firebase";
import ProfileScreen from "./pages/profilescreen";
import LoginScreen from "./pages/signinscreen";
import UploadBikeScreen from "./pages/uploadBikeScreen";

import SeePublishedBikesScreen from './pages/seePublishedBikesScreen';
import SearchinDataBaseScreen from "./pages/SearchinDataBaseScreen"
import SearchwithCountyScreen from './pages/SearchwithCountyScreen';
import SearchwithmodelScreen from './pages/SearchwithmodelScreen';
import SearchwithLocationandModelScreen from "./pages/SearchwithLocationandModelScreen"
import SearchFrameScreen from './pages/SearchFrameScreen';
import ValuableInfoScreen from './pages/ValueableInfoScreen';
import AboutUsScreen from "./pages/AboutUsScreen";
import { AsyncStorage } from 'react-native';
import AppLoader from './pages/animations/AppLoader';
import {registerRootComponent} from 'expo';
/* import * as SecureStore from 'expo-secure-store'; */
//import auth from "./pages/firebase"
/* import * as firebase from "firebase";

var config = {
apiKey: "AIzaSyB6_XZ8MTo-z_LtShxCAxPhvRSvvwriMgg",
authDomain: "stolen-bikes-5d664.firebaseapp.com",
projectId: "stolen-bikes-5d664",
storageBucket: "stolen-bikes-5d664.appspot.com",
messagingSenderId: "256078269191",
appId: "1:256078269191:web:72401a6a7e4768435cd3a2",
measurementId: "G-EJ4N1CFLJX"
};
firebase.initializeApp(config); */

const Stack = createNativeStackNavigator();
export default function App() {

const [isloading, setisloading] = useState(true)
const [isLoggedin, setisLoggedin] = useState(false )
const AuthContext = createContext();
const retrieve_data = async() => {
  try {

/*     const data = await AsyncStorage.getItem('keepLoggedIn')

        console.log("if true" + data)
        setisLoggedin(data) */

  }
  catch(error) {}

};

useEffect(()=>{
  setisloading(true)
/*   retrieve_data();
  
  console.log("async" +  AsyncStorage.getItem('keepLoggedIn')) */
  setTimeout(()=> setisloading(false),1000);

},[]);

  return (
<>
    {isloading ? <AppLoader/>:(  

      <NavigationContainer>

            <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Alternatives' }}/> 
          <Stack.Screen name="UploadBike" component={UploadBikeScreen} options={{ title: 'Reports' }}/>
          <Stack.Screen name="SeeReports" component={SeePublishedBikesScreen}  options={{ title: 'Reports' }}/>

          <Stack.Screen name="SearchinDataBase" component={SearchinDataBaseScreen}  options={{ title: 'Search' }}/>
          
          <Stack.Screen name="SearchinDataBaseFrame" component={SearchFrameScreen}  options={{ title: 'Frame' }}/>
          <Stack.Screen name="SearchinDataBaseModel" component={SearchwithmodelScreen}  options={{ title: 'Model' }}/>
          <Stack.Screen name="SearchinDataBaseCounty" component={SearchwithCountyScreen}  options={{ title: 'County' }}/>
          <Stack.Screen name="SearchinDataBaseCountyandModel" component={SearchwithLocationandModelScreen}  options={{ title: 'Model and County' }}/>
          
          <Stack.Screen name="AboutUs" component={AboutUsScreen}  options={{ title: 'About Us' }}/>
          <Stack.Screen name="ValuableInfo" component={ValuableInfoScreen}  options={{ title: 'Bike Info' }}/>
          </Stack.Navigator>

{/*       <Stack.Screen name="Profile" component={ProfileScreen}/>  */} 
{/* <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }}/>
<Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="UploadBike" component={UploadBikeScreen} />
      <Stack.Screen name="SearchinDataBase" component={SearchinDataBaseScreen} />
 */}

    </NavigationContainer>
    )}
    </>
  );
}

//navigation.navigate('Profile', { name: 'Jane' })
