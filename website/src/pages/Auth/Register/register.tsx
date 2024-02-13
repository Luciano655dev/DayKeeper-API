import { StyledForm, StyledInput, StyledButton, StyledAlert, StyledLabel } from './registerCSS';
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register(){
    const [Form, SetForm] = useState({ name: '', email: '', password: '', private: '' })
    const [Image, setImage] = useState(null)
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const handleForm = async () => {
        try {
            const formData = new FormData()
            formData.append('name', Form.name)
            formData.append('email', Form.email)
            formData.append('password', Form.password)
            formData.append('private', Form.private || 'false')
            if(Image) formData.append('file', Image) // Assuming Image is the file object

            const response = await axios.post('http://localhost:3000/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(response.status === 201)
                return navigate('/message?msg=USUARIO CRIADO, VERIFIQUE SEU EMAIL')
        } catch(err: any) {
            console.log(err)
            setErrMsg(err.response.data.msg);
        }
    }

    const handleImageChange = (e: any) => setImage(e.target.files[0])

    return (
        <div>
            <StyledForm>
                {errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></>}
                <StyledInput type="file" onChange={handleImageChange} />
                <StyledInput type="text" name="name" placeholder="username" onChange={(e)=>SetForm({...Form, name: e.target.value})}></StyledInput>
                <StyledInput type="text" name="email" placeholder="email" onChange={(e)=>SetForm({...Form, email: e.target.value})}></StyledInput>
                <StyledInput type="text" name="password" placeholder="password" onChange={(e)=>SetForm({...Form, password: e.target.value})}></StyledInput>
                <StyledLabel>
                    <input type="checkbox" name="private" placeholder="private" onChange={(e)=>SetForm({...Form, private: e.target.value})}></input>
                    Private
                </StyledLabel>
                <StyledButton onClick={handleForm}>Submit</StyledButton>
            </StyledForm>
        </div>
    )
}

export default Register
