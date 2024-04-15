import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Feather } from '@expo/vector-icons'

import Login from "../screens/auth/Login"
import Register from "../screens/auth/Register"
import ForgetPassword from '../screens/auth/ForgetPassword'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function AuthTabs() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="log-in" color={color} size={size} />
            ),
            tabBarLabel: 'Login'
          }}
        />
        <Tab.Screen
          name="Register"
          component={Register}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="user-plus" color={color} size={size} />
            ),
            tabBarLabel: 'Register'
          }}
        />
      </Tab.Navigator>
    );
}

export default function AuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthTabs"
        component={AuthTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

function createStackNavigator() {
    throw new Error("Function not implemented.")
}
