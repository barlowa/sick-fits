import React, { Component } from 'react';
import Header from './Header'
class Page extends Component {
    render() {
        return (
            <div>
                <p>Hey! im the page component</p>
                <Header />
                {this.props.children}
            </div>
        );
    }
}

export default Page;