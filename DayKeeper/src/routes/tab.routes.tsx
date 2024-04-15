import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Feather } from '@expo/vector-icons'

import DrawerRoutes from "./drawer.routes"
import Feed from "../screens/Feed"
import UserInfo from '../screens/User/Info'
import New from "../screens/New"

const Tab = createBottomTabNavigator()

const FeedStack = createNativeStackNavigator()
function FeedStackScreen(){
    return (
        <FeedStack.Navigator screenOptions={{ headerShown: false }}>
          <FeedStack.Screen name="Feed" component={Feed} />
          <FeedStack.Screen name="UserInfo" component={UserInfo} />
        </FeedStack.Navigator>
    )
}

export default function TabRoutes(){
    return (
        <Tab.Navigator screenOptions={{ title: '' }}>
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
        </Tab.Navigator>
    )
}