import React, { Component } from 'react';
import FlashMessage from 'react-flash-message'
import {
  Row,
  Col,
  Form,
  Button,
  List } from 'antd';
import { Input, Select } from 'antd';
import { ResourcePhone, ResourceGetPhones } from '../../api';

const Option = Select.Option;
const FormItem = Form.Item;

class FormPhone extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePhoneDeleteClick = this.handlePhoneDeleteClick.bind(this);
    this.handleMainPhone = this.handleMainPhone.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.getActions = this.getActions.bind(this);
    this.state = {
      country: '+51',
      dataPhones: [],
      messageCreate: '',
      messageDelete: '',
      messageInfoAction: '',
      mainPhone: '',
      phoneError: ''
    }
  }

  componentDidMount() {
    ResourceGetPhones.at(`${localStorage.getItem('id')}/`).get()
      .then((d) => {        
        this.setState({
          dataPhones: d.data.phones.reverse(),
          mainPhone: d.data.main_id_phone
        })
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ messageCreate: '' , phoneError: ''})
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.user = localStorage.getItem('id');
        values.phone = `${this.state.country}${values.phone}`
        ResourcePhone.post(values)
          .then((d) => {
            this.setState({
              messageCreate: 'Se guardo celular! ',
              dataPhones: this.state.dataPhones.concat([{phone: values.phone, id: d.data.id}])
            })
            
            this.props.form.resetFields();
          })
          .catch((error) => {
            this.setState({ phoneError: error.response.data.phone[0] });
          });
      }
    });
  }

  searchPhone(array, id) {
    let array_r = array.reverse();
    for(let i = 0; array_r.length > 0; ++i){
      if (id === array_r[i].id)
        return i
    }
  }

  handlePhoneDeleteClick(e) {
    this.setState({ messageDelete: '' })
    ResourcePhone.delete(`${e}/`)
      .then((d) => {
        this.setState({
          messageDelete: "El celular fue eliminado!",
        })
      })

    let array = [...this.state.dataPhones];
    let to_delete = this.searchPhone(array, e);
    array.splice(to_delete, 1);
    this.setState({dataPhones: array.reverse()});
  }

  handleCountryChange = (country) => {
    this.setState({ country: country });
  }

  handleMainPhone(phone_obj) {
    this.setState({ messageInfoAction: '' })
    ResourcePhone.at(`${phone_obj.id}/?main_phone=1`).patch(phone_obj)
    .then((d) => {
      this.setState({
        messageInfoAction: 'Cambios Guardados! ',
        mainPhone: phone_obj.id,
      })
    })
    .catch((err) => {
      this.setState({ messageInfoAction: "Error al actualizar"});
    })
  }

  getActions(item) { 
    return this.state.mainPhone === item.id ? ['Celular principal', ] : 
      ([<div>
        <Button
          type="dashed"
          onClick={() => this.handleMainPhone(item)}
          style={{ borderStyle: 'none' }}
          >Establecer como principal</Button>
      </div>,
      <div>
        <Button
          type="dashed"
          onClick={() => this.handlePhoneDeleteClick(item.id)}
          style={{ borderStyle: 'none' }}
          >Eliminar</Button>
      </div>
      ])
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
      { this.state.dataPhones.length ? (
        <List
          itemLayout="horizontal"
          dataSource={this.state.dataPhones}
          renderItem={item => (
            <List.Item
              actions={ this.getActions(item) }>
              <List.Item.Meta
                title={item.phone}
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

      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <Row>
          <Col span={15}>
            <FormItem label="Pais">
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: 'Ingresa un num. de celular ' }],
              })(
                  <span>
                    <Select
                      size={'default'}
                      style={{ width: '32%' }}
                      onChange={this.handleCountryChange}
                      defaultValue="Perú"
                    >
                      <Option value="+51">Perú (+51)</Option>
                      <Option value="+59">Bolivia (+59)</Option>
                    </Select>
                    <Input
                      type="text"
                      size={'default'}          
                      placeholder="Número de celular"
                      style={{ width: '60%', marginLeft: '4%' }}
                    />
                </span>
              )}
            </FormItem>
          </Col>
          <Col span={8} className="center">
            <Button type="primary" htmlType="submit" className="form-button-phone">
              Guardar
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
        <div className="error-server">{this.state.phoneError}</div>
        <p>Enviaremos un código a este número; lo necesitarás en el último paso.</p>
      </Form>
    </div>
    );
  }
}

export default Form.create()(FormPhone);
