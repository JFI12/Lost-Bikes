import React, { Component, Fragment, useEffect, useState } from 'react'
import {StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Keyboard, Pressable, FlatList, SnapshotViewIOS, VirtualizedList, TouchableWithoutFeedback, Switch} from 'react-native'

import { auth } from '../firebase.js'
import Profile from './profile';
import AppLoader from './animations/AppLoader';
import {ImageBackground, Image, SafeAreaView, StatusBar, Button, Alert, TextInput  } from 'react-native';

import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";
import { NavigationContainer } from '@react-navigation/native';
import { getStorage, uploadBytes,ref,getDownloadURL } from "firebase/storage";
import { onValue, set, update, remove } from "firebase/database";
import {firebase, db} from "../firebase";
import DeviceNumber from "react-native-device-number"
import {useNavigation} from '@react-navigation/core';
import { ActivityIndicator } from 'react-native';
/* import styles from './style'; */
/* import * as Progress from "react-native-progress"; */
import {Left, Header, Item, H3, Title, Body} from "react-native";
import {ListItem} from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { FrameNumbersRef } from '../firebase.js';
import { async } from '@firebase/util';
import { deleteUser } from 'firebase/auth';
import { setDoc, doc, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
/* import { firestore } from 'react-native-firebase'; */
/*  import { firestore } from 'react-native-firebase';  */
/* import {phoneNumber} from "./signinscreen"; */

const SearchwithCountyScreen = () => {

const navigation = useNavigation();

const ifloggedin = firebase.auth().currentUser?.phoneNumber
const [searchModeltext, setSearchModeltext] = useState("")
const [searchlocationText, setSearchlocationText] = useState("")
const [ModelStartAfter, setModelStartAfter] =  React.useState(Object)
const [modelPosts, setModelPosts] = React.useState(new Array())
const [modeltoggle, setModeltoggle] = useState(false) 
const [lastModelPost, setLastModelPost] = useState(false)
const [firstModelsearch, setFirstModelsearch] = useState(true)
const [modelSearchImageList, setModelSearchImageList] = React.useState([])
const [indexModelCounterGlobal, setIndexModelCounterGlobal ] = React.useState(0)


const [postsPerLoad]=React.useState(5);



const [url, setUrl] = useState()
const getImageList = async(imagefilename, imageList, indexCounter)=>{

const storage = getStorage()

console.log("/" + imagefilename)


    const reference =  ref(storage, imagefilename);

console.log("okkkkkkkkkkkkkkkej!!!!!!!!!!!!!!!!!!")



await getDownloadURL(reference).then((x)=> {

    imageList[indexCounter]=(x)  
    
    setUrl(x) 
    console.log("/" + "ok2"+imageList)
    return x
})

}


const fetchModelPosts = async(ModelStartAfter, postsPerLoad)=>{

    var modelSearchImageListlocal = []
    const modelPosts = new Array();

    var indexCounter = 0
    const querySnapshot = await firebase.firestore().collection("users").where('model', "==", searchModeltext.toLowerCase()).where('lastlocation', "==", searchlocationText.toLowerCase()).limit(postsPerLoad).orderBy("createdAt", "desc").get();
    console.log( "okkkkkkkkkkkkkkkk1")
    setFirstModelsearch(false)
    querySnapshot.forEach(documentSnapshot => {
            console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
            const {model, phonenumber, framenumber, lastlocation, imagefilename, createdAt} = documentSnapshot.data()



            modelPosts.push({
            id: documentSnapshot.id,
            model,
            phonenumber,
            framenumber,
            lastlocation,
            imagefilename,
            createdAt,
            })
            if (imagefilename){
            getImageList(imagefilename, modelSearchImageListlocal, indexCounter)   
            }
            else{
            modelSearchImageListlocal[indexCounter]=(logo)
            } 
            indexCounter = indexCounter + 1
        }
    )
    setResetModelSearch_bool(true)
    setModelSearchImageList(modelSearchImageListlocal)
    setIndexModelCounterGlobal(indexCounter)
    const model_lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]
    console.log( "ok2")
    console.log( model_lastVisible)
    return {modelPosts, model_lastVisible };


    
}

 


const SearchforBikeinFirebaseModel = async()=>{


    if (firstModelsearch && searchModeltext.length>1){
    setFirstModelsearch(false)

    console.log("startafter: " + ModelStartAfter)
    const model_postsData = await fetchModelPosts(ModelStartAfter, postsPerLoad );

    setModelStartAfter(model_postsData.model_lastVisible )

    setModelPosts([...modelPosts, ...model_postsData.modelPosts]);
    console.log("modeposts" + model_postsData.modelPosts)
/*     model_postsData.modelPosts.length==0? setLastModelPost(true):setLastModelPost(false);
} */

}

}

const [resetModelSearch_bool, setResetModelSearch_bool] = useState(false)
const resetModelSearch=()=>{

    if (resetModelSearch_bool)
    {
        setModelPosts(new Array())
        setModelStartAfter(Object)
        setFirstModelsearch(true)
        setModelSearchImageList([])
        setResetModelSearch_bool(false)
        setLastModelPost(false)
    }

}

const fetchMoreModelPosts=async(ModelStartAfter, postsPerLoad )=>{
//SET TILL LOWER CASE I SEARCH WHERE FUNKTIONEN!!!!!!!!!!!!
const modelPosts = new Array();
var indexCounterlocal = indexModelCounterGlobal
var fetchmoreimageList = modelSearchImageList
const querySnapshot = await firebase.firestore().collection("users").where('model', "==", searchModeltext.toLowerCase()).limit(postsPerLoad).orderBy("createdAt", "desc").startAfter(ModelStartAfter).get();

querySnapshot.forEach(documentSnapshot => {
    console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    const {model, phonenumber, framenumber, lastlocation, imagefilename, createdAt} = documentSnapshot.data()



    modelPosts.push({
    id: documentSnapshot.id,
    model,
    phonenumber,
    framenumber,
    lastlocation,
    imagefilename,
    createdAt,
    })
    if (imagefilename){
    getImageList(imagefilename, fetchmoreimageList, indexCounterlocal)   
    }
    else{
    fetchmoreimageList[indexCindexCounterlocalounter]=(logo)
    } 
    indexCounterlocal = indexCounterlocal + 1

}
)
setIndexModelCounterGlobal(indexCounterlocal)
setModelSearchImageList(fetchmoreimageList)
console.log(indexCounterlocal)
const model_lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]
return {modelPosts, model_lastVisible };
}

