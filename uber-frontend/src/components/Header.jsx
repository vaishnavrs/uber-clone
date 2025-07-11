import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../styles/header.css'
import { useLocation, useNavigate } from 'react-router';



function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const hideItems = ['/login','/login-verfify','/driver-dashboard']
  return (
    
    <div>
        <Navbar className='nav-bar' data-bs-theme="dark">
            <Container>
            <Navbar.Brand href="#home">Uber</Navbar.Brand>
              {!hideItems.includes(location.pathname)?
                <Nav className="me-auto">
                <Nav.Link href="#home">Ride</Nav.Link>
                <Nav.Link href="#features">Drive</Nav.Link>
                <Nav.Link href="#pricing">Business</Nav.Link>
                <Nav.Link>About</Nav.Link>
            </Nav>:""}
             {!hideItems.includes(location.pathname)?
                <Nav className='justify-content-end'>
                <Nav.Link>Help</Nav.Link>
                <Nav.Link>SignUp</Nav.Link>
                <Nav.Link onClick={()=>navigate('/login')}>Login</Nav.Link>
            </Nav>:""}
            </Container>
        </Navbar>
    </div>
  )
}

export default Header