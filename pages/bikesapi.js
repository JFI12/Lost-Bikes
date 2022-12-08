
import { v4 as uuidv4 } from 'uuid';

export function updatebike(bike, updateComplete) {
    bike.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    console.log("Updating bike in firebase");
  
    firebase.firestore()
      .collection('bikes')
      .doc(bike.id).set(bike)
      .then(() => updateComplete(bike))
      .catch((error) => console.log(error));
  }

  export function deletebike(bike, deleteComplete) {
    console.log(bike);
  
    firebase.firestore()
      .collection('bikes')
      .doc(bike.id).delete()
      .then(() => deleteComplete())
      .catch((error) => console.log(error));
  }

  
export async function getbikes(bikesRetreived) {

    var bikeList = [];
  
    var snapshot = await firebase.firestore()
      .collection('bikes')
      .orderBy('createdAt')
      .get()
  Food
    snapshot.forEach((doc) => {
      const bikeItem = doc.data();
      bikeItem.id = doc.id;
      bikeList.push(bikeItem);
    });
  
    bikesRetreived(bikeList);
  }
  import React, { Component } from 'react'
  

  
  export function uploadbike(bike, onbikeUploaded, { updating }) {
  
    if (bike.imageUri) {
      const fileExtension = bike.imageUri.split('.').pop();
      console.log("EXT: " + fileExtension);
  
      var uuid = uuidv4();
  
      const fileName = `${uuid}.${fileExtension}`;
      console.log(fileName);
  
      var storageRef = firebase.storage().ref(`bikes/images/${fileName}`);
  
      storageRef.putFile(bike.imageUri)
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
  
                bike.image = downloadUrl;
  
                delete bike.imageUri;
  
                if (updating) {
                  console.log("Updating....");
                  updatebike(bike, onbikeUploaded);
                } else {
                  console.log("adding...");
                  addbike(bike, onbikeUploaded);
                }
              })
          }
        )
    } else {
      console.log("Skipping image upload");
  
      delete bike.imageUri;
  
      if (updating) {
        console.log("Updating....");
        updatebike(bike, onbikeUploaded);
      } else {
        console.log("adding...");
        addbike(bike, onbikeUploaded);
      }
    }
  }
  
  export function addbike(bike, addComplete) {
    bike.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  
    firebase.firestore()
      .collection('bikes')
      .add(bike)
      .then((snapshot) => {
        bike.id = snapshot.id;
        snapshot.set(bike);
      }).then(() => addComplete(bike))
      .catch((error) => console.log(error));
  }