const getMoreModelPosts=async()=>{

if (!lastModelPost){
    console.log("startafter: " + ModelStartAfter)
    const model_postsData = await fetchMoreModelPosts(ModelStartAfter, postsPerLoad );

    setModelStartAfter(model_postsData.model_lastVisible )

    setModelPosts([...modelPosts, ...model_postsData.modelPosts]);
    console.log("modeposts" + model_postsData.modelPosts)
    model_postsData.modelPosts.length==0? setLastModelPost(true):setLastModelPost(false);
}


}


function renderPosts({item, index}){
    var imageListinRender = []
  

    imageListinRender=modelSearchImageList

/* 
  else{
    imageListinRender=imageList
  }  */
  
    return (
  
      <ListItem key={item.postId} button style={{alignItems: "center"}}>
        
        <View style={styles.container_getData}>
          
          <View style={styles.innerContainer}>
          <Text style={styles.itemHeading}>
              Published: {item.createdAt?.toDate().toString().slice(0,21)}
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
            <Image source= {imageListinRender[index]==logo?(logo): {uri: imageListinRender[index]}} style={{width: 300, height:300}}/>
          </View>
          
        </View>
      </ListItem>
  
  
    );
  
  }
  
  const DismissKeyboardHOC = (Comp) => {
    return ({ children, ...props }) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Comp {...props}>
          {children}
        </Comp>
      </TouchableWithoutFeedback>
    );
  };
  const DismissKeyboardView = DismissKeyboardHOC(View)
      

return (
<SafeAreaView >
< FlatList 
ListHeaderComponent={
  <>
        <DismissKeyboardView>
            <View style={styles.container} >
            
            <TouchableOpacity style={styles.buttonBack} 
                onPress={() => {navigation.replace('SearchinDataBase')}}>
            
            
                <Text styles={styles.buttontext}>{ "Back"}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.container}>
            
            {/*           <Text>Email: {auth.currentUser?.email}'s profile</Text> */}
                <Text style={{fontSize:35}}>TIP: </Text><Text style={{fontSize:20}}>Upper/lower case letters do not matter</Text>

            </View>

        </DismissKeyboardView>

        <View style={styles.container}>


            <TextInput
            style={styles.TextInput}
            placeholder="Search with model"
            value={searchModeltext}
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {setSearchModeltext(text), resetModelSearch()}
            
            }

            />

            <TextInput
            style={styles.TextInput}
            placeholder="Search with county"
            value={searchlocationText}
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {setSearchlocationText(text), resetModelSearch()}
            
            }
            />
            

            <TouchableOpacity style={styles.button} 
            onPress={() => {  Keyboard.dismiss(), SearchforBikeinFirebaseModel()}}>
            
            
                <Text styles={styles.buttontext}>{"Search with model"}</Text>
            </TouchableOpacity>
        </View>
    </>
}
 
            
    nestedScrollEnabled
    data= {modelPosts}
    
    renderItem={renderPosts} 
    keyExtractor={(item, index) => index.toString()}
    showsVerticalScrollIndicator={false}
    onEndReached={getMoreModelPosts}
    onEndReachedThreshold={0.01}
    scrollEventThrottle={150}
    ListFooterComponent = {modelPosts.length>0?  (!lastModelPost && < ActivityIndicator size="small" color="#0000ff" />) : (<View style={{alignItems: "center"}}><Text style={{fontSize: "25"}}>No bikes recieved</Text></View>)}

        
    />



{/* {imageWaiting ? <AppLoader/>: null}   */}
</SafeAreaView>
    );
}

export default SearchwithCountyScreen
const styles = StyleSheet.create({
  container_scroll: {


  },
  container: {

    alignItems: "center",
    justifyContent: "center",

  },

  container_getData: {
    backgroundColor: "#e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,

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
    marginTop: 100,
    marginBottom: 30,
  },

  innerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  buttonBack: {
    backgroundColor: '#0782F9',
    width: '35%',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',

    marginBottom: 16,
},
  
  button: {
    backgroundColor: '#27c8f5',
    width: '60%',

    padding: 15,
    borderRadius: 10,
    alignItems: 'center',

    marginBottom: 16,
},
  
selectButton: {

  width: "60%",
  padding: 10,
  backgroundColor: '#0782F9',
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 40,
  marginBottom: 30,
},
  tinyLogo: {
    width: "60%",
    height: "20%",
    alignItems: "center",
    padding: 0,
    marginTop: 40,
    
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
marginTop: 40,
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
  width: 300,
  justifyContent: "center",
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
