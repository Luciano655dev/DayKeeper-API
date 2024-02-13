import { StyledForm, StyledInput, StyledButton, StyledAlert } from './ResetPasswordCSS';
import axios from 'axios'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function ForgetPassword(){
    // Get the query 'token'
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')

    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const handleForm = async ()=>{
        try{
            const response = await axios.post(`http://localhost:3000/auth/reset-password?token=${token}`, { password: newPassword })
            if(response.status != 200) setErrMsg(response.data.msg)

            return navigate('/message?msg=SUA SENHA FOI REDEFINIDA COM SUCESSO')
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    return <StyledForm>
        { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }
        <StyledInput type='text' name='email' placeholder='Digite a nova senha' onChange={(e: any)=>setNewPassword(e.target.value)}></StyledInput>
        <StyledButton onClick={handleForm}>Send</StyledButton>
    </StyledForm>
}

export default ForgetPassword