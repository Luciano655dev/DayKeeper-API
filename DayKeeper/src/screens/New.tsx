import { Button, StyleSheet, Image, View, Pressable, TextInput } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

export default function New() {
  const maxImages = 5
  const [images, setImages]: any = useState([])

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: maxImages - images.length
    });

    if (!result.cancelled)
      setImages([...images, ...result.assets.map((val: any) => { return { uri: val.uri, type: val.type } })])
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Digite seu post aqui'></TextInput>
      <Button title="Escolher Imagem" onPress={pickImage} />
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

      <Button title='Send'></Button>
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
