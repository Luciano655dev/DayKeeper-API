import axios from "axios"
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';

function ConfirmEmail(){
    // Get the query 'token'
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')

    const [msg, setMsg] = useState('')

    useEffect(()=>{
        async function getToken(){
            try{
                const response = await axios.get(`http://localhost:3000/auth/confirm_email?token=${token || ''}`)
    
                setMsg(response.data.msg)
            } catch(err: any) {
                setMsg(err.response.data.msg)
            }
        }

        getToken()
    }, [])

    return (
        <div>
            <h1>{msg}</h1>

            <Link to='/login'>Vá para o login!</Link>
        </div>
    )
}

export default ConfirmEmail

/*
    TODO: Fazer uma thread todo dia!
    ! CUIDADO COM OS ERRINHOS ESPERTOS
    ? MAS SERÁ QUE EU SEI RECOLVER O ERRINHO
    * * NÃO ESQUECE DE ME SEGUIR TAMBÉM
*/
