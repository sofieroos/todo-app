import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Checkbox,
  InputBase,
  FormControlLabel,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";

export const Todos = () => {
  const classes = useStyles();

  const [todos, setTodos] = useState([]);
  const [load, setLoad] = useState(false);
  const [hasError, setErrors] = useState(false);
  const textInput = useRef(null);

  function getTodos() {
    fetch(`/api/todos`)
      .then((res) => res.json())
      .then((res) => {
        setTodos(res.todos);
        setLoad(true);
      })
      .catch((err) => {
        setErrors(err);
        setLoad(true);
      });
  }

  function addTodo(todo) {
    if (todo && todo.length > 0) {
      const newTodo = {
        todo: todo,
        completed: false,
      };

      fetch(`/api/todos`, {
        method: "POST",
        body: JSON.stringify(newTodo),
      })
        .then((res) => {
          if (res.status === 201) {
            getTodos();
          }
        })
        .catch((err) => {
          setErrors(err);
        });
    }
  }

  function completeTodo(e) {
    const id = e.target.name;
    const checked = e.target.checked;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: checked } : todo
      )
    );

    fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: checked }),
    })
      .then((res) => {
        if (res.status !== 200) {
          getTodos();
        }
      })
      .catch((err) => {
        setErrors(err);
        getTodos();
      });
  }

  function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          getTodos();
        }
      })
      .catch((err) => {
        setErrors(err);
      });
  }

  useEffect(() => {
    getTodos();
  }, []);

  return !hasError ? (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <Grid container direction="column">
          <Paper variant="outlined" className={classes.addTodoContainer}>
            <Grid
              item
              xs
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <InputBase
                  id="newTodo"
                  placeholder="Add Todo"
                  data-testid="add-todo-input"
                  inputProps={{
                    onKeyDown: (e) =>
                      e.key === "Enter" ? addTodo(e.target.value) : null,
                    ref: textInput,
                  }}
                />
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => addTodo(textInput.current.value)}
                  aria-label="add"
                  data-testid="add-todo-btn"
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
          {load ? (
            todos.length > 0 ? (
              todos.map((todo) => (
                <Grid
                  key={todo.id}
                  item
                  container
                  direction="row"
                  justify="space-between"
                  spacing={1}
                >
                  <Grid item>
                    <FormControlLabel
                      value={todo.todo}
                      control={
                        <Checkbox
                          checked={todo.completed}
                          onChange={completeTodo}
                          name={todo.id}
                        />
                      }
                      label={todo.todo}
                      data-cy="todoItem"
                    />
                  </Grid>
                  <Grid>
                    <IconButton
                      id={todo.id}
                      aria-label="delete"
                      data-cy="deleteItem"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" align="center">
                Everything is done!
              </Typography>
            )
          ) : (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          )}
        </Grid>
      </Paper>
    </div>
  ) : (
    <Paper className={classes.item}>
      <Typography>
        Todos could not be fetched: {JSON.stringify(hasError)}
      </Typography>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    margin: "auto",
    width: "80%",
    maxWidth: 600,
  },
  addTodoContainer: {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  fullWidth: {
    width: "100%",
  },
  delete: {
    float: "right",
  },
  root: {
    flexGrow: 1,
  },
}));
