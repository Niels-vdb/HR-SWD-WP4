import React, { useState } from "react";
import styles from "./SurveyMaker.module.css";
import OpenQuestion from "../../components/Comp Niels/OpenQuestion/OpenQuestion";
import MCQuestion from "../../components/Comp Niels/MCQuestion/MCQuestion";
import QuestionFinder from "../../components/Comp Niels/QuestionFinder/QuestionFinder";
import NavBar from "../../components/Comp Niels/NavBar/NavBar";
import { CssBaseline } from "@mui/material";
import Modal from "../../components/Comp Niels/SurveyModal/SurveyModal";
import Button from "@mui/material/Button";
import CustomAlert from "../../components/Comp Niels/CustomAlert/CustomAlert";


function SurveyMaker() {
  const [questionList, setQuestionList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState()

  function newQuestionDiv(type) {
    switch (type) {
      case "openQ":
        setQuestionList([
          ...questionList,
          <OpenQuestion
            handleCallback={handleCallback}
            key={Math.random() * 100}
          />,
        ]);
        break;
      case "mcQ":
        setQuestionList([
          ...questionList,
          <MCQuestion
            handleCallback={handleCallback}
            key={Math.random() * 100}
          />,
        ]);
        break;
      default:
        break;
    }
  }

  function handleCallback(...childData) {
    // Update the name in the component's state
    let data = JSON.stringify(childData);
    return setQuestions([...questions, data]);
  }

  function callback(childData) {
    console.log(childData.id);
    switch (childData.type) {
      case "mc":
        setQuestionList([
          ...questionList,
          <MCQuestion
            handleCallback={handleCallback}
            key={Math.random() * 100}
            value={childData.question}
            options={childData.options}
          />,
        ]);
        break;
      case "open":
        setQuestionList([
          ...questionList,
          <OpenQuestion
            handleCallback={handleCallback}
            key={Math.random() * 100}
            value={childData.question}
          />,
        ]);
        break;
      default:
        break;
    }
  }

  function resetForm(childData) {
    switch (childData) {
      case "success":
        setAlert(<CustomAlert severity="success" input="De vragenlijst is aangemaakt en opgestuurd!" />)
        setQuestionList([])
        setTitle("")
        setDescription("")
        document.getElementById("titleInput").value=""
        document.getElementById("descriptionInput").value=""
        break;
      case "failure":
        setAlert(<CustomAlert severity="warning" input="De vragenlijst is niet aangemaakt en opgestuurd. Probeer opnieuw!" />)
        break;
    
      default:
        break;
    }
  }

  return (
    <>
    {alert}
      <CssBaseline />
      <NavBar links={true} />
      <h1>Maak een nieuwe vragenlijst aan</h1>
      <div className={styles.surveyMakerScreen}>
        <div className={styles.surveyMaker}>
          <input
            type="text"
            placeholder="Vul hier de titel in..."
            className={styles.surveyTitle}
            onBlur={(e) => setTitle(e.target.value)}
            id="titleInput"
          />
          <textarea
            placeholder="Geef hier een beschrijving van de vragenlijst..."
            className={styles.surveyDescription}
            onBlur={(e) => setDescription(e.target.value)}
            id="descriptionInput"
          />
          <div id="questionsDiv">{questionList}</div>
          <div className={styles.newQuestionBtns}>
            <Button
              variant="outlined"
              onClick={() => {
                newQuestionDiv("mcQ");
              }}
            >
              Nieuwe MC vraag
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                newQuestionDiv("openQ");
              }}
            >
              Nieuwe open vraag
            </Button>
          </div>
        </div>
        <QuestionFinder handleCallback={callback} />
      </div>
      <section className={styles.UserBtns}>
        <Modal questions={questions} title={title} description={description} handleCallback={resetForm}/>
      </section>
    </>
  );
}
// }

export default SurveyMaker;
