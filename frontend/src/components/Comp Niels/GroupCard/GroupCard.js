import React, { useState, useEffect } from "react";
import styles from "./GroupCard.module.css";
import Modal from "../GroupMakerModal/GroupMakerModal";
import CollapsibleTable from "../ClickableList";

function GroupCard(props) {
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = useState([]);

  const handleClick = () => {
    setOpen(!open);
  };

  function fetchGroups() {
    fetch(`/api/group`)
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
      });
  }

  useEffect(() => {
    fetchGroups();
  }, [props.toggle]);

  return (
    <div className={styles.card}>
      <h3>Bekijk en maak groepen aan</h3>
      <CollapsibleTable groups={groups} />
      <div className={styles.newGroupBtn}>
        <Modal handleCallback={props.handleCallback} />
      </div>
    </div>
  );
}

export default GroupCard;
