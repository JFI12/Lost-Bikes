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

 const UploadBikeScreen = () => {


  const [username, setUsername] = useState("");

/*   const [phoneNumber, setNumber] = useState(""); */

  const [ phoneNumber, setNumber ] = useState('');
  const [ FrameNumber, setFrameNumber ] = useState('');
  const [ lastLocation, setlastLocation ] = useState("");
 
  const todoRef = firebase.firestore().collection("users").orderBy("createdAt", "desc");
  const recieveData = firebase.firestore().collection("todos");

  const [users, setUsers] = useState([]);
  const [ uploading, setuploading ] = useState(null);

  const [image, setImage] = useState(null);

  const navigation = useNavigation();
  const ifloggedin = firebase.auth().currentUser?.phoneNumber
/*   const ComponentDidMount = async() => {
    await firestore()
    .collection("Users")
    .onSnapshot(data => this.setState({Users: data.docs}))
  }
 */

  const [framSearchisEnabled, setFrameSearchIsEnabled] = useState(false);
  const toggleSwitchFrameSearch = () => setFrameSearchIsEnabled(previousState => !previousState);

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



/* useEffect(async => {

  todoRef
  .onSnapshot(
    querySnapshot => {
      const users = []

      querySnapshot.forEach((doc) => {
        const {name, framenumber, phonenumber, lastlocation} = doc.data()
        users.push({

          id: doc.id,
          name,
          framenumber,
          phonenumber,
          lastlocation,

        })

      })
      setUsers(users)

      setdataFromState(users)
    }
  )


}, []) */

const  [dataFromState, setdataFromState] =   useState(users);

const setData = () => {
  setDoc(doc(db, "users", "La"), {
    phonenumber: phoneNumber,
    framenumber: FrameNumber,
  }).then(() => {
    console.log("data submitted");
  }).catch(() => {
    console.log(error);
  })
}


const addData = () => {
  addDoc(collection(db, "users"), {
    phonenumber: phoneNumber,
    framenumber: FrameNumber,
  }).then(() => {
    console.log("data submitted");
  }).catch(() => {
    console.log(error);
  })
}

const upDateData=() =>{
  updateDoc(doc(db, "users", "La"), {
    phonenumber: phoneNumber,
    framenumber: FrameNumber,
  }).then(() => {
    console.log("data submitted");
  }).catch(() => {
    console.log(error);
  })
} 

const deleteData=() =>{
  deleteDoc(doc(db, "users", "La"), {
    phonenumber: phoneNumber,

  }).then(() => {
    console.log("data submitted");
  }).catch(() => {
    console.log(error);
  })
} 



const [search, setSearch] = useState([]);
const [searchword, setsearchword] = useState("");
const datas=[{name : "ok12"}, { name : "ok2"}]

/* console.log("state: "+ dataFromState) */
const SearchforBike =  (input) => {

    let data = dataFromState
    console.log("data: " +data)
    let searchData = data.filter((item) => {
        return item.framenumber?.toLowerCase().includes(input.toLowerCase());
    });
    setSearch(searchData);
    setsearchword(input)
    console.log("searchData: " + searchData)
    console.log("searchword: " + input)

    console.log("datas:" + datas[1]) 
  // console.log(dataFromState)

}
const [returnlist, setreturnlist] = useState([]);

const RenderArray=() => {

if (searchword.length > 0){
  console.log("search: "+search)
  setreturnlist(search)
  console.log("returnlist: "+returnlist)
}
else{
  
  setreturnlist(dataFromState)
  console.log("returnlistelse: "+returnlist)
}

  return returnlist.map((item,index) => {
    return (
      <View style={styles.container_getData} >
        <View style={styles.innerContainer}>
          <Text style={styles.itemHeading}>{item.framenumber}
          </Text>
          <Text style={styles.itemText}>

          Contact with: {item.phonenumber}</Text>
          <Text style={styles.itemText}>
          Last location: {item.lastlocation? item.lastlocation: "not published"}
          </Text>


      </View>
      </View>
    )
  })
}

const [posts, setPosts] = React.useState(new Array())
const [postsPerLoad]=React.useState(5);
const [startAfter, setStartAfter] =   React.useState(Object)
const [lastPost, setLastPost] = React.useState(false)
const [frameSearch, setframeSearch] = React.useState("")

const [frame_posts, setframe_posts] = React.useState(new Array())
const [imageList, setImageList]= React.useState(new Array())
const [imageWaiting, setImageWaiting] = React.useState(true)

const [imageUrls, setImages] = React.useState([])
const [indexCounterGlobal, setIndexCounter] = React.useState(0)

React.useEffect(()=>{

    getPosts();
    console.log("yeboi")


}, []);

const fetchPosts = async (postsPerLoad) => {
/*   await firebase.storage().ref().list().then(result => {
    // Loop over each item
    const imageUrls = [];

    result.items.forEach(pics => {
        firebase.storage().ref().child(pics.fullPath).getDownloadURL().then((url) => {
          console.log("ready0" + pics.fullPath)
            imageUrls.push(url);
            console.log("ready0" + imageUrls)
        })
    })

    setImages(imageUrls);
    
}); */
  const posts = new Array();
  var imageList = []
  var indexCounter = 0
/*   var indexCounter = 0 */
  const querySnapshot = await firebase.firestore().collection("users").limit(postsPerLoad).orderBy("createdAt", "desc").get();

  const lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]
  querySnapshot.forEach((doc) => {
    let postData = doc.data();

    postData.postId = doc.id;


    console.log(postData.imagefilename)

    if (postData.imagefilename){
        getImageList(postData.imagefilename, imageList, indexCounter)  

  /*    imageList.push(logo) */
/*       console.log("geturls")
      const storage =getStorage()
      const imgRef = ref(storage, postData.imagefilename);
      getDownloadURL(imgRef).then((x)=>{
        postData.imageURL = x 
        
        console.log("x123123"+x)

      })
 */



      
    }
    else{
      imageList[indexCounter]=(logo)
    }
    indexCounter = indexCounter + 1
    posts.push(postData)
    console.log(posts)

  });
  
  console.log(posts)
     setImageList(imageList)
     setIndexCounter(indexCounter) 
    return {posts, lastVisible };
  


};


