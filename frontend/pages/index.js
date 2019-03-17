import Items from '../components/Items'

const Home = (props) =>(
    <React.Fragment>
        <Items 
            page={parseFloat(props.query.page) || 1}
        />
    </React.Fragment>
)

export default Home;