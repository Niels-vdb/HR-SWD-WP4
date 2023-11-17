import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import styles from "./GroupList.module.css";

export default function NestedList(props) {
  const [open, setOpen] = React.useState(false);
  const [checkedGroups, setCheckedGroups] = React.useState([]);
  const [groups, setGroups] = useState([]);

  const handleGroupToggle = (value) => () => {
    const currentIndex = checkedGroups.indexOf(value);
    const newCheckedGroups = [...checkedGroups];

    if (currentIndex === -1) {
      newCheckedGroups.push(value);
    } else {
      newCheckedGroups.splice(currentIndex, 1);
    }

    setCheckedGroups(newCheckedGroups);
  };

  props.handleCallback(checkedGroups)

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
  }, []);

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        height: 300,
        overflow: "hidden",
        overflowY: "scroll",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {groups.map((group, index) => {
        return (
          <div key={group.groupId}>
            <ListItemButton onClick={() => handleClick(index)}>
              <Checkbox edge="end" onChange={handleGroupToggle(group.groupId)} />
              <ListItemText
                primary={group.groupName}
                className={styles.groupName}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {group.people.map((user) => {
                return (
                  <List
                    component="div"
                    disablePadding
                    key={Math.random() * 100}
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={user} />
                    </ListItemButton>
                  </List>
                );
              })}
            </Collapse>
          </div>
        );
      })}
    </List>
  );
}
