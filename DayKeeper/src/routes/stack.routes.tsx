import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Profile from "../screens/User/UserInfo"
import { useSelector } from "react-redux"

import UserInfo from '../screens/User/UserInfo'
import PostInfo from '../screens/Post/PostInfo'
const Stack = createNativeStackNavigator()

export default function StackRoutes(){
    const user = useSelector((state: any) => state.userReducer)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="UserInfo"  initialParams={{ username: user.name }} component={UserInfo} />
          <Stack.Screen name="PostInfo" component={PostInfo} />
        </Stack.Navigator>
    )
}