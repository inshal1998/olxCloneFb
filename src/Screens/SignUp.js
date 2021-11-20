import React, { useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput,Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";

const SignUp = ({navigation}) => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    
    const userSignUp = async () => {
        try {
            if(!email || !password){
                Alert.alert("Please enter email and password")
                return
            }
            await auth().createUserWithEmailAndPassword(email,password)
            messaging().getToken().then(token => {
                firestore().collection('usertoken').add({
                    token:token,

                })
                console.log(token)
              })
            navigation.navigate('Login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <KeyboardAvoidingView>
             <View style={styles.box1}>
               <Image style={styles.logo} source={{uri :"http://artnames.info/wp-content/image/I/inshal1.jpg"}}/>
               <Text style={styles.text}>Please SignUp To Continue</Text>
            </View>
            <View style={styles.box2}>
            <TextInput
                label="Email"
                value={email}
                mode="outlined"
                onChangeText={text => setEmail(text)}
                />
            <TextInput
                label="password"
                value={password}
                mode="outlined"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                />
                 <Button  mode="contained" onPress={() => {userSignUp()}}>
                     SignUp
                 </Button>
                 <TouchableOpacity onPress={()=>{navigation.goBack('Login')}}>
                     <Text style={{textAlign:"center"}}>Already Registered ?</Text>
                 </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    box1:{
        alignItems:"center",
        paddingVertical:20,
    },
    box2:{
        paddingHorizontal:15,
        height:"50%",
        borderRadius:10,
        justifyContent:"space-evenly",
    },
    text:{
        fontSize:22,
        top:20,
        fontWeight:'900'
    },
    logo:{
        
        width:200,
        height:200 ,
        borderRadius:100
    }
})
