import { StyledForm, StyledInput, StyledButton, StyledAlert } from './loginCSS';
import axios from 'axios'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'

function LogIn(){
    const navigate = useNavigate()
    const [form, setForm] = useState({})
    const [errMsg, setErrMsg] = useState('')

    const handleForm = async ()=>{
        try{
            const response = await axios.post('http://localhost:3000/auth/login', form)
            Cookies.set('userToken', response.data.token, { expires: 7 })
            return navigate('/')
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    return <div>
    {!Cookies.get('userToken') ?
        <StyledForm>
            { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }
            
            <StyledInput type='text' name='name' placeholder='username' onChange={(e: any)=>setForm({...form, name: e.target.value })}></StyledInput>
            <StyledInput type='text' name='password' placeholder='password' onChange={(e: any)=>setForm({...form, password: e.target.value })}></StyledInput>

            <StyledButton onClick={handleForm}>Submit</StyledButton>

            <br></br><br></br>
            <Link to='/forget_password'>Forget password</Link>
        </StyledForm>
        :
        <div>
            <h1>VOCÊ JÁ ESTÁ LOGADO, FAÇA LOG-OUT PARA FAZER LOGIN NOVAMENTE</h1>
        </div>
    }
    </div>
}

export default LogIn