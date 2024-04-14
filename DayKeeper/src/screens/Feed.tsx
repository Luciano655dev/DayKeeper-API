import { StyleSheet, Text, View, Button } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useDispatch, useSelector } from 'react-redux'

export default function Feed() {
  const user = useSelector((state: any) => state.userReducer)
  const dispatch = useDispatch()

  const resetToken = async()=>{
    await SecureStore.setItemAsync('userToken', '')
    dispatch({ type: 'user', payload: {
      name: '',
      id: '',
      pfp: ''
    } })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>

      <Button
        title='Log Out here'
        onPress={()=>resetToken()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  }
});
