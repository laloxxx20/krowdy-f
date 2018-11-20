import React, { Component } from 'react';
import FlashMessage from 'react-flash-message'
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  List } from 'antd';
import { ResourceEmail, ResourceGetEmails } from '../../api';

const FormItem = Form.Item;

class ListEmail extends Component {
  constructor(props) {
    super(props);
    this.handleEmailDeleteClick = this.handleEmailDeleteClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleMainEmail = this.handleMainEmail.bind(this);
    this.getActions = this.getActions.bind(this);
    this.state = {
      data: [],
      messageCreate: '',
      messageDelete: '',
      messageInfoAction: '',
      emailError: '',
      mainEmail: '',
      dataID: '',
      dataEmails: [],
    }
  }

  componentDidMount() {
    ResourceGetEmails.at(`${localStorage.getItem('id')}/`).get()
      .then((d) => {
        this.setState({
          dataEmails: d.data.emails.reverse(),
          mainEmail: d.data.main_id_email
        })
      })
  }

  searchEmail(array, id) {
    let array_r = array.reverse();
    for(let i = 0; array_r.length > 0; ++i){
      if (id === array_r[i].id)
        return i
    }
  }

  handleEmailDeleteClick(e) {
    this.setState({ messageDelete: '' })
    ResourceEmail.delete(`${e}/`)
      .then((d) => {
        this.setState({
          messageDelete: "El correo fue eliminado!",
        })
      })

    let array = [...this.state.dataEmails];
    let to_delete = this.searchEmail(array, e);
    array.splice(to_delete, 1);
    this.setState({dataEmails: array.reverse()});
  }

  handleMainEmail(email_obj) {
    this.setState({ messageInfoAction: '' })
    ResourceEmail.at(`${email_obj.id}/?main_email=1`).patch(email_obj)
    .then((d) => {
      this.setState({
        messageInfoAction: 'Cambios Guardados! ',
        mainEmail: email_obj.id,
      })
      localStorage.setItem('email', email_obj.email);
    })
    .catch((err) => {
      this.setState({ messageInfoAction: "Error al actualizar"});
    })
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.setState({ messageCreate: '' , emailError: ''})
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ResourceEmail.post(values)
        .then((d) => {
          this.setState({
            messageCreate: 'Cambios Guardados! ',
            dataEmails: this.state.dataEmails.concat([{email: values.email, id: d.data.id}])
          })
          this.props.form.resetFields();
        })
        .catch((err) => {
          console.log("err: ", err);
          this.setState({ emailError: err.response.data.email[0]});
        });

      }
    });
  }

  getActions(item) { 
    return this.state.mainEmail === item.id ? ['Correo principal', ] : 
      ([<div>
        <Button
          type="dashed"
          onClick={() => this.handleMainEmail(item)}
          style={{ borderStyle: 'none' }}
          >Seleccionar como principal</Button>
      </div>,
      <div>
        <Button
          type="dashed"
          onClick={() => this.handleEmailDeleteClick(item.id)}
          style={{ borderStyle: 'none' }}
          >Eliminar</Button>
      </div>])
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        { this.state.dataEmails.length ? (
          <List
            itemLayout="horizontal"
            dataSource={this.state.dataEmails}
            renderItem={item => (
              <List.Item
                actions={this.getActions(item)}>
                <List.Item.Meta
                  title={item.email}
                />
              </List.Item>
            )}
          />
          ) : ''
        }
        
        { this.state.messageDelete ? (
          <FlashMessage duration={3000} persistOnHover={true}>
            <Row>
              <Col span={10} className="msg-delete">
                <span >{this.state.messageDelete}</span>
              </Col>
            </Row>
          </FlashMessage>
          ) : '' }

        { this.state.messageInfoAction ? (
          <FlashMessage duration={3000} persistOnHover={true}>
            <Row>
              <Col span={10} className="msg-delete">
                <span>{this.state.messageInfoAction}</span>
              </Col>
            </Row>
          </FlashMessage>
        ) : '' }

        <Form onSubmit={this.handleFormSubmit} layout="vertical">
          <Row>
            <Col span={24}>
              <FormItem>
                {getFieldDecorator('user', {
                  rules: [{ required: true, message: 'Por favor ingresa id!' }],
                  initialValue: localStorage.getItem("id")
                })(
                  <Input type="hidden" />
                )}
              </FormItem>
              <FormItem >
                {getFieldDecorator('active', {
                  rules: [{ required: true, message: 'Por favor ingresa un email!' }],
                  initialValue: false,
                })(
                  <Input type="hidden" />
                )}
                <div className="error-server">{this.state.emailError}</div>
              </FormItem>

              <Row>
                <Col span={10}>
                <FormItem >  {getFieldDecorator('email', {    rules: [{ required: true, message: 'Ingresa un email!'}] })(    <Input placeholder="Ingresa tu correo electrónico" />  )}
                  
                </FormItem>
                </Col>
                <Col span={10} offset = {1}>
                  <Button type="primary" htmlType="submit" className="login-form-button">  Guardar
                  </Button>
                </Col>
              </Row>
              { this.state.messageCreate ? (
                <FlashMessage duration={3000} persistOnHover={true}>
                  <Row>
                    <Col span={10} className="msg-create">
                      <span className="checkmark" >
                          <div className="checkmark_circle"></div>
                          <div className="checkmark_stem"></div>
                          <div className="checkmark_kick"></div>
                      </span>
                      <span >{this.state.messageCreate}</span>
                    </Col>
                  </Row>
                </FlashMessage>
                ) : '' }
              
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ListEmail);
