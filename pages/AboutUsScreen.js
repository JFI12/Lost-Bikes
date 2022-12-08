import React, {Fragment, useState, useEffect, useRef} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, StatusBar, Button, Alert, TextInput, Keyboard, KeyboardAvoidingView  } from 'react-native';
import { TouchableOpacity  } from 'react-native';
import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";
import skyrimman from "./images/skyrimman.jpg";
import Theif from "./images/theif.jpg";
import { NavigationContainer } from '@react-navigation/native';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {useNavigation} from '@react-navigation/core';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { ActivityIndicator } from 'react-native';
/* import styles from './style'; */
/* import * as Progress from "react-native-progress"; */
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import {navigation} from "../App.js"
import { auth } from '../firebase.js'
import "./bikesapi";

/* function useChange() {
    const [uploading, setUploading] = React.useState(null);
    function change(value) {
        setUploading(value);
    }
  
    return { change, uploading };
  } */
function AboutUs(){
    /* setBikeImage */

    const todoRef = firebase.firestore().collection("feedbacks");
    const [ uploading, setuploading ] = useState(null);

    const [image, setImage] = useState(null);
    const navigation = useNavigation(); 
    const [feedBack, setFeedback] = useState("");
/* useEffect(() => {
    (async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === "granted");
    }); 
 }, []); */





const pickImage = async () => {
    setuploading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
        
    });
    const source = {uri: result.uri}; 
    console.log(source);
    setImage(source);
    setuploading(false);
};

const uploadImage = async () => {

    setuploading(true);
    const response = await fetch(image.uri)
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf("/")+1)
    var ref = firebase.storage().ref().child(filename).put(blob);

    try {
        await ref;

    } catch (e) {
        console.log(e)
    }
    setuploading(false);
    Alert.alert(
        "Photo uploaded.....!!"
    );
    setImage(null);
};



/* 
if (hasGalleryPermission === false){
    return <Text>No access to internal storage</Text>
} */

const UploadProgress = ({progress}) => {
return(




    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
        <Progress.Bar progress={progress} width={200}/>
    </View>
);
};
const phoneNumber = firebase.auth().currentUser?.phonenumber;
const PublishFeedback=()=>{
    console.log("ok")
    
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const data = {

    createdAt: timestamp,
    feedback: feedBack,
    phonenumber: phoneNumber,
    
    };
    console.log(data)
    
    todoRef
    .add(data)
    .then(() => {
        //release the new field state
        setFeedback("");
        //release keyboard
        Keyboard.dismiss();

    })

    .catch((error) => {
        alert(error);
    })
/*         console.log(data) */
}




    return(

<ScrollView>
    <KeyboardAvoidingView>
<SafeAreaView style={styles.container}>


{/* 
    <View style={{flex:1, justifyContent:'center', marginBottom: 1000}}>
        <Button title="Pick Image" onPress={pickImage} style = {{marginTop: 30}}  />
        {image1 && <Image source={{uri: image1}} style={{flex:1/2}}/>}
    </View> */}



    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Profile')}>
        <Text styles={styles.buttontext}>Back to alternatives</Text>
    </TouchableOpacity>

{/* <!------------ campus----------> */}
<View style = {styles.campus}>
    
    <Text style={{fontSize:25,}}>About Us</Text>
    <Text style={{textAlign: "center",}}>{"\n"}Hi!{"\n"} I am happy you're using this app to prevent crimes where bikes are being stolen and then sold back to the victims neighbors.{"\n"}{"\n"}While studying at the university I got three bikes and two bike lights stolen during just three years. That is how I got the idea to make this app.{"\n"}{"\n"}What do you think about this app so far? Please share your thoughts below!</Text>

</View>

<View style={{alignItems: "center", marginBottom:300,}}>
    <Text style={{fontSize:25, marginTop:10,}}>Share thoughts</Text>
    <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            value={feedBack}
            placeholder="Type feedback"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setFeedback(text)}
          />
{/*           <View style={styles.TextInputphone}>
            
            <Text style={{color: "#003f5c"}}>Sent from: {firebase.auth().currentUser?.phoneNumber} </Text>

          </View> */}
          <TouchableOpacity style={styles.sendVerification} onPress={() => PublishFeedback()}>
            <Text style={styles.buttonText}>
                Publish feedback
            </Text>
          </TouchableOpacity>
          
    </View >
</View>

</SafeAreaView>


</KeyboardAvoidingView>

</ScrollView>
        );


    }

export default AboutUs;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",

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

      
  buttontext: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
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

    sendVerification: {
    padding: 20,
    backgroundColor: "#3498db",
    borderRadius: 10,
    },

    setFontSizeOne: {
    fontSize: 15 // Define font size here in Pixels
    },

    setFontSizeOne_white: {
        
        fontSize: 15, // Define font size here in Pixels
        color: 'white',

        },

    setFontSizeThree: {
        fontSize: 25, // Define font size here in Pixels
    },

    setFontSizeThree_white: {
        fontSize: 25, // Define font size here in Pixels
        color: 'white',
    },

    setFontSizeFour: {
        fontSize: 30 // Define font size here in Pixels
    },


    course: {
      flex: 100,
      backgroundColor: '#fff',
      alignItems: 'right',
      justifyContent: 'left',
    },

    header: {
      flex: 100,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      image: "./images/skyrimman.jpg",
      position: 'relative',
    },

    image: {

    width: '100%', 
    height: '100%',
    flex: 10,
    resizeMode: 'stretch', // or 'stretch'

      },

    scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
    },   

    text_box: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: 15,
        margin: '2%',
 
    },

    course_row: {
        padding: 20,
        margin: '5%',
        borderRadius: 10,
        backgroundColor: "#fff3f3",
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

    },

    onpress: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 2, // Android
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',


    },

    campus: {
        flex: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: '2%',
        borderRadius:10,
    },

    campus_row: {
        flex: 0,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: '2%',
   
 
    },
    bikelogo: {
        width: 200,
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "red",

  

      },

      buttoncontainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: "center",
        justifyContent: "center",
      },

      selectButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
      },
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",

      },

      buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",

        
      },

    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: "center",
        justifyContent: "center",


    },

});