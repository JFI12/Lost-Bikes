import React, { Component, Fragment } from 'react'
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import {navigation} from "../App.js"
import { auth } from '../firebase.js'
import Profile from './profile';
import FrameForm from "./FrameForm";

export default class AddFrameScreen extends Component {
    state = {
        frame: {
          name: '',
          category: '',
          subIngredients: []
        },
        currentSubIngredient: null,
      }
    componentDidMount() {
    const currentFrame = this.props.navigation.getParam('frame');

    if (currentFrame) {
        this.setState(prevState => ({ frame: prevState.frame = currentFrame }))
    }
    }

    onFoodUpdated = (frame) => {
    console.log(frame);
    this.props.navigation.popToTop();
    }
    


    setCurrentSubIngredient = (frame) => {
        this.setState(prevState => ({
          currentSubIngredient: prevState.currentSubIngredient = text
        }));
      }

    submitSubIngredients = () => {
    let ingredient = this.state.currentSubIngredient;

        if (ingredient && ingredient.length > 2) {
            this.setState(prevState => ({
            frame: { ...prevState.frame, subIngredients: [...prevState.frame.subIngredients, ingredient] },
            }))
        }
    }


    render(){
    return (
        <Fragment>
            <ScrollView>
                <FrameForm
                setSubIngredients={this.setCurrentSubIngredient}
                submitSubIngredients={this.submitSubIngredients}
                frame={this.state.frame}
                onFrameAdded={this.props.navigation.getParam('FraneAddedCallback')}
                onFrameUpdated={this.onFrameUpdated}/>
            </ScrollView>
        </Fragment>

    );
  }
}