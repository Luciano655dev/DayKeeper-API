import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Tweet from '../components/Tweet'
import { useSelector } from 'react-redux';

export default function Feed() {
  const user = useSelector((state: any) => state.userReducer)
  const [data, setData] = useState([])
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
        setData(response.data.data)
      }catch(error: any){
        setErrMsg(error.response.data.msg || error.msg)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleReaction = async (reaction: number, username: String, posttitle: String) => {
    try {
      const token = await SecureStore.getItemAsync('userToken') 
      const response: any = await axios.post(`http://192.168.100.80:3000/${username}/${posttitle}/react`, {
        reaction
      }, { headers: { Authorization: `Bearer ${token}` } })

      const newReactions = response.data.post.reactions.map((r: any) => {
        if(r.user.name) return { ...r, user: r.user.name }
        return r
      })

      console.log(newReactions)

      return newReactions
    } catch (error: any) {
      console.log(error.response.data.msg || error.message)
    }
  }

  if(loading) return <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
  if(errMsg) return <View style={styles.container}>
    <Text>{errMsg}</Text>
  </View>

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        {
          data.map( (data: any) =>  <Tweet
            key={data._id}
            username={data.user_info.name}
            pfp={data.user_info.profile_picture.url}
            title={data.title}
            text={data.data}
            comments={data.comments}
            reactions={data.reactions}
            loggedUsername={user.name}

            handleReaction={handleReaction}
          /> )
        }
      </ScrollView>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },

  fixedView : {
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  floatingButton: {
    borderWidth:1,
    borderColor:'#999',
    alignItems:'center',
    justifyContent:'center',
    // position: 'absolute',                                          
    width:70,
    bottom: 10,                                                    
    right: 10,
    height:70,
    backgroundColor:'#4BB0EE',
    borderRadius:100,
  }
  
});
