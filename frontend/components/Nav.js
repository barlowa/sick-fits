import Link from 'next/link'
import NavStyles from './styles/NavStyles'

const Nav = () =>(
    <NavStyles>
        {/* HTML 5 push state using next js */}
        <Link href ='/items'>
            <a>Items</a>
        </Link>
        
        <Link href ='/sell'>
            <a>Sell</a>
        </Link>

        <Link href ='/signup'>
            <a>Signup</a>
        </Link>
        
        <Link href ='/orders'>
            <a>Orders</a>
        </Link>
        <Link href ='/me'>
            <a>Account</a>
        </Link>
    </NavStyles>
)

export default Nav