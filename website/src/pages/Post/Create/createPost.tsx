import {
    StyledForm,
    StyledInput,
    StyledTextArea,
    StyledButton,
    StyledAlert
} from './createPostCSS';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function createPost(){
    const navigate = useNavigate()
    const token = Cookies.get('userToken')
    const [form, setForm] = useState({ data: '' })
    const [images, setImages]: any = useState([])
    const [errMsg, setErrMsg] = useState('')

    const handleImageChange = (e: any) => {
        const file = e.target.files[0]
        if(typeof file != 'undefined')
            setImages([...images, e.target.files[0]])
    }

    const handleRemoveImage = (index: any)=>
        setImages((prevFiles: any) => prevFiles.filter((_: any, i: any) => i !== index))

    useEffect(()=>{
        console.log(images)
    }, [images])

    const handleForm = async () =>{
        try{
            const user: any = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })

            const formData: any = new FormData()
            formData.append('data', form.data)
            if(images.length != 0)
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
        <h1>POST</h1>

        <div className='inputClass'>
            <label></label>
            <StyledTextArea
                name='data'
                placeholder='DGITE SEU TEXTO AQUI'
                onChange={(e)=>setForm({...form, data: e.target.value})}
            ></StyledTextArea>
        </div>

        <div className="imagesContainer">
            <label htmlFor='fileInput'>
                <img
                    src='data:image/png;base64,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'
                ></img>
                Upload
            </label>

            <StyledInput 
                type="file"
                id='fileInput'
                accept="image/*, video/*"
                onChange={handleImageChange}
                multiple
            />

            <div className='imagesPreview'>
                {
                    images.map((file: any, index: any) => (
                        <div key={index}>
                            <button onClick={() => handleRemoveImage(index)}>X</button>
                            <object
                                data={URL.createObjectURL(file) || ''}
                                style={{ objectFit: 'contain' }}
                            ></object>
                        </div>
                    ))
                }
            </div>
        </div>

        <StyledButton onClick={handleForm}>PUBLISH</StyledButton>
        { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }
    </StyledForm>
}