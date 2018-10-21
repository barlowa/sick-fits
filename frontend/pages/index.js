import Link from 'next/link'

const Home = (props) =>(
    <React.Fragment>
        <p>Hey</p>
        <Link href ='/sell'>
        {/* HTML 5 push state using next js */}
            <a>Sell</a>
        </Link>
    </React.Fragment>
)

export default Home;