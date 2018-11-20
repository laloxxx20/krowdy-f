import React, { Component } from 'react';
import './styles.css';

import Header from '../../components/Header'
import Content from '../../components/Content'
import Footer from '../../components/Footer'

class ProfileView extends Component {
  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div>
        <Header protect={true} />
        <Content />
        <Footer />
      </div>
    );
  }
}

export default ProfileView;
