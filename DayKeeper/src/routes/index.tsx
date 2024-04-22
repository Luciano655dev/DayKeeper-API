import { NavigationContainer } from "@react-navigation/native"
import store from '../redux/store'

import TabRoutes from "./tab.routes"
import StackRoutes from "./stack.routes"
import { Provider } from "react-redux"

export default function Routes(){
    return (
        <Provider store={store}>
            <NavigationContainer>
                <TabRoutes />
            </NavigationContainer>
        </Provider>
    )
}