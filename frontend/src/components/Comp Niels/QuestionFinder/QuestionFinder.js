import React, { useState, useEffect } from "react";
import styles from "./QuestionFinder.module.css";
import Box from "@mui/material/Box";

function QuestionFinder(props) {
  const [questions, setQuestions] = useState([]);
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [toggle, setToggle] = useState(false);

  function liveSearch(event) {
    const val = event.target.value.trim();
    if (val === "") return;
    fetch(`api/question/filter/${val}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      });
  }

  function fetchQuestions() {
    fetch(`/api/question/user=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      });
  }

  useEffect(() => {
    fetchQuestions();
  }, [toggle]);

  const commonStyles = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 1,
    border: 1,
    minWidth: "2rem",
    maxWidth: "2rem",
    minHeight: "2rem",
    maxHeight: "2rem",
    fontSize: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "black",
    color: "white",
  };

  function handleClick(question) {
    props.handleCallback(question)
  }

  return (
    <section className={styles.questionFinderDiv}>
      <input
        className={styles.searchBarInput}
        type="text"
        placeholder="Zoek hier naar een vraag..."
        onKeyUp={liveSearch}
      ></input>
      {questions.map((question) => {
        return (
          <div className={styles.question} key={question.id} onClick={() => handleClick(question)}>
            <div className={styles.questionText}>{question.question}</div>
            <Box sx={{ ...commonStyles, borderRadius: "50%" }}>
              {question.type}
            </Box>
          </div>
        );
      })}
    </section>
  );
}

export default QuestionFinder;
