import { StatusBar } from 'expo-status-bar';
import React, {createContext, useContext, Fragment, useState, useEffect, useRef, setItem} from 'react';
import {ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, ScrollView, Button, Alert, TextInput, KeyboardAvoidingView  } from 'react-native';
import { TouchableOpacity  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import styless from "./pages/Stylesheet.js"
import logo from "./images/logo.jpg";
import {useNavigation} from '@react-navigation/core';
import firebase from 'firebase/compat/app';
import * as ImagePicker from "expo-image-picker";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { initializeApp, getApp } from 'firebase/app';
import {  PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import LottieView from "lottie-react-native";
import AppLoader from './animations/AppLoader';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { db } from '../firebase';
import { AsyncStorage } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyB6_XZ8MTo-z_LtShxCAxPhvRSvvwriMgg",
  authDomain: "stolen-bikes-5d664.firebaseapp.com",
  projectId: "stolen-bikes-5d664",
  storageBucket: "stolen-bikes-5d664.appspot.com",
  messagingSenderId: "256078269191",
  appId: "1:256078269191:web:72401a6a7e4768435cd3a2",
  measurementId: "G-EJ4N1CFLJX"
};


/* */

const LoginScreen = ({  }) => {


const lengthInput = 6;

const textInput = useRef(null)
const [loginPending, setLoginPending] = useState(false);

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigation = useNavigation()



const [phoneNumber, setPhoneNumber] = useState(""); 
const [code, setCode] = useState("");
const [verificationId, setVerificationId] = useState(null);
const recaptchaVerifier = useRef(null);

const [asyncdata, setasyncdata] = useState(false)


const sendVerification = () => {
   const phoneProvider = new firebase.auth.PhoneAuthProvider();
   var phonenumberNew = phoneNumber
   console.log(phonenumberNew)
    if (phoneNumber[0] == "0"){
      phonenumberNew = "+46" + phonenumberNew.substring(1);
      console.log(phonenumberNew)
    }
   phoneProvider.verifyPhoneNumber(phonenumberNew, recaptchaVerifier.current).then(setVerificationId);
   setPhoneNumber("");

};

const confirmCode = () => {
   const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
       code);
   firebase.auth().signInWithCredential(credential).then(() => {
       setCode("");
   })
   .catch((error) => {
       //show alert in case of error
       alert(error)
   })
   Alert.alert(
       "Login Successful. Welcome to your profile"
   );
}

const checklog=async()=>{

    try {
  
        const data = await AsyncStorage.getItem('keepLoggedIn')
  
          console.log("if true" + data)

    }
    catch(error) {}
  

};

useEffect(() => {
  checklog()

    console.log( firebase.auth().currentUser?.phoneNumber)
    const unsubscribe = firebase.auth().onAuthStateChanged(user =>{

      if (user) {

        navigation.replace('Profile', { name: firebase.auth().currentUser?.phoneNumber })

      }
    })
    return unsubscribe
  }, [])  


  const handleSignup = () =>{

    firebase.auth().createUserWithEmailAndPassword(email, password).then(userCredentials => {
      const user = userCredentials.user;
      console.log('Registered with: ', user.email);
    })

    .catch(error => alert(error.message))

  }

  const handleLogin = () =>{
    firebase.auth().signInWithEmailAndPassword(email, password).then(userCredentials => {
      AsyncStorage.setItem("keepLoggedIn", JSON.stringify(true))
      const user = userCredentials.user;

      console.log('Logged in with: ', user.email);
    })
    .catch(error => alert(error.message))
  }
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image1, setImage] = useState(null);

/*   useEffect(() => {

      (async () => {
          const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === "granted");


      });

  }, []); */

  const pickImage = async () => {
    setLoginPending(true)

      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4,3],
          quality: 1,
          
          
      });
  console.log(result);
      if (!result.cancelled){
          setImage(result.uri);

      }
      setLoginPending(false)
      if (hasGalleryPermission === false){
        return <Text>No access to internal storage</Text>
    }

  };
  

const setPhoneNumber0to46=(text) => {
  if (text[0] == 0){
    text[0] = "+46";
  }
  else{
    setPhoneNumber(text)
  }

}

const handleSearchforBike = () => {

  navigation.replace("SearchinDataBase")

}

