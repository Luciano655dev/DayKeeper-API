import { StyledForm, StyledInput, StyledButton, StyledAlert } from './ForgetPasswordCSS'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ForgetPassword(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const handleForm = async ()=>{
        try{
            await axios.post('http://localhost:3000/auth/forget-password', { email })
            navigate('/message?msg=UM EMAIL FOI ENVIADO, VERIFIQUE-O')
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    return <StyledForm>
        { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }
        <StyledInput type='text' name='email' placeholder='Digite seu email' onChange={(e: any)=>setEmail(e.target.value)}></StyledInput>
        <StyledButton onClick={handleForm}>Send</StyledButton>
    </StyledForm>
}

export default ForgetPassword