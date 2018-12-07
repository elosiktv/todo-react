import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTodo, getAllTodo, updateTodo } from '../../../store/actions/todoActions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Icon, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { DateTimePicker } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import moment from 'moment/moment.js';
import './head.css';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: '#4a148c'
    }
  },
  cssFocused: {},
  notchedOutline: {},
  linearColorPrimary: {
    backgroundColor: '#4a148c'
  },
  linearMargins: {
    marginLeft: '1px',
    marginRight: '1px'
  }
}

const materialTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#4a148c',
      },
    },
    MuiPickersToolbarButton: {
      toolbarBtn: {
        color: '#ffffff'
      },
      toolbarBtnSelected: {
        color: '#9575cd'
      }
    },
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: '#673ab7'
      }
    },
    MuiPickersDay: {
      current: {
        color: '#4a148c'
      },
      selected: {
        backgroundColor: '#673ab7'
      },
    },
    MuiPickersClockPointer: {
      pointer: {
        backgroundColor: '#673ab7'
      },
      thumb: {
        border: '14px solid #673ab7'
      }
    },
    MuiPickerClock: {
      squareMask: {
        backgroundColor: '#673ab7'
      }
    },
  },
});

class Head extends Component {
  constructor() {
    super();
    this.state = {
      page: null,
      todoInputPlaceholder: 'There is always something to do!',
      selectedDate: null,
      todoInputText: null,
      todoClose: false,
      todos: null,
      selectedPage: null,
      loadingTodos: false
    }
  }


  componentDidMount() {
    const page = this.props.match.params.page;
    this.props.getAllTodo();
    this.showTodoGroup(page);
    this.setState({ 
      page: page ,
      todoInputPlaceholder: this.createTodoInputText(page)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      const page = nextProps.match.params.page;
      this.showTodoGroup(page);
      this.setState({ 
        page: page,
        todoInputPlaceholder: this.createTodoInputText(page)
      });
    }
  }

  showTodoGroup = (page) => {
    switch (page) {
      case undefined:
        this.setState({ selectedPage: null });
        break;
      case 'today':
        this.setState({ selectedPage: moment().format('YYYY-MM-DD') });
        break;
      case 'tomorrow':
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        this.setState({ selectedPage: moment(tomorrow).format('YYYY-MM-DD') });
        break;
      case 'week':
        this.setState({ selectedPage: 'week' })
        break;
      default: break;
    }
  }

  createTodoInputText(page) {
    let text = '';
    switch (page) {
      case 'all':
        text = 'There is always something to do!';
        break;
      case 'today':
        text = 'What are we doing today?';
        break;
      case 'tomorrow':
        text = `There's always tomorrow!`;
        break;
      case 'week':
        text = 'We can make a lot of things in a week!';
        break;
      default: 
        text = 'There is always something to do!';
        break;
    }
    return text;
  }

  handleInputChange = e => {
    this.setState({ todoInputText: e.target.value });
  }

  handleTodoAdd = date => {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() +1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = date.getHours();
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let fullDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    this.props.createTodo({
      time: fullDate.split(' ')[1],
      date: fullDate.split(' ')[0],
      todo: this.state.todoInputText,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2)
    });
  }

  handleDropGroupBtn = index => {
    let tasksGroups = document.querySelectorAll('.todo__group');
    tasksGroups[index].classList.toggle('hidden');
  }

  handleTodoClick = (e, todo) => {
    if (e.target.children[0]) {
      e.target.children[0].style.display = 'flex';
      e.target.parentNode.style.height = '0px';
      this.props.updateTodo(todo);
    }
  }

  render() {
    const { classes, auth, todos, todoAdded } = this.props;
    if (todoAdded) {
      this.props.getAllTodo();
    }
    let formattedTodos = [];
    if (!auth.uid) return <Redirect to="/" />
    if (todos) {
      for (let key in todos) {
          if (this.state.selectedPage !== 'week' && key === this.state.selectedPage) {
            formattedTodos.push({
              [key]: todos[key]
            })
          }
          if (!this.state.selectedPage) {
            formattedTodos.push({
              [key]: todos[key]
            })
          }
          if (this.state.selectedPage === 'week') {
            for (let i = 0; i < 7; i++) {
              let currentDay = new Date();
              let nextDay = new Date();
              nextDay.setDate(currentDay.getDate() + i);
              if (key === moment(nextDay).format('YYYY-MM-DD')) {
                formattedTodos.push({
                  [key]: todos[key]
                })
              }         
            }
          }
      }
    }
    return (
      <MuiThemeProvider theme={materialTheme}>
        <div className="head">
          <p className="head__page-title">{this.state.page ? this.state.page : 'All'}</p>
          <div className="head__todo">
            <form onSubmit={(e) => e.preventDefault()} className="todo__form">
              <TextField
                fullWidth={true}
                onChange={this.handleInputChange}
                placeholder={this.state.todoInputPlaceholder}
                variant="outlined"
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                  }
                }}
              />
              <button className="todo__btn-picker" onClick={(e) => this.picker.open(e)}>
                <Icon>calendar_today</Icon>
              </button>
              <div className="todo__picker">
                <DateTimePicker
                value={this.state.selectedDate}
                disablePast
                onChange={this.handleTodoAdd}
                onClose={this.closePicker}
                ref={node => {
                  this.picker = node;
                }}
              />
              </div>
            </form>
            {
              formattedTodos.length ? (
                formattedTodos.map((item, i) => {
                  let todoDate = Object.keys(item);
                  return (
                    <div id={moment(todoDate.toString()).format('YYYY-MM-DD')} key={i} className="todo__group">
                      <button onClick={() => this.handleDropGroupBtn(i)} className="todo__group-dropBtn">
                        <Icon className="dropBtn-icon">arrow_drop_down</Icon>
                        {moment(todoDate.toString()).format('dddd, MMM D')}
                        <span className="todo__group-year">{moment(todoDate.toString()).format('YYYY')}</span>
                      </button>
                      <ul className="todo__group-tasks">
                        {
                          item[Object.keys(item)].map((item, i) => {
                            let todo = {
                              date: todoDate.toString(),
                              todo: item[Object.keys(item)].todo,
                              time: item[Object.keys(item)].time,
                              id: Object.keys(item).toString()
                            }
                            return (
                              <li key={i} className="todo__tasks__item">
                                <button onClick={(e) => this.handleTodoClick(e, todo)} className="tasks__item-checkbox">
                                  <span className="item-checkbox__box">
                                    <Icon fontSize="small" >done</Icon>
                                  </span>
                                </button>
                                <div className="tasks__item-task">
                                  <p className="task-name">{item[Object.keys(item)].todo}</p>
                                  <p className="task-time">{item[Object.keys(item)].time}</p>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  )
                })
              ) : (
                todos ? (
                  ''
                ) : (
                  <LinearProgress classes={{
                    barColorPrimary: classes.linearColorPrimary,
                    root: classes.linearMargins
                  }} />
                )
              )
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Head.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    todos: state.todo.todos ? state.todo.todos.todos : null,
    todoUpdated: state.todo.updated,
    todoAdded: state.todo.todoAdded,
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps, {createTodo, getAllTodo, updateTodo})(withStyles(styles)(Head));