import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Input } from 'antd';
  import FlashMessage from 'react-flash-message'
import { ResourcePasswordRestart } from '../../api';

const FormItem = Form.Item;

class FormPassword extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      message: '',
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ message: ''})
    this.props.form.validateFields((err, values) => {
      if (values.new_password !== values.new_password_t){
        this.setState({
          message: 'Las nuevas contraseñas no coinciden ',
        })
      }
      if (!err) {
        ResourcePasswordRestart.put(values)
        .then((d) => {
          this.setState({
              message: 'Se cambio la contraseña! ',
            })
            this.props.form.resetFields();
          })
          .catch((error) => {
            this.setState({
              message: error.response.data.old_password[0],
            })
          });
      }
    });
  }


  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('Las contraseñas no coinciden!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['new_password_t'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <Row>
          <Col span={10}>
            <FormItem label="Contraseña actual">
              {getFieldDecorator('old_password', {
                rules: [{ required: true, message: 'Por favor ingresa tu contraseña actual!' }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem label="Contraseña nueva">
              {getFieldDecorator('new_password', {
                rules: [{
                  required: true, message: 'Ingrese nueva contraseña!',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem label="Vuelve a escribir tu contraseña nueva">
              {getFieldDecorator('new_password_t', {
                rules: [{
                  required: true, message: 'Confirme la contraseña!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <br />
            <Button type="primary" htmlType="submit" className="login-form-button">
              Guardar
            </Button>
            { this.state.message ? (
              <FlashMessage duration={3000} persistOnHover={true}>
                <Row>
                  <Col span={10} className="msg-create">
                    <span >{this.state.message}</span>
                  </Col>
                </Row>
              </FlashMessage>
              ) : '' }
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(FormPassword);
