import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/navbar'

function App() {
  return <div>
    <Navbar></Navbar>

    <Outlet></Outlet>
  </div>
}

export default App
