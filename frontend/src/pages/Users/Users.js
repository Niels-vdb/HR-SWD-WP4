import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import NavBar from "../../components/Comp Niels/NavBar/NavBar";
import CreateUserCard from "../../components/Comp Niels/CreateUserCard/CreateUserCard";
import UsersCard from "../../components/Comp Niels/UsersCard/UsersCard";
import GroupCard from "../../components/Comp Niels/GroupCard/GroupCard";
import styles from "./Users.module.css";
import CustomAlert from "../../components/Comp Niels/CustomAlert/CustomAlert";

const Users = () => {
  const [userCardToggle, setUserCardToggle] = useState(false);
  const [alert, setAlert] = useState();
  const [groupToggle, setGroupToggle] = useState(false)

  function callback(childData) {
    setUserCardToggle(!userCardToggle);
    switch (childData) {
      case "delete success":
        setAlert(
          <CustomAlert
            severity="success"
            input="Gebruiker is sucesvol verwijderd"
          />
        );
        break;
      case "delete failure":
        setAlert(
          <CustomAlert
            severity="warning"
            input="Gebruiker kon niet verwijderd worden"
          />
        );
        break;
      case "user success":
        setAlert(
          <CustomAlert severity="success" input="Gebruiker is aangemaakt" />
        );
        break;
      case "user failure":
        setAlert(
          <CustomAlert
            severity="warning"
            input="Gebruiker kon niet aangemaakt worden"
          />
        );
        break;
      case "group success":
        setAlert(
          <CustomAlert severity="success" input="Groep is aangemaakt" />
        );
        setGroupToggle(!groupToggle)
        break;
      case "group failure":
        setAlert(
          <CustomAlert
            severity="warning"
            input="Groep kon niet aangemaakt worden"
          />
        );
        break;

      default:
        break;
    }
  }

  const loggedInUser = localStorage.getItem("authenticated");
  if (!loggedInUser) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <>
        {alert}
        <CssBaseline />
        <NavBar />
        <h1>Pas gebruikers en groepen aan</h1>
        <div className={styles.cardsDiv}>
          <UsersCard toggle={userCardToggle} handleCallback={callback} />
          <CreateUserCard handleCallback={callback} />
          <GroupCard handleCallback={callback} toggle={groupToggle}/>
        </div>
      </>
    );
  }
};

export default Users;
