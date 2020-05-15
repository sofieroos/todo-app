import React from "react";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  extraMargin: {
    marginRight: 10,
  },
}));

export const Header = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.header}
    >
      <Typography variant="h4">
        <CheckBoxOutlinedIcon className={classes.extraMargin} />
        Todo List
      </Typography>
    </Grid>
  );
};
