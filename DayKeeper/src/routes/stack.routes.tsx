import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Profile from "../screens/User/Info"
import { useSelector } from "react-redux"

import TabRoutes from "./tab.routes"
const Stack = createNativeStackNavigator()

export default function StackRoutes(){
    const user = useSelector((state: any) => state.userReducer)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="UserInfo"
                initialParams={{ username: user.name }}
                component={Profile}
            />
        </Stack.Navigator>
    )
}