const fetchMorePosts = async (startAfter, postsPerLoad) => {
  const posts = new Array();
  var indexCounter = indexCounterGlobal
  var fetchmoreimageList = imageList
  const querySnapshot = await firebase.firestore().collection("users").limit(postsPerLoad).orderBy("createdAt", "desc").startAfter(startAfter).get();
  const lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]

  querySnapshot.forEach((doc) => {
    let postData = doc.data();
    postData.postId = doc.id;
    posts.push(postData); 
    if (postData.imagefilename){
      getImageList(postData.imagefilename, fetchmoreimageList, indexCounter)   
    }
    else{
      fetchmoreimageList[indexCounter]=(logo)
    }
    indexCounter = indexCounter + 1
  });
  setImageList(fetchmoreimageList)
/*    console.log(posts)  */
  setIndexCounter(indexCounter)
  return {posts, lastVisible};

};

async function getPosts() {
  const postsData = await fetchPosts(postsPerLoad);

/*   if (frameSearch.length>0){

    setStartAfter(postsData.lastVisible )
    console.log(postsData.frame_posts)

setframe_posts(postsData.frame_posts)

  }  */

  setStartAfter(postsData.lastVisible )
  setPosts([...posts, ...postsData.posts]);


/*   console.log(postsData.posts) */

}


