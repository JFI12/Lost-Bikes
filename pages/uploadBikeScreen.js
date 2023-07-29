import React, { Component, Fragment, useEffect, useState, useRef } from 'react'
import {StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Keyboard, Pressable, FlatList, SnapshotViewIOS, VirtualizedList} from 'react-native'
import {ListItem} from "react-native-elements";
import { auth } from '../firebase.js'
import Profile from './profile';
import AppLoader from './animations/AppLoader';
import {ImageBackground, Image, SafeAreaView, StatusBar, Button, Alert, TextInput  } from 'react-native';
import Navbar from "./Navbar"
import { Linking } from 'react-native';
import logo from "./images/logo.jpg";
import { NavigationContainer } from '@react-navigation/native';
import { getStorage, uploadBytes, getDownloadURL, connectStorageEmulator,ref } from "firebase/storage";
import { onValue, set, update, remove, refFromURL } from "firebase/database";
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

/* import { firestore } from 'react-native-firebase'; */
/*  import { firestore } from 'react-native-firebase';  */
/* import {phoneNumber} from "./signinscreen"; */

const UploadBikeScreen = () => {

/*   const [toomanyPhonesCounter, settoomanyPhonesCounter] = useState(0) */

  const [username, setUsername] = useState("");

/*   const [phoneNumber, setNumber] = useState(""); */
/*   const [ phoneNumber, setNumber ] = useState(''); */
  const [ FrameNumber, setFrameNumber ] = useState('');
  const [ lastLocation, setlastLocation ] = useState("");
  const [model, setModel] = useState("");

  const phoneNumber = firebase.auth().currentUser?.phoneNumber
  const todoRef = firebase.firestore().collection("users");
  const recieveData = firebase.firestore().collection("todos");

  const [users, setUsers] = useState([]);

  const [ uploading, setuploading ] = useState(null);

  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  const [imageFilename, setimageFilename] = useState("");
  const [url, setUrl] = useState();
  const [usersimages, setUsersimages] = useState(new Array());


/*   const ComponentDidMount = async() => {
    await firestore()
    .collection("Users")
    .onSnapshot(data => this.setState({Users: data.docs}))
  }
 */
  const pickImage = async () => {
/*     setuploading(true); */
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
        cropping: true,
    });
    const source = {uri: result.uri}; 
    setimageFilename(source.uri.substring(parseInt(source.uri.lastIndexOf("/"))+1))
    console.log(source);
    console.log("imgname" + (source.uri.substring(parseInt(source.uri.lastIndexOf("/"))+1)))
    console.log(imageFilename)

    setImage(source);
};


const uploadImage = async () => {

    {image ? setuploading(true): null}  
    const response = await fetch(image.uri)
/*     console.log("imgname" + (image.uri.substring(parseInt(image.uri.lastIndexOf("/"))+1)))
    console.log("filename" + imageFilename) */
    const blob = await response.blob();
    const filename = (image.uri.substring(image.uri.lastIndexOf("/")+1))
    console.log(filename)
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



 const readData = () => {
  const user = firebase
  .firestore()
  .collection('users')
  .doc('yrzFAvvCWJNqIAquRul4')
  .get()
  .then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);

    if (documentSnapshot.exists) {
      console.log('User data: ', documentSnapshot.data());

    }
  });
} 

