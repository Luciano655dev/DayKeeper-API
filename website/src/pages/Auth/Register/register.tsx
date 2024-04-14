import {
    StyledBody,
    StyledForm,
    StyledInput,
    StyledButton,
    StyledAlert,
    StyledCheckboxContainer
} from './registerCSS';
import axios from "axios"
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

function Register(){
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [checkboxValue, setCheckboxValue] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const handleForm = async () => {
        try {
            if(!checkboxValue) return setErrMsg("Aceite os termos de serviço para continuar")

            const response = await axios.post('http://localhost:3000/auth/register', form)

            if(response.status === 201)
                return navigate('/message?msg=USUARIO CRIADO, VERIFIQUE SEU EMAIL')
        } catch(err: any) {
            console.log(err)
            setErrMsg(err.response.data.msg)
        }
    }

    return (
        <StyledBody>
            <StyledForm>
                <h1>Register · DayKeeper</h1>
                
                <div className='inputClass'>
                    <label>Username</label>
                    <StyledInput type="text" name="name" placeholder="username" onChange={(e)=>setForm({...form, name: e.target.value})}></StyledInput>
                </div>
                <div className='inputClass'>
                    <label>Email</label>
                    <StyledInput type="text" name="email" placeholder="email" onChange={(e)=>setForm({...form, email: e.target.value})}></StyledInput>
                </div>
                <div className="inputClass">
                    <label>Password</label>
                    <StyledInput type="text" name="password" placeholder="password" onChange={(e)=>setForm({...form, password: e.target.value})}></StyledInput>
                </div>

                <StyledCheckboxContainer>
                    <input type="checkbox" id="checkbox" onChange={(e: any)=>setCheckboxValue(e.target.value)}></input>
                    <label htmlFor="checkbox">Eu li e concordo com os <a href="/termos_e_condicoes">Termos e Condições</a>.</label>
                </StyledCheckboxContainer>

                <StyledButton onClick={handleForm}>Submit</StyledButton>
                {errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></>}

                <div className="linksContainer">
                    <label>Já tem uma conta? </label><Link to='/register'>Faça login</Link>
                </div>
            </StyledForm>
        </StyledBody>
    )
}

export default Register