async function getMorePosts() {

  if (!lastPost){
  const postsData = await fetchMorePosts(startAfter, postsPerLoad);

  setStartAfter(postsData.lastVisible )
  setPosts([...posts, ...postsData.posts]);
  console.log("posts" + postsData.posts)
  postsData.posts.length ==0? setLastPost(true):setLastPost(false);
  }

}

 function renderPosts({item, index}){
  var imageListinRender = []

/*   console.log("item"+item) */
if(modeltoggle){
  imageListinRender=modelSearchImageList
}
else if(searchword.length>4){
  imageListinRender=frameSearchImageList
}

else{
  imageListinRender=imageList
} 
/*  console.log(url)
 console.log(imageList) */
 setImageWaiting(false)
/* console.log("imagelist"+imageList) */
/*   console.log(item.createdAt?.toDate().toString()) */
/*   console.log(item.createdAt.toDate().toString()) */

/* setTimeout(() => {
}, 3000); */

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

const [frameSearchImageList, setFrameSearchImageList] = useState([])
const [frameSeachtext, setFrameSeachtext]= useState("")

const [lastFramePost, setLastFramePost] = useState(false)
const [frameStartAfter, setFrameStartAfter] = useState(Object)
const [framePosts, setFramePosts] = useState(new Array())
const [indexFrameCounterGlobal, setIndexFrameCounterGlobal] = useState(0)

async function getSearchforBikeinFirebase() {
  const frameData = await SearchforBikeinFirebase(postsPerLoad, searchword);


  setFrameStartAfter(frameData.frame_lastVisible )
  setPosts([...users, ...frameData.users]);


};

const getMoreFramePosts=async()=> {

  if (!lastFramePost){
    console.log("startafter: " + frameStartAfter)
    const frame_Data = await fetchMoreFrameUsers(frameStartAfter, postsPerLoad );
  
    setFrameStartAfter(frame_Data.frame_lastVisible )

    setFramePosts([...users, ...frame_Data.users]);
    console.log("frameposts" + frame_Data.users)
    frame_Data.users.length==0? setLastFramePost(true):setLastFramePost(false);
  }
  
  
};


const fetchMoreFrameUsers=async(frameStartAfter, postsPerLoad)=>{

  const users= new Array()
  let frameSeachtextlocal= frameSeachtext
  console.log("inputframe"+frameSeachtextlocal)

  const querySnapshot = await firebase.firestore().collection("users").where('framenumber', "==", frameSeachtextlocal.toLowerCase()).limit(postsPerLoad).orderBy("createdAt", "desc").startAfter(startAfter).get();
  const frame_lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]

  var indexCounterlocal= indexFrameCounterGlobal

  const frameSearchImageListlocal = []
  querySnapshot.forEach(documentSnapshot => {
      console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());


     const {model, phonenumber, framenumber, lastlocation, imagefilename, createdAt} = documentSnapshot.data()
     users.push({
      id: documentSnapshot.id,
      model,
      phonenumber,
      framenumber,
      lastlocation,
      imagefilename,
      createdAt,
    })
    
    if (imagefilename){
      getImageList(imagefilename, frameSearchImageListlocal, indexCounterlocal)   
    }
    else{
      frameSearchImageListlocal[indexCounterlocal]=(logo)
    } 
    indexCounterlocal = indexCounterlocal + 1
  });
  setFrameSearchImageList(frameSearchImageListlocal)
  console.log(frameSearchImageListlocal)
  setLastFramePost(true)
  setUsers(users);

  setIndexFrameCounterGlobal(indexCounterlocal)

  console.log(indexCounterlocal)

  return {users, frame_lastVisible };



};

