import { StyledForm, StyledInput, StyledButton, StyledAlert, StyledLabel } from './createPostCSS';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function createPost(){
    const navigate = useNavigate()
    const token = Cookies.get('userToken')
    const [form, setForm] = useState({ data: '' })
    const [images, setImages]: any = useState(null)
    const [errMsg, setErrMsg] = useState('')

    const handleImageChange = (e: any) => {
        const fileList = e.target.files
        const imagesArray = Array.from(fileList)
        setImages(imagesArray)
    }

    const handleForm = async () =>{
        try{
            const user: any = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })

            const formData: any = new FormData()
            formData.append('data', form.data)
            if(images)
                for (let i = 0; i < Math.min(5, images.length); i++)
                    formData.append('files', images[i])

            const post: any = await axios.post('http://localhost:3000/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`    
                }
            })
            navigate(`/${user.data.user.name}/${post.data.post.title}`)
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    return <StyledForm>
        <StyledLabel>POST</StyledLabel>

        { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }

        <StyledInput type='text' name='data' placeholder='DGITE SEU TEXTO AQUI' onChange={(e)=>setForm({...form, data: e.target.value})}></StyledInput>
        <StyledInput type="file" multiple onChange={handleImageChange} />

        <StyledButton onClick={handleForm}>PUBLISH</StyledButton>
    </StyledForm>
}