const getImageList = async(imagefilename, imageList, indexCounter)=>{

  const storage = getStorage()

  console.log("/" + imagefilename)


     const reference =  ref(storage, imagefilename);

  console.log("okkkkkkkkkkkkkkkej!!!!!!!!!!!!!!!!!!")


  
  await getDownloadURL(reference).then((x)=> {
    console.log("/" + "ok2"+ x)
     imageList[indexCounter]=(
      x

     )  


    setUrl(x)
return x

  })/* .catch(() => {
    console.log(error);
  }) */

}
const isInitialMount = useRef(true);
const [imageUrls, setImages] = React.useState([])
const useeffect=() => {

  /* const getImageList = async(imagefilename, imageList)=>{

    const storage = getStorage()

    console.log("/" + imagefilename)
    

       const reference =  ref(storage, imagefilename);

    console.log("okkkkkkkkkkkkkkkej!!!!!!!!!!!!!!!!!!")
    if (reference){

    
    await getDownloadURL(reference).then((x)=> {
      console.log("/" + "ok2")
       imageList.push({
        x,

      })  
      
      setUrl(x)


    })
  }
  } */
  if (isInitialMount.current) {
    isInitialMount.current = false;

  const imageList = new Array()
  todoRef
  .onSnapshot(
    querySnapshot => {
      var indexCounter=0
      const users = []
      const phonecheck = phoneNumber

      querySnapshot.forEach((doc) => {

         if (doc.data().phonenumber == phonecheck) 
         { 
 

        const {name, phonenumber, framenumber, lastlocation, imagefilename, model, createdAt} = doc.data()



/*         for(let i = 0; i < users.length; i++){
          if (usersimages[i].slice(77,117)==users.imagefilename) {
            users[i].push{
              usersimages[i]
            }
          }
    
      } */
        if (imagefilename){
/*           console.log("ok1")
          func(imagefilename, usersimages);

             */
          getImageList(imagefilename, imageList, indexCounter)

        }
        else{

          imageList.push(
            logo,
          )
        }
        indexCounter = indexCounter + 1
        users.push({
          id: doc.id,
          name,
          phonenumber,
          framenumber,
          lastlocation,
          imagefilename,
          model,
          createdAt,
        })
      }
   } )
      setUsers(users)
/*       setUrl(usersimages) */
      console.log("listus" + imageList)
     /*  console.log(users)  */
     console.log("ok1")
     console.log(users)
     setUsersimages(imageList)

       
/*       const phonecheck = firebase.auth().currentUser?.phoneNumber;
      for (var i=0; i < users.length; i++) {
        if (users[i].phonenumber == phonecheck)
        {
          toomanyPhonesCounter += 1
        }

      } */
/*     settoomanyPhonesCounter(toomanyPhonesCounter) */
/*     console.log(toomanyPhonesCounter) */
    }
  )
    
  }
 else {
  console.log("UseEffect can only go once per loadus :)")
}
} /*  , [])   */


const setData = () => {
  setDoc(doc(db, "users", phoneNumber), {
    framenumber: FrameNumber,
    phonenumber: phoneNumber,
  }).then(() => {
    console.log("data submitted1");
  }).catch(() => {
    console.log(error);
  })
}

 
const addData = () => {
  addDoc(collection(db, "users"), {
    phonenumber: phoneNumber,
    framenumber: FrameNumber,
  }).then(() => {
    console.log("data submitted2");
  }).catch(() => {
    console.log(error);
  })
}

const upDateData=() =>{
  updateDoc(doc(db, "users", "La"), {
    phonenumber: phoneNumber,
    framenumber: FrameNumber,
  }).then(() => {
    console.log("data submitted3");
  }).catch(() => {
    console.log(error);
  })
} 

const deleteData=() =>{
  deleteDoc(doc(db, "users", "La"), {
    phonenumber: phoneNumber,

  }).then(() => {
    console.log("data submitted4");
  }).catch(() => {
    console.log(error);
  })
} 