const SearchforBikeinFirebase=async(postsPerLoad, input)=>{
  const users= new Array()
  const firebaseUsers = firebase.firestore().collection("users").limit(postsPerLoad).orderBy("createdAt", "desc");
  console.log(firebaseUsers)
  console.log("inputframe"+input)

  const querySnapshot = await firebase.firestore().collection("users").where('framenumber', "==", input.toLowerCase()).limit(postsPerLoad).orderBy("createdAt", "desc").startAfter(startAfter).get();
  const frame_lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]

  var indexCounter=0 

  const frameSearchImageListlocal = []
  querySnapshot.forEach(documentSnapshot => {
    console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());


    const {model, phonenumber, framenumber, lastlocation, imagefilename, createdAt} = documentSnapshot.data()
    users.push({
    id: documentSnapshot.id,
    model,
    phonenumber,
    framenumber,
    lastlocation,
    imagefilename,
    createdAt,
  })
  
  if (imagefilename){
    getImageList(imagefilename, frameSearchImageListlocal, indexCounter)   
  }
  else{
    frameSearchImageListlocal[indexCounter]=(logo)
  } 
  indexCounter = indexCounter + 1

  });
  setFrameSearchImageList(frameSearchImageListlocal)
  setIndexFrameCounterGlobal(indexCounter)
  console.log(frameSearchImageListlocal)
  setLastPost(true)
  setUsers(users);

  return {users, frame_lastVisible };


}
const [searchModeltext, setSearchModeltext] = useState("")
const [ModelStartAfter, setModelStartAfter] =  React.useState(Object)
const [modelPosts, setModelPosts] = React.useState(new Array())
const [modeltoggle, setModeltoggle] = useState(false) 
const [lastModelPost, setLastModelPost] = useState(false)
const [firstModelsearch, setFirstModelsearch] = useState(true)
const [modelSearchImageList, setModelSearchImageList] = React.useState([])
const [indexModelCounterGlobal, setIndexModelCounterGlobal ] = React.useState(0)
const fetchModelPosts = async(ModelStartAfter, postsPerLoad)=>{
if (searchModeltext.length>1){
  var modelSearchImageListlocal = []
  const modelPosts = new Array();
  if (firstModelsearch){

    var indexCounter = 0
    const querySnapshot = await firebase.firestore().collection("users").where('model', "==", searchModeltext).limit(postsPerLoad).orderBy("createdAt", "desc").get();
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
    setModelSearchImageList(modelSearchImageListlocal)
    setIndexModelCounterGlobal(indexCounter)
    const model_lastVisible=querySnapshot.docs[querySnapshot.docs.length-1]
    console.log( "ok2")
/*     const model_lastVisible=modelPosts[modelPosts.length-1] */
    console.log( model_lastVisible)
    return {modelPosts, model_lastVisible };
  }
  else{
    /* var indexCounterlocal = indexModelCounterGlobal
    var fetchmoreimageList = modelSearchImageList
    const querySnapshot = await firebase.firestore().collection("users").where('model', "==", searchModeltext).limit(postsPerLoad).orderBy("createdAt", "desc").startAfter(ModelStartAfter).get();

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
    return {modelPosts, model_lastVisible }; */
  }

 /*  const model_lastVisible=querySnapshot.docs[querySnapshot.docs.length-1] */

}
else{
  setModelSearchImageList([])
  
}




  

} 

const SearchforBikeinFirebaseModel = async()=>{
  setModelPosts(new Array())
  setModelStartAfter(Object)
  
  if (searchModeltext)
  {
    setModeltoggle(true)
  }
  else{
    setFirstModelsearch(true)
    setModeltoggle(false)
    setLastModelPost(false)
    setLastPost(false)
    setModelSearchImageList([])
  }



/*   if (!lastModelPost){ */
    console.log("startafter: " + ModelStartAfter)
    const model_postsData = await fetchModelPosts(ModelStartAfter, postsPerLoad );
  
    setModelStartAfter(model_postsData.model_lastVisible )

    setModelPosts([...modelPosts, ...model_postsData.modelPosts]);
    console.log("modeposts" + model_postsData.modelPosts)
/*     model_postsData.modelPosts.length==0? setLastModelPost(true):setLastModelPost(false);
  } */


  
}

