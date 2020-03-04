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
      checkedValues: []
    }
  }

  async componentDidMount() {
    this.system_config_info()
  }

  async system_config_info() {
    await this.props.dispatch(
      getSystemConfigInfo({}, result => {
        const oauth = result.oauth || {}
        const oauthGithub = oauth.oauth_github || {}
        this.setState({
          checkedValues: oauth.oauths || []
        })
        this.props.form.setFieldsValue({
          oauths: oauth.oauths,
          githubClientId: oauthGithub.client_id || '',
          githubClientSecret: oauthGithub.client_secret || '',
          githubRedirectUri: oauthGithub.redirect_uri || ''
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
              type: 'oauth',
              oauth: {
                oauths: values.oauths,
                oauth_github: {
                  client_id: values.githubClientId,
                  client_secret: values.githubClientSecret,
                  redirect_uri: values.githubRedirectUri
                }
              }
            },
            result => {
              this.system_config_info()
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
    const { is_edit, checkedValues } = this.state
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
          <h4 className="header-title">第三方oauth登录</h4>
        </div>

        <div className="layout-nav-btn"></div>

        <div className="card layout-card-view">
          <div className="card-body sc-content-view">
            <Form className="from-view" onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item label="勾选第三方授权登录">
                {getFieldDecorator('oauths')(
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    disabled={!is_edit}
                    onChange={checkedValues => {
                      this.setState({
                        checkedValues: checkedValues
                      })
                    }}
                  >
                    <Row>
                      <Col span={8}>
                        <Checkbox value="github">github</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="qq">qq</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                )}
              </Form.Item>

              <div
                className="github"
                style={{
                  display: ~checkedValues.indexOf('github') ? 'block' : 'none'
                }}
              >
                <div className="github-title">github授权登录</div>

                <Form.Item {...itemLayout} label="client_id">
                  {getFieldDecorator('githubClientId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input client_id!'
                      }
                    ]
                  })(<Input disabled={!is_edit} />)}
                </Form.Item>

                <Form.Item {...itemLayout} label="client_secret">
                  {getFieldDecorator('githubClientSecret', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input client_secret!'
                      }
                    ]
                  })(<Input disabled={!is_edit} />)}
                </Form.Item>

                <Form.Item {...itemLayout} label="redirect_uri">
                  {getFieldDecorator('githubRedirectUri', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input redirect_uri!'
                      }
                    ]
                  })(<Input disabled={!is_edit} />)}
                </Form.Item>
              </div>

              <div
                className="qq"
                style={{
                  display: ~checkedValues.indexOf('qq') ? 'block' : 'none'
                }}
              >
                <div className="qq-title">qq授权登录(暂未开放)</div>
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
                        this.system_config_info()
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
