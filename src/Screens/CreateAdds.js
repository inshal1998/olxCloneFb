import React, { useState } from 'react'
import { View, Text,StyleSheet,Alert} from 'react-native'
import { TextInput,Button} from 'react-native-paper'
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import { launchCamera , launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
const CreateAdds = () => {
    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [year, setyear] = useState('')
    const [price, setprice] = useState('')
    const [sellerContact, setsellerContact] = useState('')
    const [image, setimage] = useState('')

    const openCamera = ()=>{
        launchImageLibrary({quality:0.5},(fileobj)=>{
               console.log(fileobj.assets[0].uri).toString()
            const uploadTask =  storage().ref().child(`/items/${Date.now()}`).putFile((fileobj.assets[0].uri).toString())
            uploadTask.on('state_changed', 
            (snapshot) => {
               
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                 if(progress==100){alert("uploaded")}
            }, 
            (error) => {
               alert("something went wrong",error)
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    setimage(downloadURL)
                });
            }
            );
           }
           )
       }

    const postdata = async () => {
        sendNotification()
        try{
            await firestore().collection('ads').add({
                name,
                description,
                year,
                price,
                sellerContact,
                image ,
                uid:auth().currentUser.uid
            })
            .then(() => {
                Alert.alert("Data added successfully")
            })
            .catch(error => {
                Alert.alert(error.message)
                console.log(error.message);
            })
        }
        catch(error){
            console.log("Main Catch" , error)
        }
        
    }

    const sendNotification = async () => {
         firestore().collection('usertoken').get().then(snapshot => {
            const userDeviceToken = snapshot.docs.map(  doc => {
                return doc.data().token
            })
            console.log(userDeviceToken);
            fetch('https://8086-122-177-252-69.ngrok.io/send-notification' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tokens:userDeviceToken,
                })
            })
        })}
    



    return (
        <View style={styles.container}>
        <Text style={styles.text}>Create Ad!</Text>
        <TextInput
                label="Ad title"
                value={name}
                mode="outlined"
                onChangeText={text => setname(text)}
            />
        <TextInput
                label="Describe what you are selling"
                value={description}
                mode="outlined"
                numberOfLines={3}
                multiline={true}
                onChangeText={text => setdescription(text)}
            />
            <TextInput
                label="year of purchase"
                value={year}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={text => setyear(text)}
            />
            <TextInput
                label="price in INR"
                value={price}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={text => setprice(text)}
            />
            <TextInput
                label="Your contact Number"
                value={sellerContact}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={text => setsellerContact(text)}
            />
            <Button 
                icon="camera"  
                mode="contained" 
                onPress={() => {openCamera()}}>
                 upload Image
             </Button>
            <Button 
                mode="contained" 
                onPress={() =>{postdata()}}>
                 Post
             </Button>
    </View>
    )
}

export default CreateAdds

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginHorizontal:20,
        justifyContent:"space-evenly"
    },
    text:{
        fontSize:22,
        textAlign:"center"
    }
})
