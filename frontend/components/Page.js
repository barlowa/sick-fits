import React, { Component } from 'react';
import Header from './Header'
import Meta from './Meta'
class Page extends Component {
    render() {
        return (
            <React.Fragment>
                <p>Hey! im the page component</p>
                <Meta />
                <Header />
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default Page;