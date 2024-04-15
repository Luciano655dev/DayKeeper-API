import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable
} from 'react-native'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

export default function Login() {
  const dispatch = useDispatch()
  const navigation: any = useNavigation()
  const [form, setForm] = useState({ name: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const handleForm = async ()=>{
    setLoading(true)
    try{
      const response = await axios.post('http://192.168.100.80:3000/auth/login', form)

      await SecureStore.setItemAsync('userToken', response.data.token)
      dispatch({ type: 'user', payload: {
        name: response.data.user.name,
        id: response.data.user._id,
        pfp: response.data.user.profile_picture
      } })
    }catch(err: any){
      setErrMsg(err.response.data.msg)
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Username:</Text>
        <TextInput
          placeholder='username'
          onChangeText={(text)=>setForm({...form, name: text})}
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          placeholder='password'
          onChangeText={(text)=>setForm({...form, password: text})}
        />

        <Button
          title='Send'
          onPress={()=>handleForm()}
          disabled={loading}
        />

        { errMsg ? <Text style={styles.label}>{errMsg}</Text> : <View /> }

        <Pressable style={styles.pressableLink} onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </Pressable>
      </View>
    </View>
  )
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
  label: {
    fontSize: 10
  },
  link: {
    fontSize: 10,
    color: 'blue'
  },
  pressableLink: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  }
});