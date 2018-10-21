import Link from 'next/link'

const Nav = () =>(
    <React.Fragment>
        {/* HTML 5 push state using next js */}
        <Link href ='/'>
            <a>Home</a>
        </Link>
        
        <Link href ='/sell'>
            <a>Sell</a>
        </Link>
    </React.Fragment>
)

export default Nav