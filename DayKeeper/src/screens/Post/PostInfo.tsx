import { StyleSheet, Text, View, Pressable, Button, Image, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'

export default function Profile({ route, navigation }: any) {
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

  const handleDeletePost = async()=>{
    setLoading(true)
    try{
      const token = await SecureStore.getItemAsync('userToken')
      await axios.delete(`http://192.168.100.80:3000/${posttitle}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigation.navigate('Feed')
    }catch(error: any){
      setErrMsg(error.response.data.msg || error.message)
    }
    setLoading(false)
  }

  const handleDeleteComment = async()=>{
    setLoading(true)
    try{
      const token = await SecureStore.getItemAsync('userToken')

      await axios.post(`http://192.168.100.80:3000/${username}/${posttitle}/comment`,{
        comment: 'dummy text',
      }, { headers: { Authorization: `Bearer ${token}` } })

      navigation.goBack()
    }catch(error: any){
      console.log(error)
    }
    setLoading(false)
  }

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

      <View style={styles.imageContainer}>
        {
          postData.files.map((file: any) =>
            file.mimetype.split('/')[0] == 'image' ?
              <Image key={file._id} source={{ uri: file.url }} style={styles.image} /> :
              <View key={file._id} />
          )
        }
      </View>

      {
        user.name == username ?
        <View>
          <Text style={styles.title}>FROM LOGGED USER</Text>
          <Button
            title='Delete Post'
            color={'red'}
            onPress={handleDeletePost}
          />
        </View>
        :
         <View />
      }

      <ScrollView style={styles.commentsContainer}>
        {
          postData.comments.find((com: any) => com.user.name == user.name) ?
              <Button title='delete comment' color={'red'} onPress={handleDeleteComment}></Button>
             :
              <Button title='create comment' onPress={()=>navigation.navigate('CreateComment', {
                username,
                pfp: postData.user.profile_picture.url,
                title: postData.title,
                text: postData.text
              })}></Button>
        }
        {
          postData.comments.map((com: any) => <View style={styles.comment} key={com._id}>
            <View style={styles.commentTop}>
              <Image style={styles.commentPfp} source={{ uri: com.user.profile_picture.url }}/>
              <Text>{com.user.name}</Text>
            </View>
            <Text>{com.comment}</Text>
            {
              com.gif ?
                <Image key={com.gif.id} style={styles.image} source={{ uri: com.gif.url }}/> :
                <View key={com._id} />
            }
          </View>)
        }
      </ScrollView>
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderColor: 'black',
    borderWidth: 1
  },

  commentsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 20,
    borderTopColor: 'black',
    borderTopWidth: 2,
    minWidth: 300
  },
  comment: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  commentTop: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  commentPfp: {
    width: 20,
    height: 20,
    borderRadius: 50
  }
});
