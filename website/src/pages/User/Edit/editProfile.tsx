import {
    StyledBody,
    StyledForm,
    StyledInput,
    StyledButton,
    StyledAlert,
    StyledCheckboxContainer,
    StyledTextArea
} from './editProfileCSS';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function EditProfile() {
    const navigate = useNavigate()
    const token = Cookies.get('userToken')
    const [form, setForm]: any = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
        lastPassword: '',
        private: ''
    })
    const [userInfo, setUserInfo] = useState({
        name: '...',
        email: '...',
        bio: '...',
        private: '',
        profile_picture: { url: '' }
    })
    const [image, setImage] = useState(null)
    const [previewImg, setPreviewImg]: any = useState(null)
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState('')

    // UI
    const [seePasswordArea, setSeePasswordArea] = useState(false)

    useEffect(() => {
        const getUserInfo = async () => {
            try {

                const responseLoggedInUser = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })
                setUserInfo(responseLoggedInUser.data.user)
                setForm({
                    name: responseLoggedInUser.data.user.name,
                    email: responseLoggedInUser.data.user.email,
                    bio: responseLoggedInUser.data.user.bio,
                    private: responseLoggedInUser.data.user.private
                })

                setLoading(false)
            } catch (error) {
                console.error('Erro ao obter informações do usuário:', error)
                setErrMsg('Erro ao obter informações do usuário')
                setLoading(false)
            }
        };

        getUserInfo();
    }, [])

    const handleEdit = async () => {
        try {
            const formData = new FormData()
            formData.append('name', form.name)
            formData.append('email', form.email)
            formData.append('bio', form.bio)
            if(form.password) {
                formData.append('password', form.password)
                formData.append('lastPassword', form.lastPassword)
            }
            if(image) formData.append('file', image)

            await axios.put(`http://localhost:3000/update_user`, formData, { headers: { Authorization: `Bearer ${token}` } })
            Cookies.remove('userToken')
            navigate('/message?msg=USUARIO EDITADO')
        } catch (err: any) {
            setErrMsg(err.response.data.msg)
        }
    }

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:3000/delete_user`, { headers: { Authorization: `Bearer ${token}` } })
            Cookies.remove('userToken')
            navigate('/message?msg=USUARIO DELETADO')
        } catch (err: any) {
            setErrMsg(err.response.data.msg)
        }
    }

    const resetePfp = async () => {
        try{
            await axios.put(`http://localhost:3000/reset_profile_picture`, {}, { headers: { Authorization: `Bearer ${token}` } })
            Cookies.remove('userToken')
            navigate(`/users/${userInfo.name}`)
        } catch (err: any) {
            setErrMsg(err.response.data.msg)
        }
    }

    const handleChangePreviewImage = (e: any) => {
        const file = e.target.files[0]
        setImage(file)

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewImg(reader.result)
        }
        reader.readAsDataURL(file)
    }

    if (loading || !form) return <p>...</p>

    return (
        <StyledBody>
            <StyledForm>
                <div className='imageContainer'>
                    <img src={previewImg || userInfo.profile_picture.url}></img>
                    <StyledInput type="file" id="imageUpload" onChange={(e: any)=>handleChangePreviewImage(e)}/>
                    <label for="imageUpload">U</label>

                    <StyledButton onClick={resetePfp} style={{ backgroundColor: 'red'}} >R</StyledButton>
                </div>

                <div className='inputClass'>
                    <label>Username</label>
                    <StyledInput
                        type='text'
                        name='name'
                        placeholder='username'
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    ></StyledInput>
                </div>

                <div className='inputClass'>
                    <label>Bio</label>
                    <StyledTextArea
                        name='bio'
                        placeholder='bio'
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        
                    ></StyledTextArea>
                </div>

                <div className='inputClass'>
                    <label>Email</label>
                    <StyledInput
                        type='text'
                        name='email'
                        placeholder='email'
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    ></StyledInput>
                </div>

                <StyledCheckboxContainer>
                    <input
                        type='checkbox'
                        name='private'
                        value={form.private}
                        onChange={(e) => setForm({ ...form, private: e.target.value })}
                    ></input>
                    <label>Private</label>
                </StyledCheckboxContainer>

                <StyledButton
                    style={{ backgroundColor: 'blue' }}  
                    onClick={()=>setSeePasswordArea(!seePasswordArea)}
                >ChangePassword</StyledButton>
                { seePasswordArea ? <>
                    <div className="inputClass">
                        <label>Old Password</label>
                        <StyledInput
                            type='password'
                            name='lastPassword'
                            placeholder='Last Password'
                            onChange={(e) => setForm({ ...form, lastPassword: e.target.value })}
                        ></StyledInput>
                    </div>
                    <div className='inputClass'>
                        <label>New Password</label>
                        <StyledInput
                            type='password'
                            name='password'
                            placeholder='password'
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        ></StyledInput>
                    </div>
                </> : <></>
                }

                <StyledButton onClick={handleEdit}>SEND</StyledButton>
                { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }

                <h1>Delete profile</h1>
                <StyledButton onClick={handleDeleteUser} style={{ backgroundColor: 'red'}} >DELETE USER (PERMANENT)</StyledButton>
            </StyledForm>
        </StyledBody>
    );
}
