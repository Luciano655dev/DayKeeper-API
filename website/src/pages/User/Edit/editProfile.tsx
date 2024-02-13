import { StyledForm, StyledInput, StyledButton, StyledAlert, StyledTitle, StyledLabel } from './editProfileCSS';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function EditProfile() {
    const navigate = useNavigate()
    const token = Cookies.get('userToken')
    const [form, setForm] = useState({})
    const [userInfo, setUserInfo] = useState({ name: '...', email: '...', private: false })
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState('')
    const [image, setImage] = useState(null)

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                if (!token) return setLoading(false)

                const responseLoggedInUser = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })
                setUserInfo(responseLoggedInUser.data.user)
                setForm({
                    name: responseLoggedInUser.data.user.name,
                    email: responseLoggedInUser.data.user.email,
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
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            if(form.password) formData.append('password', form.password)
            if(image) formData.append('file', image)

            await axios.put(`http://localhost:3000/update_user`, formData, { headers: { Authorization: `Bearer ${token}` } })
            Cookies.remove('userToken')
            navigate('/message?msg=USUARIO EDITADO')
        } catch (err: any) {
            setErrMsg(err.response.data.msg)
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/delete_user`, { headers: { Authorization: `Bearer ${token}` } })
            Cookies.remove('userToken')
            navigate('/message?msg=USUARIO DELETADO')
        } catch (err: any) {
            setErrMsg(err.response.data.msg)
        }
    }

    const handleImageChange = (e: any) => {
        setImage(e.target.files[0])
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

    if (!token) return <NotLogged></NotLogged>
    if (loading || !form) return <p>...</p>

    return (
        <StyledForm>
            { errMsg ? <StyledAlert>{errMsg}</StyledAlert> : <></> }
            <StyledTitle>Edit user</StyledTitle>
            <StyledInput type="file" onChange={handleImageChange}/>
            <StyledInput
                type='text'
                name='name'
                placeholder='username'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            ></StyledInput>

            <StyledInput
                type='text'
                name='email'
                placeholder='email'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            ></StyledInput>

            <StyledInput
                type='password'
                name='password'
                placeholder='password'
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            ></StyledInput>

            <StyledLabel>
                <input
                    type='checkbox'
                    name='private'
                    value={form.private}
                    onChange={(e) => setForm({ ...form, private: e.target.value })}
                ></input>
                Private
            </StyledLabel>

            <StyledButton onClick={handleEdit}>SEND</StyledButton>

            <StyledTitle>RESET PROFILE PICTURE</StyledTitle>
            <StyledButton onClick={resetePfp} backgroundColor={'red'}>Reset</StyledButton>

            <StyledTitle>Delete profile</StyledTitle>
            <StyledButton onClick={handleDelete} backgroundColor={'red'}>DELETE USER (PERMANENT)</StyledButton>
        </StyledForm>
    );
}

function NotLogged() {
    return <h1> FAÇA LOGIN PARA EDITAR SEU USUARIO </h1>
}
