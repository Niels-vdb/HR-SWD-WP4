import React from "react";
import { useState } from "react";

const Time = (props) => {
  const [currentTime, setCurrentTime] = useState(0);

  fetch(`/api/time/${props.id}`)
    .then((res) => res.json())
    .then((data) => {
      setCurrentTime(data.time);
    });

  return <div>{currentTime}</div>;
};

export default Time;
