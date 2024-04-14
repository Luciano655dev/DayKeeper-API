import { NavigationContainer } from "@react-navigation/native"
import { useEffect, useState } from 'react'
import store from '../redux/store'

import AuthRoutes from "./auth.routes"
import DrawerRoutes from "./drawer.routes"
import { Provider } from "react-redux"
import rootReducer from "../redux/rootReducer"

export default function Routes(){
    return (
        <Provider store={store}>
            <NavigationContainer>
                <DrawerRoutes />
            </NavigationContainer>
        </Provider>
    )
}