const handleValuableInfo = () => {
  navigation.replace("ValuableInfo")
}

  return (
<Fragment>
<ScrollView style={styles.container_scroll}>


<View style={styles.container_sms}>
        <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}/>
        <Image style={styles.image} source={require("./images/logo.jpg")} />

        <Text style={styles.optText}>
            Register with SMS
        </Text>
        <TextInput
            placeholder="+46 76 070 07 07"
            onChangeText= {setPhoneNumber}
            keyboardType="phone-pad"
            autoCompleteType="tel"
            style={styles.textInput}/>
{/*             <View style= {styles.containerInput}>
            {          Array(lengthInput).fill().map((data, index) => (
              <View style={styles.cellView}>
              <Text style= {styles.cellText} onPress={() => textInput.focus()}>
              1
              </Text>
              </View>


)

)}


            </View> */}
    <TouchableOpacity style={styles.sendVerification} onPress={sendVerification}>
        <Text style={styles.buttonText}>
            Send Verification
        </Text>
    </TouchableOpacity>
    <TextInput
        placeholder="Confirm code"
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.textInput}/>

    <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
        <Text style={styles.buttonText}>
            Confirm verification
        </Text>
    </TouchableOpacity>
    <Text style={{fontSize:35, marginTop:30,}}>TIP: </Text><Text style={{fontSize:20, marginLeft:10,marginRight:10}}>Use the app whenever you buy a used bike to check if it is previously stolen! {"\n"} </Text>
</View>
<View style={{marginBottom:0, alignItems: "center",  justifyContent:"center", marginLeft:16, marginRight:16,}}>
<Text>You can find your frame number on your bikes frame. Every bike has one! Bounties may be viable!</Text>
</View>

<View style={styles.course_row}>
        <TouchableOpacity onPress={handleSearchforBike}>
                <Text style={{fontSize:25}}>Search in database</Text>
                <Text></Text>
        </TouchableOpacity>
</View>
<View style={styles.course_row}>
        <TouchableOpacity onPress={handleValuableInfo}>
                <Text style={{fontSize:25}}>Valuable Info</Text>
                <Text></Text>
        </TouchableOpacity>
</View>


{/*     <View style={{flex:1, justifyContent:'center', marginBottom: 1000}}>
        <Button title="Pick Image" onPress={() => pickImage()} style = {{marginTop: 30}}  />
        {image1 && <Image source={{uri: image1}} style={{flex:1/2}}/>}
    </View> */}

 {/* <KeyboardAvoidingView style={styles.container} behavior="padding">
<Image style={styles.image} source={require("./images/logo.jpg")} />

  <View style={styles.inputView}>
    <TextInput
      style={styles.TextInput}
      value={email}
      placeholder="Email"
      placeholderTextColor="#003f5c"
      onChangeText={(text) => setEmail(text)}
    />


    <TextInput
      style={styles.TextInput}
      value={password}
      placeholder="Password"
      placeholderTextColor="#003f5c"
      secureTextEntry
      onChangeText={(text) => setPassword(text)}
      />
  </View>



<View style={styles.buttoncontainer}>
  <TouchableOpacity>
    <Text style={styles.forgot_button}>Forgot Password?</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.loginBtn}>
    <Text style={styles.loginText} onPress={handleLogin} placeholder = "Email" >LOGIN</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.loginBtn, styles.buttonoutline]} >
    <Text onPress={handleSignup} style={styles.buttonoutlinetext} secureTextEntry>Register</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.tinyLogo} onPress={() => {AsyncStorage.setItem("keepLoggedIn", JSON.stringify(true)),   navigation.replace("Profile")}}>
  
    <Image source={logo} resizeMode="stretch" style={styles.text_box_white}/>
 

  </TouchableOpacity> 

</View>


</KeyboardAvoidingView>  */}

  

</ScrollView>
{loginPending ? <AppLoader/>: null}  
</Fragment>


  )
}
export default LoginScreen

const styles = StyleSheet.create({
  container_scroll: {
    flex: 1,


  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },

  container_sms: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },

  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cellView: {
    paddingVertical: 11,
    width: 40,
    height: 5,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1.5
  },

  cellText: {
    textAlign: "center",
    fontSize: 16,
  },

  tinyLogo: {
    width: "60%",
    height: "20%",
    alignItems: "center",
    padding: 0,
    marginTop: 40,
    
  },
  image: {
    marginTop: 20,
    width: 100,
    height: 80,
    padding: 10,
    marginBottom: 0,
  },
  text_box_white: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  
    padding: 15,
    margin: '2%',
    color: "white",
},

buttoncontainer: {
width: "60%",
justifyContent: "center",
alignItems: "center",
marginTop: 40,
},

inputView: {
  width: '80%',

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

textInput: {
  paddinTop: 40,
  paddingBottom: 20,
  paddingHorizontal: 20,
  fontSize: 24,
  borderBottomColor: "black",
  marginBottom:20,
  borderBottomWidth:2,
  textAlign:"center",
  color:"black",
},

sendVerification: {
  padding: 20,
  backgroundColor: "#3498db",
  borderRadius: 10,
},
  sendCode: {
    padding:20,
    backgroundColor:"#1b59b6",
    borderRadius: 10,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",


  },

  optText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginTop: 25,
    marginBottom: 20,
  },

  course_row: {
    padding: 20,
    margin: '5%',
    borderRadius: 10,
    backgroundColor: "#fff3f3",
    shadowColor: 'rgba(0,0,0, 0.4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

},


});