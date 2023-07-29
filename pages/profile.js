import React, {Fragment, useState, useEffect, useRef} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, StatusBar, Button, Alert  } from 'react-native';
import { TouchableOpacity  } from 'react-native';
import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";

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
function Profile(){
    /* setBikeImage */


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




    return(
<Fragment>
    
<SafeAreaView style={styles.container}>


{/* 
    <View style={{flex:1, justifyContent:'center', marginBottom: 1000}}>
        <Button title="Pick Image" onPress={pickImage} style = {{marginTop: 30}}  />
        {image1 && <Image source={{uri: image1}} style={{flex:1/2}}/>}
    </View> */}





{/* <!------------ campus----------> */}
<View style = {styles.campus}>
    <Text style={[styles.setFontSizeThree]}>Our global camppuss</Text>
    <Text>{"\n"}Lorem ipsum dom dum din</Text>

    <TouchableOpacity >
        <View style={styles.campus_row}>

                <ImageBackground source={logo} style={styles.bikelogo}>
                        <View className="layer">

                            <Text style={[styles.setFontSizeThree_white]}>LONDON</Text>

                        </View>
                </ImageBackground >

        </View>
    </TouchableOpacity >
        
        <View style={styles.campus_row}>
            <TouchableOpacity >
                <ImageBackground source={logo} style={styles.bikelogo} >

                        <Text style={[styles.setFontSizeThree_white]}>NEW YORK</Text>

                </ImageBackground>
            </TouchableOpacity >
        </View>

        <View style={styles.campus_row}>
            <ImageBackground style={styles.bikelogo} source={logo}>

                <Text style={[styles.setFontSizeThree_white]}>WASHINGTON</Text>
            </ImageBackground>

        </View>
    </View>



<View className="facilities">
    <Text style={[styles.setFontSizeOne]}>Our Facilities</Text>
    <Text>{"\n"}Lorem epstum epstein</Text>

        <View className="row">
            <View className="facilities-col">
                <Image style={styles.image} source={require("./images/logo.jpg")}/>
                <Text style={[styles.setFontSizeThree]}>World className library</Text>
                <Text>{"\n"}Lorem epsum dolor sit</Text>
            </View>
            <View className="facilities-col">
                <Image style={styles.image} source={require("./images/logo.jpg")}/>
                <Text style={[styles.setFontSizeThree]}>World className library</Text>
                <Text>{"\n"}Lorem epsum dolor sit</Text>
            </View>
            <View className="facilities-col">
            <Image style={styles.image} source={require("./images/logo.jpg")}/>
                <Text style={[styles.setFontSizeThree]}>World className library
                {"\n"}Lorem epsum dolor sit</Text>
            </View>
        
        </View>

</View>


{/* <!----------- testimonials -----------> */}
<View className="testimonials">
    <Text style={[styles.setFontSizeOne]}>What our student says
    {"\n"}Lorem epstum epstein</Text>
    <View className="row">
        <View className="testimonial-col">
        <Image style={styles.tinyLogo} source={require("./images/logo.jpg")}/>
            <View>
                <View>
                    <Text>Lorem ipsum dolor sit ametipentoroeterLorem ipsum dolor sit amet, centoroeterLorem ipsum dolor sit amet, centoroeterLorem ipsum dolor sit amet, centoroeter</Text>
                </View>
                <Text style={[styles.setFontSizeThree]}>Christine Berkley</Text>
                <View className="fa fa-star"></View>
                <View className="fa fa-star"></View>
                <View className="fa fa-star"></View>
                <View className="fa fa-star-o"></View>
            </View>
        </View>
        <View className="testimonial-col">
        <Image style={styles.tinyLogo} source={require("./images/logo.jpg")}/>
            <View>
                <View>
                <Text>Lorem ipsum dolor sit amet, it amet, centoroeterLorem ipsum dolor sit amet, centoroeterLorem ipsum dolor sit amet, centoroeterLorem ipsum dolor sit amet, centoroeter</Text>
                </View>
                <Text style={[styles.setFontSizeThree]}>David Snyrim</Text>
                <View className="fa fa-star"></View>
                <View className="fa fa-star"></View>
                <View className="fa fa-star"></View>
                <View className="fa fa-star-half-o"></View>
                
            </View>
        </View>
    </View>
</View>

{/* 
<!----------call to action--> */}
<View className="cta">

    <Text style={[styles.setFontSizeOne]}>Enroll for Our various worlds </Text>

    <Text className="hero-btn" style={{color: 'blue'}}
        onPress={() => Linking.openURL('./home')}>
            CONTACT US
    </Text>

</View>

{/* <!--------footer-------> */}
<View className="footer">
    <Text style={[styles.setFontSizeFour]}>About Us</Text>
    <View><Text>Lorem ipsum dolor  {"\n"}sisisiisisisi</Text></View>
    <View className="icons">
        <View className="fa fa-facebook"></View>
        <View className="fa fa-twitter"></View>
        <View className="fa fa-instagram"></View>
        <View className="fa fa-linkedin"></View>
    </View>
    <View><Text> Made with </Text>
    <View className="fa fa-heart-o"></View> 
    <Text>by Melker</Text></View>
</View>

</SafeAreaView>



</Fragment>
        );


    }

export default Profile;



const styles = StyleSheet.create({
    container: {
        flex: 1,

        paddingTop: StatusBar.currentHeight,
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