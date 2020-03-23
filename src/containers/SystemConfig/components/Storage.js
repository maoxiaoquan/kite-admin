import React from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Row,
  Col
} from 'antd'
import { Link } from 'react-router-dom'

import { getSystemConfigInfo, updateSystemConfigInfo } from '../actions'
import alert from '../../../utils/alert'

import { getUserRoleAll } from '../../UserRole/actions/UserRoleAction'

const Option = Select.Option

const confirm = Modal.confirm

@connect(({ stateSystemConfig }) => {
  return {
    stateSystemConfig
  }
})
class Oauth extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_edit: false,
      loading: false,
      serviceProvider: ''
    }
  }

  async componentDidMount() {
    this.systemConfigInfo()
  }

  async systemConfigInfo() {
    await this.props.dispatch(
      getSystemConfigInfo({}, result => {
        const storage = result.storage || {}
        this.setState({
          serviceProvider: storage.serviceProvider || []
        })
        this.props.form.setFieldsValue({
          ...storage
        })
      })
    )
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(
          updateSystemConfigInfo(
            {
              type: 'storage',
              storage: {
                ...values
              }
            },
            result => {
              this.systemConfigInfo()
              this.setState({
                is_edit: false
              })
            }
          )
        )
      }
    })
  }

  render() {
    const { is_edit, serviceProvider } = this.state
    const { getFieldDecorator } = this.props.form

    const itemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    const tailItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <div className="layout-main" id="system-config">
        <div className="layout-main-title">
          <h4 className="header-title">外部存储</h4>
        </div>

        <div className="layout-nav-btn"></div>

        <div className="card layout-card-view">
          <div className="card-body sc-content-view">
            <Form className="from-view" onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item {...itemLayout} label="第三方存储服务商">
                {getFieldDecorator('serviceProvider', {
                  rules: [
                    {
                      required: true,
                      message: '选择主题！',
                      whitespace: true
                    }
                  ]
                })(
                  <Select
                    disabled={!is_edit}
                    onChange={value => {
                      this.setState({
                        serviceProvider: value
                      })
                    }}
                  >
                    <Option value="default">默认</Option>
                    <Option value="qiniu">qiniu</Option>
                    <Option value="aliyun">阿里云</Option>
                    <Option value="tengxun">腾讯</Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item {...itemLayout} label="domain">
                {getFieldDecorator('domain', {
                  rules: [
                    {
                      message: 'Please input domain!'
                    }
                  ]
                })(<Input disabled={!is_edit} />)}
              </Form.Item>

              <Form.Item {...itemLayout} label="bucket">
                {getFieldDecorator('bucket', {
                  rules: [
                    {
                      message: 'Please input bucket!'
                    }
                  ]
                })(<Input disabled={!is_edit} />)}
              </Form.Item>

              <div
                className="qiniu"
                style={{
                  display: serviceProvider === 'qiniu' ? 'block' : 'none'
                }}
              >
                <div className="title">七牛</div>

                <Form.Item {...itemLayout} label="accessKey">
                  {getFieldDecorator('accessKey', {
                    rules: [
                      {
                        message: 'Please input accessKey!'
                      }
                    ]
                  })(<Input disabled={!is_edit} />)}
                </Form.Item>

                <Form.Item {...itemLayout} label="secretKey">
                  {getFieldDecorator('secretKey', {
                    rules: [
                      {
                        message: 'Please input secretKey!'
                      }
                    ]
                  })(<Input disabled={!is_edit} />)}
                </Form.Item>
              </div>

              <div
                className="aliyun"
                style={{
                  display: serviceProvider === 'aliyun' ? 'block' : 'none'
                }}
              >
                <div className="title">阿里云</div>
              </div>

              <Form.Item {...tailItemLayout}>
                {!is_edit ? (
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      this.setState({
                        is_edit: true
                      })
                    }}
                    type="primary"
                  >
                    修改
                  </button>
                ) : (
                  <div>
                    <button
                      className="btn btn-primary"
                      htmltype="submit"
                      type="primary"
                      style={{ marginRight: '10px' }}
                    >
                      确定
                    </button>

                    <button
                      className="btn btn-light"
                      onClick={() => {
                        this.systemConfigInfo()
                        this.setState({
                          is_edit: false
                        })
                      }}
                      type="primary"
                    >
                      取消
                    </button>
                  </div>
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const OauthForm = Form.create()(Oauth)

export default OauthForm
