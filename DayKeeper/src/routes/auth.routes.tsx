import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from '@expo/vector-icons'

import Login from "../screens/auth/Login"
import Register from "../screens/auth/Register"

const Tab = createBottomTabNavigator()

export default function AuthRoutes(){
    return (
        <Tab.Navigator screenOptions={{ title: '' }}>
            <Tab.Screen
                name="Login"
                component={Login}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        <Feather
                            name="log-in"
                            color={color}
                            size={size}
                        />,
                    tabBarLabel: 'Login'
                }}
            />

            <Tab.Screen
                name="Register"
                component={Register}
                options={{
                    tabBarIcon: ({ color, size }) =>
                        <Feather
                            name="user-plus"
                            color={color}
                            size={size}
                        />,
                    tabBarLabel: 'Register'
                }}
            />
        </Tab.Navigator>
    )
}