const deleteItem=(framenumberitemindex) =>{
console.log(framenumberitemindex)

  deleteDoc(doc(db, "users", users[framenumberitemindex].id), {

  }).then(() => {
    console.log("data submitted5");
  }).catch((error) => {
    console.log(error);
  })

  if (users[framenumberitemindex].filename){
    let imageRef = storage.refFromURL(usersimages[framenumberitemindex]);
    imageRef.delete()

  }




} 

  const addFieldcommands=()=>{
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      
    const data = {
  /*     framenumber: FrameNumber, */
/*         createdAt: timestamp,
      image: image,
      phonenumber: phoneNumber, */
      name: username,
      createdAt: timestamp,
      framenumber: FrameNumber.toLowerCase(),
      phonenumber: phoneNumber ,
      uuid: uuid.v4(),
      lastlocation: lastLocation.toLowerCase(),
      imagefilename: imageFilename,
      model: model.toLowerCase(),

    };

    console.log(data)

    todoRef
      .add(data)
      .then(() => {
        //release the new field state
        setFrameNumber("");
        //release keyboard
        Keyboard.dismiss();

      })

/*       .catch((error) => {
        alert(error);
      }) */
  }
  //add a field
const [sentBikesCounter, setSentBikesCounter] = useState(0)
useEffect(()=>{
  let sentBikesCounterlocal = 0
  todoRef.where('phonenumber', "==", phoneNumber).limit(10).get().then(querySnapshot=>{
    querySnapshot.forEach(documentSnapshot => {
      console.log(sentBikesCounterlocal)
      sentBikesCounterlocal = sentBikesCounterlocal + 1
    })
    setSentBikesCounter(sentBikesCounterlocal)
  }
  )


} , [])

  const addField = () => {


      //VIP lista???
    //check if we have new field data
    if (sentBikesCounter < 6 ) {
   /*  if (phoneNumber && phoneNumber.length> 0){ */

      //console.log(auth)
      //get timestamp
       addFieldcommands() 
       if (image){
        uploadImage()
      } 
      Alert.alert("Your report has been sent")
      /*   navigation.replace("Profile")  */
      /*navigation.replace("UploadBike") */
/*         console.log(data) */
/*     } */
  }
  else{
    Alert.alert("A maximum of 5 reports can be active at once")
  }

}

const RenderArray=() => {
  console.log("render1")

  return users.map((item,index) => {
/*     if (url.length > 0){

    } */
    if (users[index].imagefilename){

      

      console.log("url" + url)
    }
    else{

    }

    
    return (



      <View style={styles.container_getData}>
        
          <View style={styles.innerContainer} key={item.id}>
            <Text style={styles.itemHeading}>{item.framenumber}
            </Text>
            <Text style={styles.itemText}>
            Contact with: {item.phonenumber}</Text>
            <Text style={styles.itemText}>
            Last location: {item.lastlocation? item.lastlocation: "not published"}</Text>
            <Image source= {{uri: url}} style={{width: 300, height:300,}}/>
            
        </View>
  
        <TouchableOpacity style={styles.sendVerificationimg} onPress={ ()=>deleteItem(index)}>
  
          <Image source={deleteitemimg} resizeMode="stretch" style={styles.tinyLogo}/>
   
        </TouchableOpacity>

      </View>
      

      
    )
  })
}

