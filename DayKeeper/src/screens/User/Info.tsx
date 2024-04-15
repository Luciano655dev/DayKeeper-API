import { StyleSheet, Text, View, Image, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'

export default function Profile({ route }: any) {
  const user = useSelector((state: any) => state.userReducer)
  const username = route.params.username
  const [userData, setUserData]: any = useState({})
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState('')

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true)
      try{
        const token = await SecureStore.getItemAsync('userToken')
        const response = await axios.get(`http://192.168.100.80:3000/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserData(response.data.user)
      }catch(error: any){
        setErrMsg(error.response.data.msg || error.message)
      }
      setLoading(false)
    }

    fetchData()
  }, [route])

  const resetToken = async()=>{
    await SecureStore.setItemAsync('userToken', '')
    dispatch({ type: 'user', payload: {
      name: '',
      id: '',
      pfp: ''
    } })
  }

  if(loading) return <View>
    <Text>Loading...</Text>
  </View>

  if(errMsg) return <View>
    <Text>{errMsg}</Text>
    <Button
      title='Log Out here'
      onPress={()=>resetToken()}
    />
  </View>

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userData.profile_picture.url }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
        }}
      />
      <Text style={styles.title}>{userData.name}</Text>

      {
        user.name == username ?
        <View>
          <Text style={styles.title}>SAME USER</Text>
          <Button
            title='Log Out here'
            onPress={()=>resetToken()}
          />
        </View>
        :
         <View />
      }
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
