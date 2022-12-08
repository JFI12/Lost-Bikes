import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button
} from 'react-native';
import GridList from './GridList';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { addframe, updateframe, uploadframe } from './frameApi';

import CurryImagePicker from './CurryImagePicker';

const frameForm = (props) => {

    setframeImage = (image) => {
      props.setFieldValue('imageUri', image.uri);
    }
  
    return (
      <View style={styles.container}>
        <CurryImagePicker image={props.frame.image} onImagePicked={setframeImage} />
        <TextInput
          value={props.values.name}
          style={styles.longFormInput}
          placeholder='Name'
          onChangeText={text => { props.setFieldValue('name', text) }}
        />
        <Text style={styles.validationText}> {props.errors.name}</Text>
        <TextInput
          value={props.values.category}
          style={styles.longFormInput}
          placeholder='Category'
          onChangeText={text => { props.setFieldValue('category', text) }}
        />
        <Text style={styles.validationText}> {props.errors.category}</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.formInput}
            onChangeText={text => { props.setSubIngredients(text) }}
            placeholder='Sub-ingredient'
          />
          <Button
            style={styles.button}
            title='Add'
            onPress={() => { props.submitSubIngredients() }} />
        </View>
        <GridList
          items={props.frame.subIngredients} />
        <Button
          title='Submit'
          onPress={() => props.handleSubmit()}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    row: {
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32
    },
    container: {
      width: 300,
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: 32,
    },
    formInput: {
      borderColor: '#B5B4BC',
      borderWidth: 1,
      padding: 8,
      height: 50,
      color: 'black',
      width: '75%',
      marginBottom: 16,
      marginTop: 16
    },
    validationText: {
      color: 'red'
    },
    longFormInput: {
      width: '100%',
      height: 50,
      color: 'black',
      borderColor: '#B5B4BC',
      borderWidth: 1,
      padding: 8,
      margin: 16
    },
  });
  
  export default withFormik({
    mapPropsToValues: ({ frame }) => ({
      name: frame.name,
      category: frame.category,
      imageUri: null
    }),
    enableReinitialize: true,
    validationSchema: (props) => yup.object().shape({
      name: yup.string().max(30).required(),
      category: yup.string().max(15).required()
    }),
    handleSubmit: (values, { props }) => {
      console.log(props);
  
      values.subIngredients = props.frame.subIngredients;
  
      console.log(values);
  
      if (props.frame.id) {
        values.id = props.frame.id;
        values.createdAt = props.frame.createdAt;
        values.image = props.frame.image;
        uploadframe(values, props.onframeUpdated, { updating: true });
      } else {
        uploadframe(values, props.onframeAdded, { updating: false });
      }
    },
  })(frameForm);