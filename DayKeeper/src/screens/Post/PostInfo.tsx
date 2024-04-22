import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

export default function Profile({ route }: any) {
  const navigation: any = useNavigation()
  const user = useSelector((state: any) => state.userReducer)
  const { username, posttitle } = route.params
  const [postData, setPostData]: any = useState({})
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState('')

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true)
      try{
        const token = await SecureStore.getItemAsync('userToken')
        const response = await axios.get(`http://192.168.100.80:3000/${username}/${posttitle}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPostData(response.data.post)
      }catch(error: any){
        setErrMsg(error.response.data.msg || error.message)
      }
      setLoading(false)
    }

    fetchData()
  }, [route])

  if(loading) return <View>
    <Text>Loading...</Text>
  </View>

  if(errMsg) return <View>
    <Text>{errMsg}</Text>
  </View>

  return (
    <View style={styles.container}>
      <Pressable onPress={()=>navigation.navigate('UserInfo', { username })}>
        <Text style={styles.title}>{postData.user.name}</Text>
      </Pressable>
      <Text>{postData.data}</Text>

      {
        user.name == username ?
        <View>
          <Text style={styles.title}>FROM LOGGED USER</Text>
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