function renderPosts({item, index}) {
  console.log("img" + usersimages[index]) 

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



          <Image source= {usersimages[index]==logo?(logo): {uri: usersimages[index]}} style={{width: 300, height:300, margin: 10,}}/>
        </View>
        
        <TouchableOpacity style={styles.sendVerificationimg} onPress={ ()=>deleteItem(index)}>
          <Image source={deleteitemimg} resizeMode="stretch" style={styles.tinyLogo}/>
        </TouchableOpacity>

      </View>

    </ListItem> 




  );
}
 
    return (
<SafeAreaView style={{flex: 1,}}>
<FlatList
  ListHeaderComponent={
    <>
        <View style={styles.container}>
{/*         <Text>uuid: {uuid.v4()}'s profile</Text> */}
{/*           <Text>Email: {auth.currentUser?.email}'s profile</Text> */}

          <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Profile')}>
            <Text styles={styles.buttontext}>Back to alternatives</Text>
          </TouchableOpacity>




          <View style={{ width: "80%", justifyContent: "center", alignItems: "center" }}>

            <Text>To really prevent bike thefts report the lost bike to the local law enforcement aswell</Text>
          </View>
            <View style={styles.buttoncontainer}>
              <TouchableOpacity style={styles.selectButton} onPress={() => Linking.openURL("https://etjanster.polisen.se/eanmalan/stold/anmalareenkel")}>
                <Text style={styles.buttonText}>Go to the police website</Text>
              </TouchableOpacity>

          </View>

        <View style={{marginBottom: 10, width: "80%" }}>
          <Text>Users are contacted through their phones. (In app chat comming soon!) </Text>
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            value={FrameNumber}
            placeholder="Frame number"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setFrameNumber(text)}
          />
          <View style={styles.TextInputphone}>
            
            <Text style={{color: "#003f5c"}}>Contact with: {phoneNumber }</Text>

          </View>
          <TextInput
            style={styles.TextInput}
            value={model}
            placeholder="Model: BMX, Morach exc..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setModel(text)}
          />
{/* Framenumber, phonenumber, image, location  lägg till ladda upp till storage och ladda ner till profil med status hittad/ej hittad och counter för antal hittade*/}
          <TextInput
            style={styles.TextInput}
            value={lastLocation}
            placeholder="Last county: Östergötland exc..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setlastLocation(text)}
            />
          </View>

          <View style={styles.buttoncontainer}>
            <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            {image && <Image source= {{uri: image.uri}} style={{width: 300, height:300}}/>}
   {/*          <TouchableOpacity style={styles.uploadButton} onPress={(uploadImage) } >

                
                <Text style={styles.buttonText}>Upload image</Text>
            </TouchableOpacity>  */}

        </View>

          <TouchableOpacity style={styles.sendVerification} onPress={() => addField()}>
            <Text style={styles.buttonText}>
                Send report
            </Text>
          </TouchableOpacity>


            
{/*           <TextInput
            style={styles.TextInput}
            placeholder="data"

            placeholderTextColor="#003f5c"
            onChangeText={(text) => setUsername(text)}
            username = {username}

            /> */}
{/*           <TouchableOpacity style={styles.sendVerification} onPress={ addField}>
            <Text style={styles.buttonText}>
            createData
            </Text>
          </TouchableOpacity> */}

{/*           <TouchableOpacity style={styles.sendVerification} onPress={ readData}>
            <Text style={styles.buttonText}>
            readData
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendVerification} onPress={ setData}>
            <Text style={styles.buttonText}>
            setData
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendVerification} onPress={ addData}>
            <Text style={styles.buttonText}>
            addData
            </Text>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.sendVerification} onPress={ upDateData}>
            <Text style={styles.buttonText}>
            upDateData
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendVerification} onPress={ deleteData}>
            <Text style={styles.buttonText}>
            deleteData
            </Text>
          </TouchableOpacity> */}

        <View >
 {/*          <Text style={{marginTop: 20, marginBottom: 14, fontSize: 25,}}>
            My submitted bikes
          </Text> */}
        </View>
        </View>

</>
  }
            nestedScrollEnabled
            data= {users}
            
            renderItem={renderPosts} 
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
/*             onEndReached={modeltoggle? SearchforBikeinFirebaseModel : getMorePosts}
            onEndReachedThreshold={0.01}
            scrollEventThrottle={150} */
/*             ListFooterComponent = {!lastPost && !lastModelPost && < ActivityIndicator size="small" color="#0000ff" />} */

              
            />

{/*           <FlatList
          data= {users}
          
          numColumns={1}
          renderItem={( {item}) => 
          (
            <Pressable
              style={styles.container_getData}>

              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>
                  {item.name}
                </Text>
                <Text style={styles.itemText}>
                Contact with: {item.name}
                </Text>
              </View>
            </Pressable>

          )}/> */}






      {uploading? <AppLoader/>: null}
</SafeAreaView>


      );
  }
export default UploadBikeScreen
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
  marginBottom: 30,
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