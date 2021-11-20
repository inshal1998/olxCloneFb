import React, { useEffect, useState } from 'react'
import { View,FlatList,StyleSheet, StatusBar, Platform, Linking} from 'react-native'
import {  Button, Card,  Paragraph } from 'react-native-paper';
import firestore from "@react-native-firebase/firestore";
const ListItemScreen = () => {
    const [items,setItems] = useState([''])
    const openDial=(sellerContact)=>{
        console.log("Dial")
        if (Platform.OS === 'android') {
            Linking.openURL(`tel:${sellerContact}`)
        } else {
            Linking.openURL(`telprompt:${sellerContact}`)
        }
    }
    const getDetails = async () => {
        try{
            const data = await firestore().collection('ads').get()
            const result = data.docs.map(doc => doc.data())
            setItems(result)
        }catch(error){
            console.log(error)
        }
    }   
    useEffect(() => {
        getDetails()
        return () => {
            console.log("unmount");
        }
    },
    [])
    
    const renderItem = (item)=>{
        return(
        <Card key={item.uid} style={styles.card}>
          <Card.Title title={item.name}  />
              <Card.Content>
                <Paragraph>{item.description}</Paragraph>
                <Paragraph>{item.year}</Paragraph>
              </Card.Content>
            <Card.Cover source={{ uri: item.image }} />
                <Card.Actions>
            <Button>Rs :{item.price}</Button>
            <Button onPress={()=>{openDial()}}>{item.sellerContact}</Button>
          </Card.Actions>
        </Card>  
        )
      }
    return (
        <View>
            <StatusBar barStyle="skydeepblue" backgroundColor="deepskyblue"/>
        <FlatList 
            key={(item)=>item.uid}
            data={items}
            keyExtractor={(item)=>item.phone}
            renderItem={({item})=>renderItem(item)}
        />
    </View>
    )
}

export default ListItemScreen

const styles = StyleSheet.create({
    card:{
        margin:10 ,
        elevation:10,
        shadowColor: 'white',
        borderRadius:20,
    }
})
