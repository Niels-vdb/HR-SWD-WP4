import React, { useState, useEffect } from "react";
import styles from "./UsersCard.module.css";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";

function UsersCard(props) {
  const [users, setUsers] = useState([]);
  const [toggle, setToggle] = useState(true);

  function liveSearch(event) {
    const val = event.target.value.trim();
    if (val === "") return;
    fetch(`api/user/filter/${val}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }

  function fetchUsers() {
    fetch(`/api/user`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }

  useEffect(() => {
    setToggle(!toggle);
  }, [props.toggle]);

  // rerenders userlist after new insertion
  useEffect(() => {
    fetchUsers();
  }, [toggle]);

  function deleteUser(userId) {
    console.log(userId);
    fetch(`api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userId),
    })
      .then((response) => response.json())
      .then((data) => {
        setToggle(!toggle)
        props.handleCallback("delete success")
      })
      .catch((e) => {
        props.handleCallback("delete failure")
        console.log(e)
      });
  }

  return (
    <div className={styles.card}>
      <h3>Bekijk gebruikers</h3>
      <div className={styles.userCard}>
        <input
          className={styles.searchBarInput}
          type="text"
          placeholder="Zoek hier gebruikers..."
          onKeyUp={liveSearch}
        ></input>
        {users.map((user) => {
          return (
            <div className={styles.usersDiv} key={user.id}>
              <div className={styles.userIcon}>
                {user.admin === 1 ? <AdminPanelSettingsIcon /> : <PersonIcon />}
              </div>
              <div
                className={styles.userName}
              >{`${user.firstName} ${user.lastName}`}</div>
              <div className={styles.userDelete}>
                {user.admin === 1 ? (
                  <div />
                ) : (
                  <DeleteIcon
                    className={styles.deleteBtn}
                    onClick={() => deleteUser(user.id)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersCard;
