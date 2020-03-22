import React from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Tag
} from 'antd'
import { Link } from 'react-router-dom'

import {
  getSystemConfigInfo,
  updateSystemConfigInfo,
  getSystemThemeList
} from '../actions'
import alert from '../../../utils/alert'

import { getUserRoleAll } from '../../UserRole/actions/UserRoleAction'

const Option = Select.Option

const confirm = Modal.confirm

@connect(({ stateSystemConfig }) => {
  return {
    stateSystemConfig
  }
})
class Theme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_edit: false,
      loading: false,
      themeList: []
    }
  }

  async componentDidMount() {
    this.systemConfigInfo()
    this.getSTList()
  }

  async systemConfigInfo() {
    await this.props.dispatch(
      getSystemConfigInfo({}, result => {
        this.props.form.setFieldsValue({
          theme: result.config.theme || 'default'
        })
      })
    )
  }

  getSTList() {
    this.props.dispatch(
      getSystemThemeList({}, result => {
        this.setState({
          themeList: result.list || []
        })
      })
    )
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { theme } = values
        this.props.dispatch(
          updateSystemConfigInfo(
            {
              type: 'config',
              config: {
                theme
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
    const { is_edit, themeList } = this.state
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
          <h4 className="header-title">主题功能</h4>
        </div>

        <div className="layout-nav-btn" />

        <div className="card layout-card-view">
          <div className="card-body sc-content-view">
            <Form className="from-view" onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item {...itemLayout} label="选择主题">
                {getFieldDecorator('theme', {
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
                        type: value
                      })
                    }}
                  >
                    {themeList.map((item, key) => {
                      return (
                        <Option value={item} key="key">
                          {item}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </Form.Item>

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
                      type="primary"
                      style={{ marginRight: '10px' }}
                    >
                      确定
                    </button>

                    <button
                      className="btn btn-light"
                      onClick={() => {
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

const ThemeForm = Form.create()(Theme)

export default ThemeForm
