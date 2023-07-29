import React, {Fragment, useState, useEffect, useRef} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, StatusBar, Button, Alert, TextInput, Keyboard, KeyboardAvoidingView  } from 'react-native';
import nice_bike from "./images/nice_bike.jpg";
import { TouchableOpacity  } from 'react-native';
import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";
import stolen_frontwheel from "./images/StolenBike_FrontWheel.jpg";
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
function ValuableInfoScreen(){
    /* setBikeImage */

    const todoRef = firebase.firestore().collection("feedbacks");
    const [ uploading, setuploading ] = useState(null);

    const [image, setImage] = useState(null);
    const navigation = useNavigation(); 
    const [feedBack, setFeedback] = useState("");
    const ifloggedin = firebase.auth().currentUser?.phoneNumber;
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



    <TouchableOpacity style={styles.button} onPress={() => {ifloggedin ? navigation.replace('Profile'): navigation.replace('Login')}}>
        <Text styles={styles.buttontext}>{ifloggedin? "Back to alternatives" : "Back"}</Text>
    </TouchableOpacity>

{/* <!------------ campus----------> */}
<View style = {styles.campus}>
    
    <Text style={{fontSize:25,}}>Bike Info</Text>
    <Text style={{textAlign: "center",}}>{"\n"}Hi!{"\n"} 1. Frame number can be found on the bikes frame{"\n"}{"\n"}2. Always lock your bikes frame onto a fixed object, preferably with a metal lock. Wheels can be easily unscrewed{"\n"}{"\n"}3. Use chain oil at least once every 6 month (especially before freezing temperatures) to minimize frost damage to chain, breakes and lock</Text>
    <Image style={styles.tinyLogo} source={(nice_bike)} />
</View>

<View style={{alignItems: "center", marginBottom:100,}}>
    <Text style={{fontSize:25, marginTop:10,}}>General statistics</Text>
    <View style = {styles.campus}>
        <Text>In Europe one bike is stolen every 20 seconds. That is around 3 million bikes per year. Around 65 000 of these bikes are stolen in Sweden. These bikes are stolen and then sold back to you. Much of the money goes to organised crime members who deal in other illegal environments. </Text>
        <Image style={styles.tinyLogo} source={(stolen_frontwheel)} />
    </View>
    
</View>

</SafeAreaView>


</KeyboardAvoidingView>

</ScrollView>
        );


    }

export default ValuableInfoScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",

    },

    tinyLogo: {
  
        width: 100,
        height: 100,
        alignItems: "center",
        padding: 0,
        marginTop: 40,
        
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
        flex: 0,
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