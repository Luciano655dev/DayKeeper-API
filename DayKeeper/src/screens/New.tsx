import { Button, StyleSheet, Image, View, Pressable, TextInput } from 'react-native'
import { useState } from 'react'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'

export default function New({ navigation }: any) {
  const maxImages = 5
  const [images, setImages]: any = useState([])
  const [text, setText]: any = useState('')
  const [loading, setLoading]: any = useState(false)

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: maxImages - images.length
    })

    if (!result.cancelled)
      setImages([...images, ...result.assets.map((val: any) => { return { uri: val.uri, type: val.type, fileName: val.fileName } })])
  }

  const handleForm = async () =>{
    setLoading(true)
    try{
      const token = await SecureStore.getItemAsync('userToken') 
      const user: any = await axios.get('http://192.168.100.80:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })

      const formData: any = new FormData()
      formData.append('data', text)
      for (let i = 0; i < images.length; i++)
        formData.append('files', {
          uri: images[i].uri,
          type: images[i].type,
          name: `${images[i].fileName}`,
        })

      const post: any = await axios.post('http://192.168.100.80:3000/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      navigation.navigate(`PostInfo`, { username: user.data.user.name, posttitle: post.data.post.title})
    }catch(error: any){
      console.log(error)
    }
    setLoading(false)
}

  return (
    <View style={styles.container}>
      <TextInput onChangeText={(text)=>setText(text)} placeholder='Digite seu post aqui'></TextInput>
      <Button title="Escolher Imagem" onPress={pickImage} disabled={loading} />
      <View style={styles.imageContainer}>
        {images.map((image: any, index: any) => (
          <Pressable onPress={()=>setImages([...images].filter((val, i: Number) => i != index))} key={index}>
            {
              image.type == 'image' ?
                <Image source={{ uri: image.uri }} style={styles.image} />
              :
                <View style={styles.image} /> // video comp here
            }
          </Pressable>
        ))}
      </View>

      <Button title='Send' onPress={handleForm}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
})
