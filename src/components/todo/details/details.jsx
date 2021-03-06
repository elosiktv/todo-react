import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Icon } from '@material-ui/core';
import { updateTodo, removeTodo } from '../../../store/actions/todoActions';
import Button from '@material-ui/core/Button';
import moment from 'moment/moment.js';
import './details.css';

const styles = {
    cssRoot: {
        backgroundColor: '#4a148c',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#7E57C2'
        },
        marginTop: '10px'
    }
}

class Details extends Component {
  constructor() {
    super();
    this.state = {
        description: null
    }
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.clickedTodo) {
          if (this.props.clickedTodo) {
            if (nextProps.clickedTodo.id !== this.props.clickedTodo.id) {
                this.setState({ description: null });
            }
          }
      }
  }

  handleAreaChange = e => {
    this.setState({ [e.target.name]: e.target.value ? e.target.value : '' });
  }

  updateDescriptionTask = (todo, description) => {
      if (description) {
        todo.description = description;
        todo.id = this.props.clickedTodo.id
        this.props.updateTodo({ todo: todo});
      }
  }

  removeTask = todo => {
    todo.id = this.props.clickedTodo.id;
    this.props.removeTodo(todo);
  }

  render() {
    let { todos, clickedTodo, classes } = this.props;
    let clickedTodoData;
    if (todos && clickedTodo) {
        todos[clickedTodo.date].map((item) => {
            if (Object.keys(item).toString() === clickedTodo.id) {
                clickedTodoData = item[clickedTodo.id]
            }
            return '';
        });
    }
    return (
        <div className="details">
            {
                clickedTodoData ? (
                    <div className="details__task">
                        <div className="task__info">
                            <div className="details-close">
                                <button title="go back" onClick={() => { this.props.onClick(); this.setState({ description: null })}}>
                                    <Icon style={{ fontSize: 28 }} >arrow_back</Icon>
                                </button>
                            </div>
                            <div className="task-remove">
                                <button onClick={e => this.removeTask(clickedTodoData)} title="remove task" className="task-remove-btn">
                                    <Icon style={{ fontSize: 32 }} className="btn-icon">delete_forever</Icon>
                                </button>
                            </div>
                            <p className="task-fromNow">{moment(`${clickedTodoData.date} ${clickedTodoData.time}`).fromNow()}</p>
                        </div>
                        <div className="task__description">
                            <p className="task-title">{clickedTodoData.todo}</p>
                                <textarea name="description" onChange={this.handleAreaChange} value={this.state.description !== null ? this.state.description : clickedTodoData.description} className="description__textarea" placeholder="Description"></textarea>
                            <Button onClick={e => this.updateDescriptionTask(clickedTodoData, this.state.description)} className={classes.cssRoot} variant="contained">Save</Button>
                        </div>
                    </div>
                ) : (
                    <div className="details__center">Click a task title to view its details</div>
                )
            }
        </div>
    )
  }
}

export default connect(null, {updateTodo, removeTodo})(withStyles(styles)(Details));