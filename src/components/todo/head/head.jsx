import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Icon, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { DateTimePicker } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import './head.css';

const styles = {
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: '#4a148c'
    }
  },
  cssFocused: {},
  notchedOutline: {},
}

const materialTheme = createMuiTheme({
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
      todoInputText: 'There is always something to do!',
      selectedDate: new Date()
    }
  }


  componentDidMount() {
    const page = this.props.match.params.page;
    this.setState({ 
      page: page ,
      todoInputText: this.createTodoInputText(page)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      const page = nextProps.match.params.page;
      this.setState({ 
        page: page,
        todoInputText: this.createTodoInputText(page)
      });
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
        this.setState({ selectedDate: new Date() })
        break;
      case 'tomorrow':
        text = `There's always tomorrow!`;
        let today = new Date(),
            tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        this.setState({
          selectedDate: tomorrow
        })
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

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  }

  openPicker = e => {
    this.picker.open(e);
  }

  handleTodoAdd = (e) => {
    e.preventDefault();
  }

  handleDropGroupBtn = (index) => {
    let tasksGroups = document.querySelectorAll('.todo__group');
    tasksGroups[index].classList.toggle('hidden');
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={materialTheme}>
        <div className="head">
          <p className="head__page-title">{this.state.page ? this.state.page : 'All'}</p>
          <div className="head__todo">
            <form onSubmit={this.handleTodoAdd} className="todo__form">
              <TextField
                fullWidth={true}
                placeholder={this.state.todoInputText}
                variant="outlined"
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                  }
                }}
              />
              <button className="todo__btn-picker" onClick={this.openPicker}>
                <Icon>calendar_today</Icon>
              </button>
              <div className="todo__picker">
                <DateTimePicker
                label="With"
                value={this.state.selectedDate}
                disablePast
                onChange={this.handleDateChange}
                ref={node => {
                  this.picker = node;
                }}
              />
              </div>
            </form>
            <div className="todo__group">
                <button onClick={() => this.handleDropGroupBtn(0)} className="todo__group-dropBtn">
                  <Icon className="dropBtn-icon">arrow_drop_down</Icon>
                  Monday, Nov 22
                  <span className="todo__group-tasksNumber">2</span>
                </button>
                <ul className="todo__group-tasks">
                  <li className="todo__tasks__item">
                    <button className="tasks__item-checkbox">
                      <span className="item-checkbox__box"></span>
                    </button>
                    <div className="tasks__item-task">
                      <p className="task-name">Kupić mleko!</p>
                      <p className="task-time">12:00 AM</p>
                    </div>
                  </li>
                  <li className="todo__tasks__item">
                    <button className="tasks__item-checkbox">
                      <span className="item-checkbox__box"></span> 
                    </button>
                    <div className="tasks__item-task">
                      <p className="task-name">rozdupczyć się</p>
                      <p className="task-time">01:43 PM</p>
                    </div>
                  </li>
                </ul>
            </div>
            <div className="todo__group">
                <button onClick={() => this.handleDropGroupBtn(1)} className="todo__group-dropBtn">
                  <Icon className="dropBtn-icon">arrow_drop_down</Icon>
                  Tuesday, Nov 24
                  <span className="todo__group-tasksNumber">2</span>
                </button>
                <ul className="todo__group-tasks">
                  <li className="todo__tasks__item">
                    <button className="tasks__item-checkbox">
                      <span className="item-checkbox__box"></span>
                    </button>
                    <div className="tasks__item-task">
                      <p className="task-name">Berlinowelelele</p>
                      <p className="task-time">04:31 PM</p>
                    </div>
                  </li>
                  <li className="todo__tasks__item">
                    <button className="tasks__item-checkbox">
                      <span className="item-checkbox__box"></span>
                    </button>
                    <div className="tasks__item-task">
                      <p className="task-name">abababab</p>
                      <p className="task-time">02:43 PM</p>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Head.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Head);
