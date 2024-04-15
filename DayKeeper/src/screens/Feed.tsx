import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';

export default function Feed() {
  const navigation: any = useNavigation()
  const [postsData, setPostsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState('')

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true)
      try{
        const token = await SecureStore.getItemAsync('userToken')
        const response = await axios.get(`http://192.168.100.80:3000/search`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPostsData(response.data.data)
      }catch(error: any){
        setErrMsg(error.response.data.msg || error.msg)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if(loading) return <View style={styles.container}>
    <Text style={styles.title}>Loading...</Text>
  </View>
  if(errMsg) return <View style={styles.container}>
    <Text style={styles.title}>{errMsg}</Text>
  </View>

  return (
    <View style={styles.container}>
      {
        postsData.map( (data: any) => <View key={data._id}>
          <Pressable onPress={()=>navigation.navigate('PostInfo', { username: data.user_info.name, posttitle: data.title })}>
            <Text style={styles.title}>{data.user_info.name}</Text>
          </Pressable>
          <Text style={styles.text}>{data.data}</Text>
        </View>)
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
  },
  text: {
    fontSize: 10
  }
});
