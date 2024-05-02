import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'

export default function UserEdit({ route, navigation }: any) {
  const user = useSelector((state: any) => state.userReducer)
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    pfp: { uri: '', fileName: '', type: '' },
    password: '',
    lastPassword: ''
  })
  const [showPasswordContainer, setShowPasswordContainer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled)
      setForm({...form, pfp: result.assets[0]})
  }

  const handleEdit = async()=>{
    try{
      const token = await SecureStore.getItemAsync('userToken')
      const formData: any = new FormData()

      if(form.name) formData.append('name', form.name)
      if(form.email) formData.append('email', form.email)
      if(form.bio) formData.append('bio', form.bio)
      if(form.pfp?.uri) {
        formData.append('file', {
          uri: form.pfp.uri,
          type: form.pfp.type,
          fileName: `${form.pfp.fileName}`
        })
      }
      if(form.password || form.lastPassword){
        formData.append('password', form.password)
        formData.append('lastPassword', form.lastPassword)
      }
      console.log(formData)
      await axios.put(`http://192.168.100.80:3000/update_user`, {...formData}, { headers: { Authorization: `Bearer ${token}` } })
      await resetToken()
    }catch(err: any){
      console.log(err.message)
      setErrMsg(err?.response?.data?.msg || err.message)
    }
  }

  const handleResetePfp = async () => {
    try{
      const token = await SecureStore.getItemAsync('userToken')
      await axios.put(`http://192.168.100.80:3000/reset_profile_picture`, {}, { headers: { Authorization: `Bearer ${token}` } })
      navigation.goBack()
    } catch (err: any) {
      setErrMsg(err.response.data.msg)
    }
  }

  const handleDelete = async()=>{
    setLoading(true)
    try{
      const token = await SecureStore.getItemAsync('userToken')
      await axios.delete(`http://192.168.100.80:3000/delete_user`, { headers: { Authorization: `Bearer ${token}` } })
      await resetToken()
    }catch(err: any){
      setErrMsg(err.response.data.message || err.response.data.msg ||err.message)
      console.log(err.response.data.message || err.response.data.msg ||err.message)
    }
    setLoading(false)
  }

  const resetToken = async()=>{
    await SecureStore.setItemAsync('userToken', '')
    dispatch({ type: 'user', payload: {
      name: '',
      id: '',
      pfp: ''
    } })
  }

  if(loading) return <Text>Loading...</Text>

  return <View style={styles.body}>
    <View style={styles.container}>
        <Text style={styles.title}>Profile Picture</Text>
        <Image style={styles.image} source={{ uri: form.pfp.uri || user.pfp.url }} />
        <Button title='Change pfp' onPress={pickImage} disabled={loading} ></Button>
        <Button title='Reset pfp' color={'red'} onPress={handleResetePfp} disabled={loading}></Button>
    </View>

    <View style={styles.container}>
        <Text style={styles.title}>User Info</Text>
        <TextInput value={user.name} onChangeText={(text: any)=>setForm({...form, name: text})}></TextInput>
        <TextInput value={user.email} onChangeText={(text: any)=>setForm({...form, email: text})}></TextInput>
        <TextInput value={user.bio} onChangeText={(text: any)=>setForm({...form, bio: text})}></TextInput>

        <Button title='change password' onPress={()=>setShowPasswordContainer(!showPasswordContainer)} disabled={loading}></Button>
        {
          showPasswordContainer ?
          <View>
            <TextInput placeholder='last password' onChangeText={(text: any)=>setForm({...form, lastPassword: text})}></TextInput>
            <TextInput placeholder='new password' onChangeText={(text: any)=>setForm({...form, password: text})}></TextInput>
          </View>
          : <View />
        }

        <Button title='send' color={'green'} onPress={handleEdit} disabled={loading}></Button>
        {
          errMsg ?
          <Text style={styles.errMsg} >{ errMsg }</Text>
          : <View />
        }
    </View>

    <View style={styles.container}>
      <Text style={styles.title}>Delete User</Text>
    </View>
  </View>
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  container: {
    marginTop: 20,
    alignItems: 'center',
    borderTopColor: 'black',
    borderTopWidth: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  errMsg: {
    color: 'red'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});
