import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col, } from 'antd';
import { Link } from "react-router-dom";

import './styles.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ResourceSignup } from '../../api';

const FormItem = Form.Item;

class RegisterView extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      message: '',
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({ loading: true });
      if (!err) {
        ResourceSignup.post(values)
          .then((d) => {
            localStorage.setItem('account_created', "Cuenta creada!, puedes iniciar sessión " );
            this.props.history.push("/login");
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
          <Row>
            <Col span={12} offset={6}>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <div className="center">
                  <h2>Registrate</h2>
                </div>
                <FormItem>
                  {getFieldDecorator('first_name', {
                    rules: [{ required: true, message: 'Por favor ingresa tu nombre!' }],
                  })(
                    <Input placeholder="Nombre" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Por favor ingresa tu correo!' }],
                  })(
                    <Input placeholder="Correo Electronico" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Por favor ingresa una contraseña!' }],
                  })(
                    <Input type="password" placeholder="Contraseña" />
                  )}
                </FormItem>
                <FormItem className="center">
                  <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading} >
                    Crear!
                  </Button>
                  <p className="error-server">{this.state.message}</p>
                  <br />
                  
                  <br /> <Link to="/login"> Ya tienes cuenta?, inicia sesión aquí</Link>
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

export default Form.create()(RegisterView);
