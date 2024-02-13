import { Container } from './MessageCSS'
import { useLocation, Link } from 'react-router-dom'

function UserEdited(){
    // Get the query 'token'
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const message = queryParams.get('msg')
    
    return <Container>
        <h1>{message || 'MENSAGEM AQUI'}</h1>
        <Link to='/login'>Vá para o Login</Link>
    </Container>
}

export default UserEdited