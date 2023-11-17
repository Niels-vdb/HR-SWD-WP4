import React, { useState } from "react";
import styles from "./OpenQuestion.module.css";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";

function OpenQuestion(props) {
  const [question, setQuestion] = useState('')
  let questionInfo = { type: "open" };
  if (props.value) {
    questionInfo.question = props.value;
    props.handleCallback(questionInfo);
  }

  function fetchRequest(route, method, data) {
    fetch(route, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((e) => {
        console.log(e);
        if (props.handleCallback) props.handleCallback("failed");
      });

    if (props.handleCallback) props.handleCallback("success");
  }

  const onTrigger = (event) => {
    // Call the parent callback function
    setQuestion(event.target.value)
    questionInfo.question = event.target.value;
    props.handleCallback(questionInfo);
  };

  function saveQuestion(e) {
    const data = { question: question };
    if (props.dbQuestion) {
      data.patch = props.questionId;
      fetchRequest(`/api/question/${props.questionId}`, "PATCH", data);
    } else {
      fetchRequest("/api/question", "POST", data);
    }
    props.handleCallback("refresh")
  }

  function deleteQuestion(e) {
    if (props.dbQuestion) {
      props.handleCallback({ delete: props.questionId });
    } else {
      const target = e.target;
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  return (
    <div draggable className={styles.openQuestion}>
      <input
        type="text"
        className={styles.openQuestionInput}
        placeholder="Vul hier uw vraag in..."
        defaultValue={props.value}
        onBlur={onTrigger}
      ></input>
      <div className={styles.openQuestionBtns}>
        {props.newQuestion ? (
          <SaveAltIcon onClick={saveQuestion} className={styles.saveBtn} />
        ) : (
          <>
            <SaveAltIcon onClick={saveQuestion} className={styles.saveBtn} />
            <DeleteIcon onClick={deleteQuestion} className={styles.deleteBtn} />
          </>
        )}
      </div>
    </div>
  );
}

export default OpenQuestion;
