import { StyledForm, StyledInput, StyledButton, StyledAlert, StyledTitle, StyledLabel } from './editPostCSS';
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function EditPost(){
    const navigate = useNavigate()
    const token = Cookies.get('userToken')
    const { title } = useParams()
    const [form, setForm] = useState({
        data: '',
        images: [],
        keep_files: ''
    })
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState('')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        const getPostInfo = async () => {
          try {
    
            const responseLoggedInUser = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })
            const responsePost = await(axios.get(`http://localhost:3000/posts/${title}`, { headers: { Authorization: `Bearer ${token}` } }))
            if(responseLoggedInUser.data.user.name != responsePost.data.post.user) {
                setLoading(false)
                return setErr('Você não pode editar posts de outros usuarios!')
            }

            setForm( responsePost.data.post )
            
            setLoading(false)
          } catch (error: any) {
            console.error('Erro ao obter informações do post:', error.response.data.msg)
            setErrMsg(error.response.data.msg)
            setLoading(false)
          }
        }
    
        getPostInfo()
    }, [])

    const handleEdit = async()=>{
        try{
            const user: any = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })

            const formData: any = new FormData()
            formData.append('data', form.data)
            formData.append('keep_files', form.keep_files)
            if(images)
                for (let i = 0; i < Math.min(5, images.length); i++)
                    formData.append('files', images[i])
            
            await axios.put(`http://localhost:3000/${title}`, formData, { headers: { Authorization: `Bearer ${token}` } })
            return navigate(`/${user.data.user.name}/${title}`)
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    const handleDelete = async()=>{
        try{
            await axios.delete(`http://localhost:3000/${title}`, { headers: { Authorization: `Bearer ${token}` } })
            navigate('/')
        }catch(err: any){
            setErrMsg(err.response.data.msg)
        }
    }

    const handleImageChange = (e: any) => setImages(e.target.files)
    if (loading || !form) return <p>...</p>
    if(err) return <h1>{err}</h1>

    return <StyledForm>
        <StyledLabel>Edit post</StyledLabel>
        { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }
        <StyledInput
            type='text'
            name='data'
            placeholder='DIGITE SEU TEXTO AQUI'
            value={form.data}
            onChange={(e: any)=>setForm({...form, data: e.target.value})}
        ></StyledInput>
        <StyledInput
            type='text'
            name='keep_files'
            placeholder='Imagens que você quer ficar'
            // value={} --> Código para pegar a quantidade de imagens
            onChange={(e: any)=>setForm({...form, keep_files: e.target.value})}
        ></StyledInput>
        <StyledInput type="file" multiple onChange={handleImageChange} />

        <StyledButton onClick={handleEdit}>SEND</StyledButton>

        <StyledTitle>Delete your Post</StyledTitle>
        <StyledButton onClick={handleDelete} backgroundColor='red' >DELETE POST {'(PERMANENT)'}</StyledButton>
    </StyledForm>
}