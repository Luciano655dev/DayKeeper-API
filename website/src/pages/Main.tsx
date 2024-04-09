import { StyledMain } from './MainCSS'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/navbar'

function App() {
  return <div>
    <Navbar></Navbar>

    <StyledMain>
      <Outlet></Outlet>
    </StyledMain>
  </div>
}

export default App
