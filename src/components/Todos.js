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
  Tooltip,
} from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
} from "@material-ui/icons";
import dayjs from "dayjs";
import DayjsUtils from "@date-io/dayjs";

export const Todos = () => {
  const classes = useStyles();

  const [todos, setTodos] = useState([]);
  const [load, setLoad] = useState(false);
  const [selectedDate, handleDateChange] = useState(null);
  const [hasError, setErrors] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const textInput = useRef(null);
  const initialDate = dayjs();

  const getTodos = () => {
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
  };

  const addTodo = (todoUntrimmed) => {
    const todo = todoUntrimmed.trim();

    if (todo && todo.length > 0) {
      const newTodo = {
        todo: todo,
        completed: null,
        deadline: selectedDate,
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
  };

  const completeTodo = (e) => {
    const id = e.target.name;
    const checked = e.target.checked;

    const completedValue = checked ? Date.now() : null;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: completedValue } : todo
      )
    );

    fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: completedValue }),
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
  };

  const deleteTodo = (id) => {
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
  };

  useEffect(() => {
    getTodos();
  }, []);

  useInterval(() => {
    const todosToDelete = checkExpired(todos);
    todosToDelete.forEach((id) => {
      deleteTodo(id);
    });

    getTodos();
  }, 6000);

  return !hasError ? (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <Grid container direction="column">
          <Paper variant="outlined" className={classes.addTodoContainer}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              className={classes.height}
            >
              <Grid item md={10} xs={10}>
                <InputBase
                  id="newTodo"
                  placeholder="Add Todo"
                  fullWidth={true}
                  inputProps={{
                    onKeyDown: (e) =>
                      e.key === "Enter" ? addTodo(e.target.value) : null,
                    ref: textInput,
                  }}
                />
              </Grid>
              <Grid item>
                <Tooltip
                  placement="top"
                  arrow
                  title={
                    selectedDate !== null
                      ? dayjs(selectedDate).format("YYYY-MM-DD HH:mm")
                      : ""
                  }
                >
                  <IconButton
                    onClick={() => setIsOpen(true)}
                    data-testid="deadline-input"
                  >
                    <EventIcon
                      fontSize="small"
                      color={selectedDate !== null ? "primary" : "action"}
                    />
                  </IconButton>
                </Tooltip>
                <MuiPickersUtilsProvider utils={DayjsUtils}>
                  <DateTimePicker
                    autoOk
                    clearable
                    ampm={false}
                    open={isOpen}
                    onOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    disablePast
                    initialFocusedDate={initialDate}
                    value={selectedDate}
                    onChange={handleDateChange}
                    label=""
                    TextFieldComponent={() => null}
                  />
                </MuiPickersUtilsProvider>
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
                  alignItems="center"
                  spacing={1}
                  data-cy="todoItem"
                >
                  <Grid item md={8} xs={8}>
                    <FormControlLabel
                      value={todo.todo}
                      control={
                        <Checkbox
                          checked={todo.completed !== null}
                          onChange={completeTodo}
                          name={todo.id}
                        />
                      }
                      label={todo.todo}
                    />
                  </Grid>
                  {todo.deadline !== null ? (
                    <Grid item>
                      <Grid
                        container
                        justify="space-between"
                        spacing={1}
                        alignItems="center"
                      >
                        <Grid item>
                          <EventIcon fontSize="small" color="action" />
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary">
                            {dayjs(todo.deadline).format("MMM D H:mm")}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                  <Grid item>
                    <IconButton
                      id={todo.id}
                      aria-label="delete"
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
  height: {
    height: "48px",
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

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function checkExpired(todos) {
  const todosToDelete = [];
  todos.forEach((todo) => {
    const dateOfExpiration = dayjs(todo.completed).add(1, "day");
    const now = new Date();
    if (todo.completed !== null && dateOfExpiration.isBefore(dayjs(now))) {
      todosToDelete.push(todo.id);
    }
  });
  return todosToDelete;
}
