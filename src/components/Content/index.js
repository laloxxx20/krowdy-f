import React, { Component } from 'react';
import './styles.css';
import {
  Row,
  Col,
  Menu,
  Icon,
  Form,
  Collapse } from 'antd';
import ListEmail from '../ListEmails'
import FormPassword from '../FormPassword'
import FormCountry from '../FormPhone'

const perfil = require('../../statics/perfil.png');
const shield = require('../../statics/shield_two.png');
const pencil = require('../../statics/pencil.png');

const Panel = Collapse.Panel;


class Content extends Component {
  render() {

    return (
      <div className="container shadow-content padding-content color-white">
        <Row>
          <Col span={2}>
            <img src={perfil} alt="" />
          </Col>
          <Col span={8}>
            <h3>
              {localStorage.getItem("displayName")}
              <img src={pencil} alt="" className="pencil" />
            </h3>
            <p>{localStorage.getItem("email")}</p>
            <p className="data-time">
              Miembro desde 20 de Noviembre del  2018
            </p>
          </Col>
          <Col span={10}>
            <Row>
              <Col span={2}>
                <div className="line-vertical-content" />
              </Col>
              <Col span={20}>
                <h3>Bienvenido</h3>
                <p>Desde aquí y con tu cuenta de Krowdy podras acceder<br /> rápidamente a tus herramientas y funciones para proteger tus<br /> datos y tu privacidad.</p>
              </Col>
            </Row>
          </Col>
          <Col span={4} className="center">
            <img src={shield} alt="" />
          </Col>
        </Row>
        
        <Menu
          mode="horizontal"
        >
          <Menu.Item key="mail" className="menu-horizontal">
            <Icon type="user" className="ico-user-menu" /> Cuenta
          </Menu.Item>
        </Menu>

        <Row>
          <Col span={6}>
          </Col>
          <Col span={18}>
            <br />
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Panel
                className="header-collapse"
                header="Inicio de sesión y seguridad"
                key="1">
                <ListEmail />
              </Panel>
              <Panel
                className="header-collapse"
                header="Números de celular"
                key="2">
                
                <FormCountry />

              </Panel>
              <Panel
                className="header-collapse"
                header="Cambiar contraseña"
                key="3">

                <FormPassword />

              </Panel>
              <Panel
                className="header-collapse"
                header="Conexiones"
                key="4">
                <p style={{ paddingLeft: 24 }}>
                  empty
                </p>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(Content);
