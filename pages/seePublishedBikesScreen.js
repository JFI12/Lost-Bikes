import React, { Component, Fragment, useEffect, useState } from 'react'
import {StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Keyboard, Pressable, FlatList, SnapshotViewIOS, VirtualizedList} from 'react-native'
import {ListItem} from "react-native-elements";
import { auth } from '../firebase.js'
import Profile from './profile';
import AppLoader from './animations/AppLoader';
import {ImageBackground, Image, SafeAreaView, StatusBar, Button, Alert, TextInput  } from 'react-native';
import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";
import skyrimman from "./images/skyrimman.jpg";
import Theif from "./images/theif.jpg";
import { NavigationContainer } from '@react-navigation/native';
import { getStorage, uploadBytes, getDownloadURL, connectStorageEmulator,ref } from "firebase/storage";
import { onValue, set, update, remove } from "firebase/database";
import {firebase, db} from "../firebase";
import DeviceNumber from "react-native-device-number"
import {useNavigation} from '@react-navigation/core'; 
import { ActivityIndicator } from 'react-native';
/* import styles from './style'; */
/* import * as Progress from "react-native-progress"; */
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { FrameNumbersRef } from '../firebase.js';
import { async } from '@firebase/util';
import { deleteUser } from 'firebase/auth';
import { setDoc, doc, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import deleteitemimg from "./images/deleteitem.jpg"
import uuid from 'react-native-uuid';
import { setDefaultEventParameters } from 'firebase/analytics';
const SeePublishedBikesScreen = () => {
    const [users, setUsers] = useState([]);
    const [usersimages, setUsersimages] = useState(new Array());
    const todoRef = firebase.firestore().collection("users");
    const phoneNumber = firebase.auth().currentUser?.phoneNumber
    const navigation = useNavigation();
    const [ uploading, setuploading ] = useState(null);
    const [url, setUrl] = useState();
const getImageList = async(imagefilename, imageList, indexCounter)=>{

  const storage = getStorage()

  console.log("/" + imagefilename)


      const reference =  ref(storage, imagefilename);

  console.log("okkkkkkkkkkkkkkkej!!!!!!!!!!!!!!!!!!")


  
  await getDownloadURL(reference).then((x)=> {
    console.log("/" + "ok2" + x)
      imageList[indexCounter]=(x)  

      setUrl(x)
return x

  })
    
}

const [postsPerLoad]=React.useState(20);
useEffect(() => {
  const localusers= new Array()
  const imageList = new Array()
  const ImageListlocal = []
  firebase.firestore()
  .collection('users')
  // Filter results set to lower case
  .where('phonenumber', "==", phoneNumber).limit(postsPerLoad)
  .get()
  .then(querySnapshot => {
    var indexCounter=0 



    querySnapshot.forEach(documentSnapshot => {
      console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      const {model, phonenumber, framenumber, lastlocation, imagefilename, createdAt} = documentSnapshot.data()
      if (imagefilename){

        getImageList(imagefilename, ImageListlocal, indexCounter)
    
      }
      else{
        ImageListlocal[indexCounter] = (logo)
      }
      localusers.push({
      id: documentSnapshot.id,
      phonenumber,
      framenumber,
      lastlocation,
      imagefilename,
      model,
      createdAt,
    })
    indexCounter = indexCounter + 1
  })


  })




    setUsers(localusers)
    console.log("listus" + ImageListlocal)
    console.log("ok1")
    console.log(users)
    setUsersimages(ImageListlocal) 

  
  }, [])


const deleteItem=(framenumberitemindex) =>{
console.log(framenumberitemindex)

  deleteDoc(doc(db, "users", users[framenumberitemindex].id), {

  }).then(() => {
    console.log("data submitted5");
  }).catch(() => {
    console.log(error);
  })

  if (users[framenumberitemindex].filename){
    let imageRef = storage.refFromURL(usersimages[framenumberitemindex]);
    imageRef.delete()
    console.log("image deleted aswell")
  }

      navigation.replace("Profile")  
      navigation.replace("SeeReports") 


} 




function renderPosts({item, index}) {


    console.log("wholeusersimages" + usersimages)
    console.log("userimage" + usersimages[index])

  return(

        
    <ListItem key={item.id} button style={{alignItems: "center"}}>
      
    <View style={styles.container_getData}>
      
      <View style={styles.innerContainer}>
      <Text style={styles.itemHeading}>
          Published: {item.createdAt?.toDate().toString().slice(0,24)}
        </Text>
        <Text style={styles.itemHeading}>
          Framenumber: {item.framenumber? item.framenumber: "not submitted"}
        </Text>
        <Text style={styles.itemText}>
          Model: {item.model? item.model: "not submitted"}
        </Text>
        <Text style={styles.itemText}>
        Contact with: {item.phonenumber}
        </Text>

        <Text style={styles.itemText}>
        Last seen location: {item.lastlocation? item.lastlocation: "not submitted"}
        </Text> 
{/*         <Text style={styles.itemText}>
        image: {item.imagefilename? item.imagefilename: "not submitted"}
        </Text>  */}


        <Image source= {usersimages[index]==logo?(logo): {uri: usersimages[index]}} style={{width: 300, height:300, margin: 10,}}/>
      </View>
      
      <TouchableOpacity style={styles.sendVerificationimg} onPress={ ()=>deleteItem(index)}>
        <Image source={deleteitemimg} resizeMode="stretch" style={styles.tinyLogo}/>
      </TouchableOpacity>

    </View>

  </ListItem> 



  );

}
   
return(
  <SafeAreaView>
    <FlatList
    ListHeaderComponent={
      <>
          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Profile')}>
              <Text styles={styles.buttontext}>Back to alternatives</Text>
            </TouchableOpacity>
          </View>

    </>}
      nestedScrollEnabled
      data= {users}

      renderItem={renderPosts} 
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      />
      
      {uploading? <AppLoader/>: null}
  </SafeAreaView>
);
}
export default SeePublishedBikesScreen

const styles = StyleSheet.create({
    container_scroll: {
      flex: 1,
      marginBottom: 30,
  
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
  
    },
  
    container_getData: {
      backgroundColor: "#e5e5e5",
      padding: 15,
      borderRadius: 15,
      margin: 5,
      marginHorizontal: 10,
      alignItems: "center"
    },
  
  
  
    container_sms: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
  
    },
    imageContainer: {
      backgroundColor: '#fff',
      width: '60%',
    
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
  
    innerContainer: {
      flexDirection: "column",
      alignItems: "center",
    },
    itemHeading: {
      fontWeight: "bold",
    },
    itemText: {
      fontWeight: "300",
    },  
    uploadButton:{
      backgroundColor: '#0782F9',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
  
    },
    button: {
      backgroundColor: '#0782F9',
      width: '60%',
  
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 30,
  },
    
  selectButton: {
  
    width: "60%",
    padding: 10,
    backgroundColor: '#0782F9',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
    tinyLogo: {
      width: 50,
      height: 50,
  
      padding: 10,
      justifyContent: "center",
  
    },
    image: {
      marginTop: 0,
      width: 100,
      height: 80,
      padding: 10,
      marginBottom: 40,
    },
    text_box_white: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    
      padding: 15,
      margin: '2%',
      color: "white",
  },
  
  text_box: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    margin: '2%',
  
  },
  
  buttoncontainer: {
  width: "60%",
  justifyContent: "center",
  alignItems: "center",
  padding: 10,
  
  },
  
  inputView: {
    width: "80%",
  
  },
  
  TextInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10, 
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    marginTop: 5,
  },
  
  TextInputphone: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10, 
    height: 45,
    marginBottom: 20,
    marginTop: 5,
  },
  
  
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  
  loginText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  
  },
  
  loginBtn: {
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#0782F9',
  },
  
  buttonoutline: {
    backgroundColor: 'white',
    borderColor: '#0782F9',
    borderWidth: 2,
    marginTop: 5,
  },
  
  buttonoutlinetext: {
    color: '#0782F9',
    bordercolor: '#0782F9',
    fontSize: 16,
    fontWeight: "700",
  },
  
  
  sendVerification: {
    padding: 20,
    backgroundColor: "#3498db",
    borderRadius: 10,
  },
  
  sendVerificationimg: {
    width: "50%",
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
   
  
  },
  
    sendCode: {
      padding:20,
      backgroundColor:"#9b59b6",
      borderRadius: 10,
    },
  
    buttonText: {
      textAlign: "center",
      color: "#fff",
      fontWeight: "bold",
  
  
    },
  
    
    buttontext: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
  },
  
  
    optText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      margin: 20,
    },
  
  
  });