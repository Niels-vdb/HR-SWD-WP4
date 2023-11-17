import React, { useState, useEffect } from "react";
import styles from "./Questions.module.css";
import NavBar from "../../components/Comp Niels/NavBar/NavBar";
import OpenQuestion from "../../components/Comp Niels/OpenQuestion/OpenQuestion";
import MCQuestion from "../../components/Comp Niels/MCQuestion/MCQuestion";
import { CssBaseline } from "@mui/material";
import CustomAlert from "../../components/Comp Niels/CustomAlert/CustomAlert";

const Question = () => {
  const [databaseQuestions, setDatabaseQuestions] = useState([]);
  const [alert, setAlert] = useState();
  const [toggle, setToggle] = useState(false);

  function liveSearch(event) {
    const val = event.target.value.trim();
    if (val === "") return;
    fetch(`api/question/filter/${val}`)
      .then((res) => res.json())
      .then((data) => {
        setDatabaseQuestions(data);
      })
      .catch((e) => console.log(e));
  }

  function fetchQuestions() {
    fetch(`/api/question/user=1`)
      .then((res) => res.json())
      .then((data) => {
        setDatabaseQuestions(data);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetchQuestions();
  }, [toggle]);

  function doSomething(params) {
    if (params === "refresh") {
      setToggle(!toggle);
    }
    if (params === "success")
      setAlert(
        <CustomAlert severity={"success"} input={"De vraag is opgeslagen!"} />
      );
    if (params === "failed")
      setAlert(
        <CustomAlert
          severity={"warning"}
          input={"Er is iets fout gegaan probeer leter opnieuw!"}
        />
      );
    if (params.delete) {
      fetch(`/api/question/${params.delete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((e) => {
        console.log(e);
        setAlert(
          <CustomAlert
            severity="warning"
            input={"Er is iets fout gegaan probeer leter opnieuw!"}
          />
        );
      });
      setAlert(
        <CustomAlert severity={"success"} input={"De vraag is verwijderd!"} />
      );
      setToggle(!toggle);
    }
  }

  return (
    <>
      {alert}
      <CssBaseline />
      <NavBar links={true} />
      <div className={styles.questionsDiv}>
        <h2>Maak nieuwe vragen aan</h2>
        <div className={styles.newQuestionsDiv}>
          <OpenQuestion handleCallback={doSomething} newQuestion={true} />
          <MCQuestion handleCallback={doSomething} newQuestion={true} />
        </div>
        <h2>Pas bestaande vragen aan</h2>
        <input
          className={styles.searchBarInput}
          type="text"
          placeholder="Zoek hier naar een vraag..."
          onKeyUp={liveSearch}
        ></input>
        <div className={styles.dbQuestions}>
          {databaseQuestions.map((question) => {
            return question.type === "open" ? (
              <OpenQuestion
                value={question.question}
                handleCallback={doSomething}
                dbQuestion={true}
                questionId={question.id}
                questionTitle={question.question}
                key={Math.random() * 100}
              />
            ) : (
              <MCQuestion
                value={question.question}
                options={question.options}
                handleCallback={doSomething}
                dbQuestion={true}
                questionId={question.id}
                questionTitle={question.question}
                key={Math.random() * 100}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Question;
