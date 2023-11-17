import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import UserList from "../UserList/UserList";
import GroupList from "../GroupList/GroupList";
import styles from "./SurveyModal.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function sendSurvey() {
    const data = {
      title: props.title,
      description: props.description,
      questions: props.questions,
      anon: false,
      users: users,
      groups: groups,
    };
    fetchRequest(data);
  }

  function sendSurveyAnon() {
    const data = {
      title: props.title,
      description: props.description,
      questions: props.questions,
      anon: true,
      users: users,
      groups: groups,
    };
    fetchRequest(data);
  }

  function fetchRequest(data) {
    fetch("/api/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers([])
        setGroups([])
        setOpen(!open)
        props.handleCallback("success")
      })
      .catch(e => {
        setOpen(!open)
        props.handleCallback("failure")
        console.log(e);
      });
  }

  function handleUserCallback(childInfo) {
    setUsers(childInfo);
  }
  function handleGroupCallback(childInfo) {
    setGroups(childInfo);
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        disabled={
          props.title && props.description && props.questions ? false : true
        }
      >
        Kies gebruikers
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className={styles.modalHeader}
          >
            Kies hier tussen gebruikers en of groepen
          </Typography>
          <div className={styles.userAndGroupDiv}>
            <UserList handleCallback={handleUserCallback} />
            <GroupList handleCallback={handleGroupCallback} />
          </div>
          <div className={styles.modalBtns}>
            <Button
              variant="contained"
              className={styles.sendBtn}
              onClick={sendSurvey}
              // disabled={users ? true : false}
            >
              Stuur vragenlijst op
            </Button>
            <Button
              variant="contained"
              className={styles.sendBtn}
              onClick={sendSurveyAnon}
              // disabled={users ? true : false}
            >
              Stuur vragenlijst anoniem op
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
