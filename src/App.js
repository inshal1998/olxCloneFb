import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet,  View } from 'react-native'
import { DefaultTheme ,Provider as PaperProvider  } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateAdds from './Screens/CreateAdds';
import ListItemScreen from './Screens/ListItemScreen';
import Login from './Screens/Login'
import SignUp from './Screens/SignUp';
import AccountScreen from './Screens/AccountScreen';
import Feather from "react-native-vector-icons/Feather";
import auth from "@react-native-firebase/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{
                headerShown: false
            }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{
                headerShown: false
            }} />
        </Stack.Navigator>
    )
}

const TabNavigation = () => {
    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color  , size}) => {
          let iconName;
            
          if (route.name === 'ListItemScreen') {
            iconName = "home"
            size = 25
          }
          else if(route.name === 'CreateAdds'){
            iconName = "plus-circle"
            size = 25
          }else{
            iconName = "user"
            size = 25
          }
          return <Feather style={{top:5}} name={iconName} size={size} color={color}/> 
        },
        tabBarActiveTintColor: 'deepskyblue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle:{
          backgroundColor: '#fff',
          height: 50,
        }
      })} 
      >
            <Tab.Screen name="ListItemScreen" component={ListItemScreen} options={{
              headerShown: false,
              title: '',
            }}/>
            <Tab.Screen name="CreateAdds" component={CreateAdds} options={{
              headerShown: false,
              title: '',
            }}
            />
            <Tab.Screen name="AccountScreen" component={AccountScreen} options={{
              headerShown: false,
              title: '',
            }}
            />
        </Tab.Navigator>
    )
}


const Navigation = () => {
    const [user, setuser] = useState('')
    useEffect(() => {
        const unsuscribe =  auth().onAuthStateChanged((userExist) => {
            if(userExist){
              setuser(userExist)
            }else{
              setuser('')
                console.log("no user")
            }
        }
        )
        return () => {
            unsuscribe
        }
    }, [])
  // const user = ""
  return (
        <NavigationContainer>
          {
            user ? <TabNavigation/> : <AuthNavigation/>
          }

        </NavigationContainer>
    )
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'deepskyblue',
  },
};


const App = () => {
  return (
    <>
    <PaperProvider theme={theme}>
      <StatusBar backgroundcolor="deepskyblue"/>
          <View style={styles.container}>
                <Navigation/>
          </View>
      </PaperProvider>
    </>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})
