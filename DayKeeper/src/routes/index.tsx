import { NavigationContainer } from "@react-navigation/native"
import store from '../redux/store'

import DrawerRoutes from "./drawer.routes"
import TabRoutes from "./tab.routes"
import StackRoutes from "./stack.routes"
import { Provider } from "react-redux"

export default function Routes(){
    return (
        <Provider store={store}>
            <NavigationContainer>
                <DrawerRoutes />
            </NavigationContainer>
        </Provider>
    )
}