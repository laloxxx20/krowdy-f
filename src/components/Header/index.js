import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.css';
import {
  Row,
  Col,
  Menu,
  Dropdown,
  Button,
  Icon } from 'antd';

const logo = require('../../statics/logo.png');

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    switch(e.key) {
      case '1':
        localStorage.removeItem("token");
        localStorage.removeItem("displayName");
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        this.props.history.push("/login");
        break;
      default:
    }
  }

  render() {
    const { protect } = this.props;

    return (
      <div className="shadow-header color-white">
        <div className="container">
          <Row className="header-padding">
            <Col span={12} className="left">
              <img src={logo} alt="" />
            </Col>
            <Col span={12} className="right">
            {
              protect ? (
                <div>
                  <div className="line-vertical-header" />
                  <Dropdown overlay={(
                      <Menu onClick={this.handleClick}>
                        <Menu.Item key="1"><Icon type="user" />Desconectar</Menu.Item>
                      </Menu>
                    )}>
                    <Button className="btn-dropdown user-details">
                      {localStorage.getItem("displayName")} <Icon type="down" />
                    </Button>
                  </Dropdown>
                </div>
              ) : null
            }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
