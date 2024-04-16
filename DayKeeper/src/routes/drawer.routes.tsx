import { createDrawerNavigator } from "@react-navigation/drawer"
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import TabRoutes from "./tab.routes"
import StackRoutes from "./stack.routes"
import { Feather } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { Image } from 'react-native'
import AuthRoutes from "./auth.routes"

const Drawer = createDrawerNavigator()

export default function DrawerRoutes(){
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

    if(!logged) return <AuthRoutes />

    return (
        <Drawer.Navigator screenOptions={{ title: '' }}>
            <Drawer.Screen
                name="Profile"
                component={StackRoutes}
                options={{
                    drawerIcon: ({ size }) => (
                        <Image
                            source={{ uri: user.pfp.url }}
                            style={{
                                width: size,
                                height: size,
                                borderRadius: 50,
                            }}
                        />
                    ),
                    drawerLabel: user.name
                }}
            />
            
            <Drawer.Screen 
                name="Home"
                component={TabRoutes}
                options={{
                    drawerIcon: ({ color, size }) =>
                        <Feather
                            name="home"
                            color={color}
                            size={size}
                        />,
                    drawerLabel: 'Início'
                }}
            />
        </Drawer.Navigator>
    )
}