import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Feather } from '@expo/vector-icons'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import AuthRoutes from "./auth.routes"

import Feed from "../screens/Feed"
import UserInfo from '../screens/User/UserInfo'
import PostInfo from '../screens/Post/PostInfo'
import New from "../screens/New"

const Tab = createBottomTabNavigator()

const FeedStack = createNativeStackNavigator()
function FeedStackScreen(){
    return (
        <FeedStack.Navigator>
          <FeedStack.Screen name="Feed" component={Feed} />
          <FeedStack.Screen name="UserInfo" component={UserInfo} />
          <FeedStack.Screen name="PostInfo" component={PostInfo} />
        </FeedStack.Navigator>
    )
}

export default function TabRoutes(){
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.userReducer)
    const [logged, setLogged] = useState(false)

    useEffect(()=>{
        async function fetchData(){
            try{
                const token = await SecureStore.getItemAsync('userToken')
                if(!token) return setLogged(false)
                
                const userResponse = await axios.get('http://192.168.100.80:3000/auth/user', {
                    headers: { Authorization: `Bearer ${token}` },
                })

                dispatch({ type: 'user', payload: {
                    name: userResponse.data.user.name,
                    id: userResponse.data.user._id,
                    pfp: userResponse.data.user.profile_picture
                } })

                setLogged(true)
            }catch(error: any){
                console.log(error)
                setLogged(false)
            }
        }

        fetchData()
    }, [user.name])

    if(!logged) return <AuthRoutes></AuthRoutes>
    
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Main"
                component={FeedStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        <Feather
                            name="home"
                            color={color}
                            size={size}
                        />,
                    tabBarLabel: 'Início'
                }}
            />

            <Tab.Screen
                name="New"
                component={New}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        <Feather
                            name="plus"
                            color={color}
                            size={size}
                        />,
                    tabBarLabel: 'Novo'
                }}
            />

            <Tab.Screen
                name="User"
                component={UserInfo}
                initialParams={{ username: user.name }}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        <Feather
                            name="user"
                            color={color}
                            size={size}
                        />,
                    tabBarLabel: 'Novo'
                }}
            />
        </Tab.Navigator>
    )
}