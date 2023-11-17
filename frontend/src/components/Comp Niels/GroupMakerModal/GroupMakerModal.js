import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import UserList from "../UserList/UserList";
import GroupList from "../GroupList/GroupList";
import styles from "./GroupMakerModal.module.css";

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
  const [file, setFile] = useState();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [csvToggle, setCsvToggle] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fileReader = new FileReader();

  function handleOnChange(e) {
    setFile(e.target.files[0]);
    setCsvToggle(!csvToggle);
  }

  function svgUpload(e) {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        const csvRows = csvOutput.split(",");
        const array = [];
        for (let row of csvRows) {
          let data = row.replace("\r", "").split(", ");
          array.push({ email: data[0] });
        }
        setUsers(array);
      };
      fileReader.readAsText(file);
    }
  }

  function saveGroup(e) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const groupData = {
      groupName: data.get("groupName"),
      users: [],
    };
    for (const user of users) {
      groupData.users.push(user);
    }
    console.log(groupData);
    fetchRequest("/api/group", "POST", groupData);
    setOpen(false);
  }

  function handleCallback(childInfo) {
    setSelectedUsers(childInfo);
  }

  function addUsers() {
    fetch(`/api/user/${selectedUsers}`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }

  function fetchRequest(url, type, data = {}) {
    fetch(url, {
      method: type,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        props.handleCallback("group success")
      }) 
      .catch(e => {
        console.log(e);
        props.handleCallback("group failure");
      })
  }

  function addGroupName(e) {
    const value = e.target.value;
    setGroupName(value);
  }

  return (
    <div>
      <Button onClick={handleOpen} variant="contained">
        Maak nieuwe groep aan
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
          <form onSubmit={saveGroup}>
            <div className={styles.userAndGroupDiv}>
              <UserList handleCallback={handleCallback} />
              <div className={styles.newGroupInfo}>
                <input
                  type="text"
                  placeholder="Naam van nieuwe groep..."
                  className={styles.searchBarInput}
                  name="groupName"
                  onKeyUp={addGroupName}
                />
                <ul>
                  {users.map((user) => {
                    return <li key={Math.random() * 100}>{user.email}</li>;
                  })}
                </ul>
                <input
                  type="file"
                  accept=".csv"
                  id="csvInput"
                  onChange={handleOnChange}
                  className={styles.svgInputBtn}
                />
              </div>
            </div>
            <div className={styles.modalBtns}>
              <Button
                onClick={addUsers}
                variant="contained"
                className={styles.sendBtn}
              >
                Voeg gebruikers toe
              </Button>
              <Button
                onClick={svgUpload}
                variant="contained"
                className={styles.sendBtn}
                disabled={csvToggle ? false : true}
              >
                Voeg toe via CSV
              </Button>
              <Button
                variant="contained"
                className={styles.sendBtn}
                type="submit"
                disabled={users.length && groupName ? false : true}
              >
                Sla groep op
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
