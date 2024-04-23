import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable
} from "react-native";
import { useSelector } from "react-redux";

export default function CreateComment({ navigation, route }: any){
  const user = useSelector((state: any) => state.userReducer)
  const api_key = 'fzRhwakZC0q3AvSUuBo03vp6IIkAAG36'
  const [search, setSearch]: any = useState('')
  const [alreadyCommented, setAlreadyCommented] = useState(false)

  const [gifs, setGifs]: any = useState([])
  const [selectedGif, setSelectedGif]: any = useState(null)
  const [gifSearch, setGifSearch]: any = useState('')
  const [gifSearchTxt, setGifSearchTxt]: any = useState('')
  const [openGifArea, setOpenGifArea] = useState(false)
  const [gifsLoading, setGifsLoading]: any = useState(true)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const {
    username,
    pfp,
    title,
    text
  } = route.params

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true)
      const token = await SecureStore.getItemAsync('userToken')
      try{
        const postResponse = await axios.get(`http://192.168.100.80:3000/${username}/${title}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setAlreadyCommented(postResponse.data.post.comments.some((el: any) => el.user.name == user.name))
      }catch(error: any){
        setError(error.response.data.message || error.message)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(()=>{
    const fetchData = async()=>{
      setGifsLoading(true)
      try{
        let reqStr = `http://api.giphy.com/v1/gifs/trending?api_key=${api_key}`

        if(gifSearch != '')
          reqStr = `http://api.giphy.com/v1/gifs/search?q=${gifSearch}&api_key=${api_key}`

        const response = await axios.get(reqStr)
  
        setGifs(response.data.data.map((gifObj: any) => {
          return {
            name: gifObj.title,
            id: gifObj.id,
            url: gifObj.images.original.url
          }
        }))
      }catch (error: any) {
        setError(error.response.data.msg)
      }
      setGifsLoading(false)
    }
    fetchData()
  }, [gifSearch])

  const handleSendComment = async()=>{
    setLoading(true)
    try{
      const token = await SecureStore.getItemAsync('userToken')

      await axios.post(`http://192.168.100.80:3000/${username}/${title}/comment`,{
        comment: alreadyCommented ? 'dummy text' : search,
        gif: selectedGif?.id || undefined
      }, { headers: { Authorization: `Bearer ${token}` } })

      navigation.goBack()
    }catch(error: any){
      console.log(error)
    }
    setLoading(false)
  }

  if(loading) return <View>
    <Text> loading... </Text>
  </View>

  if(error) return <View>
    <Text> {error} </Text>
  </View>

  if(alreadyCommented) return <View style={styles.container}>
    <View style={styles.postContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('UserInfo', { username })}>
        <Image style={styles.avatar} source={{ uri: pfp }}/>
      </TouchableOpacity>
      <Text style={styles.author}>{username}</Text>
      <Text style={styles.authorAt}>{title}</Text>
    </View>

    <View style={styles.commentContainer}>
      <Button disabled={loading} title="Delete your previous comment" onPress={()=>handleSendComment()}></Button>
    </View>
  </View>
  
  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UserInfo', { username })}>
          <Image style={styles.avatar} source={{ uri: pfp }}/>
        </TouchableOpacity>
        <Text style={styles.author}>{username}</Text>
        <Text style={styles.authorAt}>{title}</Text>
      </View>
      <Text style={styles.content}>{text}</Text>

      <View style={styles.commentContainer}>
        <TextInput placeholder="Seu comentario aqui" onChangeText={(text: String)=>setSearch(text)}></TextInput>
        <Button disabled={loading} title="Gifs" onPress={()=>setOpenGifArea(!openGifArea)}></Button>
        <Button disabled={loading} title="Send" onPress={()=>handleSendComment()}></Button>
      </View>

      {
        openGifArea ?
          <ScrollView contentContainerStyle={styles.gifsContainer}>
            <View style={styles.gifSearchContainer} >
              <TextInput
                style={styles.gifSearchText}
                placeholder="Digite seu gif aqui"
                onChangeText={(text: String)=>setGifSearchTxt(text)}
              ></TextInput>
              <Button title="Search" onPress={()=>setGifSearch(gifSearchTxt)}/>
            </View>

            {
              !gifsLoading ?
                gifs.map((gif: any)=>
                  <Pressable onPress={() => setSelectedGif(gif)} key={Math.random()}>
                    <Image style={styles.gif} source={{ uri: gif.url }}></Image>
                  </Pressable>
                )
              : <View></View>
            }
          </ScrollView>
        : <View />
      }

      {
        selectedGif ? 
          <View style={styles.selectedGif}>
            <Pressable style={styles.closeGifButton} onPress={()=>setSelectedGif(null)}></Pressable>
            <Image style={styles.selectedGif} source={{ uri: selectedGif?.url || '' }} />
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
    padding: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  gifsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
    backgroundColor: 'black'
  },
  gifSearchContainer: {
    zIndex: 10,
    flexDirection: 'row'
  },
  gifSearchText: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: 200
  },
  gif: {
    width: 120,
    height: 120
  },
  selectedGif: {
    position: 'relative',
    width: 240,
    height: 240
  },
  closeGifButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    zIndex: 10,
    backgroundColor: 'red'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100
  },
  author: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
  },

  authorAt: {
    marginLeft: 10,
    fontSize: 16,
    color: "#999",
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    color: "#1C2022",
    marginVertical: 10
  },
});