const fetchMoreModelPosts=async()=>{

  const modelPosts = new Array();
  var indexCounterlocal = indexModelCounterGlobal
  var fetchmoreimageList = modelSearchImageList
  const querySnapshot = await firebase.firestore().collection("users").where('model', "==", searchModeltext).limit(postsPerLoad).orderBy("createdAt", "desc").startAfter(ModelStartAfter).get();

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




  //add a field
  const item = ({item}) => {
    return (
        <View style={{backgroundColor: "green"}}>
            <Text>{item.framenumber}</Text>

        </View>
    )
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
        
{/*           <Text>Email: {auth.currentUser?.email}'s profile</Text> */}
          <TouchableOpacity style={styles.buttonBack} onPress={() => {ifloggedin ? navigation.replace('Profile'): navigation.replace('Login')}}>
            <Text styles={styles.buttontext}>{ifloggedin? "Back to alternatives" : "Back"}</Text>
          </TouchableOpacity>

          <Text style={{fontSize:35}}>TIP: </Text><Text style={{fontSize:20, marginBottom: 10}}>Upper/lower case letters do not matter</Text>
        </View>
      </DismissKeyboardView>
        <View style={styles.container} >
          <TouchableOpacity style={styles.button} onPress={() => {  Keyboard.dismiss(), navigation.replace("SearchinDataBaseFrame")}}>
            <Text styles={styles.buttontext}>{"Search with frame number"}</Text>
          </TouchableOpacity>
          
                    
{/*           <TextInput
            style={styles.TextInput}
            placeholder="Search with frame number"
            value={searchword}
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {setsearchword(text), setLastPost(false)}
            }

          /> */}
        </View>
      <DismissKeyboardView>
        <View style={styles.container} >
          <TouchableOpacity style={styles.button} onPress={() => {  Keyboard.dismiss(), navigation.replace("SearchinDataBaseModel")}}>
            <Text styles={styles.buttontext}>{"Search with model"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {  Keyboard.dismiss(), navigation.replace("SearchinDataBaseCounty")}}>
            <Text styles={styles.buttontext}>{"Search with county"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {navigation.replace('SearchinDataBaseCountyandModel')}}>
            <Text styles={styles.buttontext}>{"Search with model and county"}</Text>
          </TouchableOpacity>


        </View>
        <View style={styles.container}>
        
        {/*           <Text>Email: {auth.currentUser?.email}'s profile</Text> */}
        

        </View>

      </DismissKeyboardView>

        <View style={styles.container}>




        
 

{/*             <Text>Toggle Switch to allow "Search with frame number"</Text>
            <Switch
              style={{marginBottom: 10}}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={framSearchisEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchFrameSearch}
              value={framSearchisEnabled}
            /> */}



            
{/* 
            <TextInput
            style={styles.TextInput}
            placeholder="Search with model"
            value={searchModeltext}
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {setSearchModeltext(text), setsearchword("")}
            
            }

            /> */}

{/*             <TextInput
            style={styles.TextInput}
            placeholder="Search on model"
            value={searchword}
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {SearchforBikeinFirebase(text)}
            }

            /> */}


{/*             <RenderArray /> */}

          </View>
          </>
}
 
            
            nestedScrollEnabled
            data= {searchword.length>0 ? users:posts}
            
            renderItem={renderPosts} 
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={searchword.length>0 ? getMoreFramePosts : getMorePosts}
            onEndReachedThreshold={0.01}
            scrollEventThrottle={150}
            ListFooterComponent = {!lastPost && !lastModelPost && < ActivityIndicator size="small" color="#0000ff" />}

              
            />



{/* {imageWaiting ? <AppLoader/>: null}   */}
</SafeAreaView>
/*             => 
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
  
            )} */

      );
  }
export default UploadBikeScreen
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
    width: '65%',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',

    marginBottom: 16,
},
  
  button: {
    backgroundColor: "#27c8f5",
    width: '65%',

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
