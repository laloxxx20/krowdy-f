import React, { Component } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col, } from 'antd';
import { Link } from "react-router-dom";

import './styles.css';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ResourceSignin } from '../../api';

const FormItem = Form.Item;

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      message: '',
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.history.push("/profile");
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({ loading: true });
      if (!err) {
        ResourceSignin.post(values)
          .then((d) => {
            localStorage.setItem('account_created', '');
            localStorage.setItem('token', d.data.token);
            localStorage.setItem('displayName', d.data.first_name);
            localStorage.setItem('email', d.data.email);
            localStorage.setItem('id', d.data.id);
            this.setState({
              message: d.data.message,
            })
            this.props.history.push("/profile");
            localStorage.setItem('account_created', '');
          })
          .catch((error) => {
            let data_errors = error.response.data
            for (let key in data_errors){
              this.setState({
                message: data_errors[key][0],
                loading: false
              })
            }
          });
      }
      else{
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
      <Header protect={false} />
        <div className="container shadow-content padding-content color-white">
          { localStorage.getItem('account_created') ? (
            <Row>
            <Col span={5} offset={9} className="msg-create">
              { localStorage.getItem('account_created') }
            </Col>
            </Row>
          ) : ''}
          <Row>
            <Col span={12} offset={6}>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <div className="center">
                  <h2>Inicia Sesión</h2>
                </div>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Por favor ingresa un usuario!' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Correo" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Por favor ingresa una contraseña!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
                  )}
                </FormItem>
                <FormItem className="center">
                  <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
                    Entrar
                  </Button>
                  <p className="error-server">{this.state.message}</p>
                  <br />
                  
                  <br /> <Link to="/register"> Eres nuevo?, Registrate aquí</Link>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Form.create()(LoginView);
