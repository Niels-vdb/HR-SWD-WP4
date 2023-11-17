import React, { useState, useEffect } from "react";
import styles from "./MakeSurvey.module.css";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { CssBaseline } from "@mui/material";
import CustomAlert from "../../components/Comp Niels/CustomAlert/CustomAlert";

const MakeSurvey = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [finished, setFinished] = useState(false);
  const [anon, setAnon] = useState(false);
  const [alert, setAlert] = useState();
  let { id } = useParams();

  function fetchQuestions(params) {
    fetch(`/api/survey/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setQuestions(data.questions);
        setAnon(data.anon);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function sendSurvey(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let count = 0;
    for (let entry of data.entries()) {
      count += 1;
    }
    if (count !== questions.length)
      return setAlert(
        <CustomAlert severity="error" input="Niet alle vragen zijn ingevuld!" />
      );

    const surveyData = [];
    if (anon === 0) {
      const userId = sessionStorage.getItem("userId");
      surveyData.push(userId);
    }
    questions.forEach((question, index) => {
      index += 1;
      surveyData.push({
        questionId: question.id,
        answer: data.get(`question-${index}`),
      });
    });
    console.log(anon);
    console.log(surveyData);
    fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((e) =>
        setAlert(
          <CustomAlert
            severity="error"
            input="Er was een fout bij het opslaan!"
          />
        )
      );
    setAlert(
      <CustomAlert
        severity="success"
        input="Vragenlijst sucesvol opgeslagen!"
      />
    );
    setFinished(!finished);
  }

  return (
    <div>
      <CssBaseline />
      <h1>{capitalize(title)}</h1>
      <h2 className="h2">{capitalize(description)}</h2>
      <form className={styles.form} onSubmit={sendSurvey}>
        {questions.map((question) => {
          return (
            <div key={question.id}>
              <h3>{capitalize(question.question)}</h3>
              {question.options.length ? (
                <ul>
                  {question.options.map((option) => {
                    return (
                      <li key={option.id}>
                        <input
                          type="radio"
                          name={`question-${question.position}`}
                          id={option.id}
                          value={option.option}
                        />
                        <label htmlFor={option.id}>
                          {capitalize(option.option)}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <input
                  type="text"
                  placeholder="Vul hier uw antwoord in..."
                  className={styles.textInput}
                  name={`question-${question.position}`}
                />
              )}
            </div>
          );
        })}
        {alert}
        {finished ? null : (
          <div className={styles.submitBtnDiv}>
            <Button
              variant="contained"
              type="submit"
              className={styles.submitBtn}
            >
              Stuur vragenlijst op
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MakeSurvey;
