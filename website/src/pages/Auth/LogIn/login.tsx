import {
    StyledBody,
    StyledForm,
    StyledInput,
    StyledButton,
    StyledAlert
} from './loginCSS';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'

function LogIn(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', password: '' })
    const [errMsg, setErrMsg] = useState('')

    const handleForm = async ()=>{
        try{
            const response = await axios.post('http://localhost:3000/auth/login', form)
            Cookies.set('userToken', response.data.token, { expires: 20 })
            
            dispatch({ type: 'user', payload: {
                name: response.data.user.name,
                id: response.data.user._id,
                pfp: response.data.user.profile_picture
            } })
            return navigate('/')
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    if(Cookies.get('userToken')) return <div>
        <h1>VOCÊ JÁ ESTÁ LOGADO, FAÇA LOG-OUT PARA FAZER LOGIN NOVAMENTE</h1>
    </div>

    return <StyledBody>
        <StyledForm>
            <h1>Login · DayKeeper</h1>

            <div className='inputClass'>
                <label>Username</label>
                <StyledInput
                    required
                    type='text'
                    name='name'
                    placeholder='username'
                    onChange={(e: any)=>setForm({...form, name: e.target.value })}
                ></StyledInput>
            </div>

            <div className='inputClass'>
                <label>Password</label>
                <StyledInput
                    required
                    type='text'
                    name='password'
                    placeholder='password'
                    onChange={(e: any)=>setForm({...form, password: e.target.value })}
                ></StyledInput>
            </div>

            <StyledButton onClick={handleForm}>Submit</StyledButton>
            { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }

            <div className='linksContainer'>
                <label>Esqueceu sua senha? </label><Link to='/forget_password'> Clique aqui</Link>
            </div>

            <div className="linksContainer">
                <label>Novo por aqui? </label><Link to='/register'> Crie sua conta</Link>
            </div>
        </StyledForm>
    </StyledBody>
}

export default LogIn