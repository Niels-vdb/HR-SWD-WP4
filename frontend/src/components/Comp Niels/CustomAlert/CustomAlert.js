import React from "react";
import Alert from "@mui/material/Alert";
import styles from "./CustomAlert.module.css"

function CustomAlert(props) {
  return (
    <Alert severity={props.severity} className={styles.alert}>
      {props.input}
    </Alert>
  );
};

export default CustomAlert;
