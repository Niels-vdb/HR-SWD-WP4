import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import styles from "./UserList.module.css"

export default function CheckboxListSecondary(props) {
  const [checkedUser, setCheckedUser] = React.useState([]);
  const [users, setUsers] = useState([]);

  function fetchUsers() {
    fetch(`/api/user`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }

  function liveSearch(event) {
    const val = event.target.value.trim();
    if (val === "") return;
    fetch(`api/user/filter/${val}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserToggle = (value) => () => {
    const currentIndex = checkedUser.indexOf(value);
    const newCheckedUser = [...checkedUser];

    if (currentIndex === -1) {
      newCheckedUser.push(value);
    } else {
      newCheckedUser.splice(currentIndex, 1);
    }

    setCheckedUser(newCheckedUser);
  };

  props.handleCallback(checkedUser)

  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        height: 300,
        overflow: "hidden",
        overflowY: "scroll",
      }}
    >
      <input
        className={styles.searchBarInput}
        type="text"
        placeholder="Zoek hier gebruikers..."
        onKeyUp={liveSearch}
      ></input>
      {users.map((user) => {
        const labelId = `checkbox-list-secondary-label-${user.id}`;
        return (
          <ListItem
            key={user.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleUserToggle(user.id)}
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar></ListItemAvatar>
              <ListItemText
                id={labelId}
                primary={`${user.firstName} ${user.lastName}`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
