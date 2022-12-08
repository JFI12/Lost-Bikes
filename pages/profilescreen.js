import React, { Component, Fragment, useState } from 'react'
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'

import { auth } from '../firebase.js'
import Profile from './profile';
import AppLoader from './animations/AppLoader';
import {ImageBackground, Image, SafeAreaView, StatusBar, Button, Alert  } from 'react-native';
import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";
import dogguard from "./images/dogguard.jpg";
import Theif from "./images/theif.jpg";
import personphonebike2 from "./images/personphonebike.jpg";
import { NavigationContainer } from '@react-navigation/native';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { ActivityIndicator } from 'react-native';
/* import styles from './style'; */
/* import * as Progress from "react-native-progress"; */
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { AsyncStorage } from 'react-native';










const ProfileScreen = ({ navigation, route }) => {

 /*    AsyncStorage.setItem("keepLoggedIn", JSON.stringify(true)) */
    const data =     AsyncStorage.getItem("keepLoggedIn")

    console.log("profile:"+ data )
 
    const setasynclogout = async()=>{
        AsyncStorage.setItem("keepLoggedIn", "")  
        const data = await AsyncStorage.getItem('keepLoggedIn')

        console.log("if true" + data)
        navigation.replace("Login"),1000
        

    } 
    
    const handleSignOut = () => {
         setasynclogout()  
/*         AsyncStorage.setItem("keepLoggedIn", "") 
        console.log("123profile:"+ AsyncStorage.getItem("keepLoggedIn"))
        navigation.replace("Login") */


        auth.signOut().then(() => {


          /*   navigation.replace("Login") */
       /*      AsyncStorage.setItem("keepLoggedIn", "") */
        }).catch(error => alert(error.message))

    }

    const handleUploadBike = () => {
         
        navigation.replace("UploadBike")


    }

    const handleSearchforBike = () => {

        navigation.replace("SearchinDataBase")

    }
    const handleSeeReports = () => {

        navigation.replace("SeeReports")

    }

    const handleAboutUs = () => {
        navigation.replace("AboutUs")
    }
    
    const handleValuableInfo = () => {
        navigation.replace("ValuableInfo")
    }
    
/*     ComponentDidMount=() => {
        const reference = database().ref("/User");
        reference.on("value", snapshot => {
            console.log("User data: ", snapshot.val());
            this.setState({
                name: snapshot.val(),

            });
        });
    } */


    const [ uploading, setuploading ] = useState(null);

    const [image, setImage] = useState(null);

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
    setuploading(false);
    setImage(source);
};

const uploadImage = async () => {

    {image ? setuploading(true): null}  
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




    return (
<Fragment>
<ScrollView style={styles.container_scroll}>
    <View style={styles.container}>


        <View style={{fontSize: 25, marginTop: 20}}> 
            <Text style={{fontSize: 25, marginTop: 20}}>
                {firebase.auth().currentUser?.phoneNumber }'s profile 
            </Text>
        </View>
  
{/*         <Text>Email: {auth.currentUser?.email}'s profile</Text> */}
        <TouchableOpacity style={styles.button}
        onPress={handleSignOut}>

        
        <Text styles={styles.buttontext} >Sign out</Text>
        </TouchableOpacity>
    </View>

{/*     <View style={styles.buttoncontainer}>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
    </View>
    
        <View style={styles.imageContainer}>
            {image && <Image source= {{uri: image.uri}} style={{width: 300, height:300}}/>}
            <TouchableOpacity style={styles.uploadButton} onPress={(uploadImage) } >

                
                <Text style={styles.buttonText}>Upload image</Text>
            </TouchableOpacity>

        </View> */}

        <View style={styles.header}>
            <ImageBackground source={personphonebike2} style={styles.image} > 

                <TouchableOpacity onPress={() =>  navigation.replace('AboutUs')}>
                    <Image style={styles.tinyLogo} source={(logo)} />
                </TouchableOpacity>

                <View style={styles.text_box}>
                    <Text style={[styles.setFontSizeThree_white]} >App alternatives</Text>
                    <Text style={[styles.setFontSizeOne_white]}>{"\n"}1. Register the stolen or abandoned bikes{"\n"}{"\n"}2. Search for bikes in this database </Text>
    {/*                     <Button title="Press me" onPress={() => Alert.alert('Simple Button pressed')} /> */}
                </View>
            </ImageBackground >

        </View>



{/* <!------------Rules----------> */}
<View style={styles.text_box}>
    <Text style={[styles.setFontSizeThree]}>Find bike</Text>
    <Text> Use the app whenever you buy a used bike to check if it is previously stolen! </Text>
    

    <View className="row">

        <View style={styles.course_row}>
        <TouchableOpacity onPress={handleUploadBike}>

            <Text style={[styles.setFontSizeThree]} >Report lost bike</Text>
{/*             <Text>{"\n"}Connect phone number and/or email to recieve notifications</Text> */}
        </TouchableOpacity>
        </View>

        <View style={styles.course_row}>
        <TouchableOpacity onPress={handleSearchforBike}>
                <Text style={[styles.setFontSizeThree]}>Search in database</Text>
                <Text></Text>
        </TouchableOpacity>
        </View>

        <View style={styles.course_row_color}>
        <TouchableOpacity onPress={handleSeeReports}>
                <Text style={[styles.setFontSizeThree]}>Published reports</Text>
                <Text></Text>
        </TouchableOpacity>
        </View>

        <View style={styles.course_row_color}>
        <TouchableOpacity onPress={handleValuableInfo}>

                <Text style={[styles.setFontSizeThree]}>Valuable Info</Text>
                <Text></Text>

        </TouchableOpacity>
        </View>
        <View style={styles.course_row_color}>
        <TouchableOpacity onPress={handleAboutUs}>

                <Text style={[styles.setFontSizeThree]}>About Us</Text>
                <Text>{"\n"}Very nice button</Text>

        </TouchableOpacity>
        </View>
    </View>
{/* <!--------footer-------> */}

    <Text style={[styles.setFontSizeFour]}></Text>
    <View><Text>{"\n"}</Text></View>
    <View className="icons">
        <View className="fa fa-facebook"></View>
        <View className="fa fa-twitter"></View>
        <View className="fa fa-instagram"></View>
        <View className="fa fa-linkedin"></View>
    </View>
    <View><Text>  </Text>
    <View className="fa fa-heart-o"></View> 
    <Text></Text></View>




</View>



{/*         <Profile/> */}


    </ScrollView>
{/*     <View style={styles.profilebar}>
        <Text style={{color:"black", fontSize: 15}}>
            @Stolen Bikes
        </Text>
    </View> */}
    {uploading ? <AppLoader/>: null}  

</Fragment>

    )
  }

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },

    profilebar: {
        alignItems: "baseline",
    },

    buttontext: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    tinyLogo: {
        width: 66,
        height: 58,
        bottom: '-5%',
        left: '5%',
        right: 0,
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
        marginTop: 14,
    },

    image: {

    width: 350, 
    height: 400,
    flex: 0,
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
    course_row_color: {
        padding: 20,
        margin: '5%',
        borderRadius: 10,
        backgroundColor: "#e0c3e6",
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

