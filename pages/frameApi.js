
import firebase from 'react-native-firebase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

 
export function updateframe(frame, updateComplete) {
    frame.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    console.log("Updating frame in firebase");
  
    firebase.firestore()
      .collection('frame')
      .doc(frame.id).set(frame)
      .then(() => updateComplete(frame))
      .catch((error) => console.log(error));
  }

  export function deleteframe(frame, deleteComplete) {
    console.log(frame);
  
    firebase.firestore()
      .collection('frames')
      .doc(frame.id).delete()
      .then(() => deleteComplete())
      .catch((error) => console.log(error));
  }

  export async function getframes(framesRetreived) {

    var frameList = [];
  
    var snapshot = await firebase.firestore()
      .collection('frames')
      .orderBy('createdAt')
      .get()
  
    snapshot.forEach((doc) => {
      const frameItem = doc.data();
      frameItem.id = doc.id;
      frameList.push(frameItem);
    });
    framesRetreived(frameList);
}

export function uploadframe(frame, onframeUploaded, { updating }) {

    if (frame.imageUri) {
      const fileExtension = frame.imageUri.split('.').pop();
      console.log("EXT: " + fileExtension);
  
      var uuid = uuidv4();
  
      const fileName = `${uuid}.${fileExtension}`;
      console.log(fileName);
  
      var storageRef = firebase.storage().ref(`frames/images/${fileName}`);
  
      storageRef.putFile(frame.imageUri)
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
            console.log("snapshot: " + snapshot.state);
            console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  
            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              console.log("Success");
            }
          },
          error => {
            unsubscribe();
            console.log("image upload error: " + error.toString());
          },
          () => {
            storageRef.getDownloadURL()
              .then((downloadUrl) => {
                console.log("File available at: " + downloadUrl);
  
                frame.image = downloadUrl;
  
                delete frame.imageUri;
  
                if (updating) {
                  console.log("Updating....");
                  updateframe(frame, onframeUploaded);
                } else {
                  console.log("adding...");
                  addframe(frame, onframeUploaded);
                }
              })
          }
        )
    } else {
      console.log("Skipping image upload");
  
      delete frame.imageUri;
  
      if (updating) {
        console.log("Updating....");
        updateframe(frame, onframeUploaded);
      } else {
        console.log("adding...");
        addframe(frame, onframeUploaded);
      }
    }
  }
  
  export function addframe(frame, addComplete) {
    frame.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  
    firebase.firestore()
      .collection('frames')
      .add(frame)
      .then((snapshot) => {
        frame.id = snapshot.id;
        snapshot.set(frame);
      }).then(() => addComplete(frame))
      .catch((error) => console.log(error));
  }