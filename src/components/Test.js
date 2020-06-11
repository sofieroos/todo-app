import React, { useEffect, useState, useRef } from "react";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import { Typography, Button, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

export const Test = () => {
  const [text, setText] = useState("Text Item");

  return (
    <Grid
      container
      direction="column"
      justify="center"
      spacing={2}
      alignItems="center"
      style={{ padding: "20px" }}
    >
      <Grid item>
        <Typography className="text" variant="h6">
          {text}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          id="button"
          variant="contained"
          onClick={() => {
            setText("Button was Clicked");
          }}
        >
          Button
        </Button>
      </Grid>
      <Grid item>
        <TextField></TextField>
      </Grid>
    </Grid>
  );
};
