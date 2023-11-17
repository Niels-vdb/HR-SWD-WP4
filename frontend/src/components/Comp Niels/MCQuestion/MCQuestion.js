import React, { useState } from "react";
import styles from "./MCQuestion.module.css";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function MCQuestion(props) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [mcOption, setMcOption] = useState([
    <div className={styles.mcOption} key={Math.random() * 100}>
      <input
        disabled
        className={styles.radioBtn}
        type="radio"
        name="mcQuestion"
      />
      <input
        className={styles.mcInput}
        type="text"
        name="mcQuestion"
        placeholder="vul antwoord in..."
        onBlur={onBlur}
      />
    </div>,
    <div className={styles.mcOption} key={Math.random() * 100}>
      <input
        disabled
        className={styles.radioBtn}
        type="radio"
        name="mcQuestion"
      />
      <input
        className={styles.mcInput}
        type="text"
        name="mcQuestion"
        placeholder="vul antwoord in..."
        onBlur={onBlur}
      />
    </div>,
  ]);

  function onBlur(e) {
    setOptions((currentArray) => {
      return [e.target.value, ...currentArray];
    });
  }

  function newOption() {
    const optionsDiv = document.getElementById("newOption");
    if (mcOption.length === 3) optionsDiv.outerHTML = "";
    let inputName = `mcQuestion${mcOption.length + 1}`;
    setMcOption([
      ...mcOption,
      <div className={styles.mcOption} key={Math.random() * 100}>
        <input disabled className={styles.radioBtn} type="radio" />
        <input
          className={styles.mcInput}
          type="text"
          name={inputName}
          placeholder="vul antwoord in..."
          onBlur={onBlur}
        />
      </div>,
    ]);
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

  function saveQuestion() {
    const data = {
      question: question,
      options: options,
      patch: props.questionId,
    };

    if (props.dbQuestion) {
      if (question === props.questionTitle || question === "")
        data.question = props.questionTitle;

      fetchRequest(`/api/question/${props.questionId}`, "PATCH", data);
    } else
    fetchRequest("/api/question", "POST", data);
    
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

  // send info back to parent if chosen not created
  if (props.value)
    props.handleCallback({
      question: props.value,
      options: props.options,
    });

  const onTriggerQuestion = (event) => {
    // Call the parent callback function
    const questionInfo = {
      type: "mc",
      options: [],
    };

    if (event.target.id.toLowerCase() === "mccomponent") {
      questionInfo.question = event.target.children[0].value;
      for (const child of event.target.children[1].children) {
        questionInfo.options.push(child.lastChild.value);
      }
    }

    props.handleCallback(questionInfo);
  };

  return (
    <div
      draggable
      className={styles.newOpenQuestion}
      onPointerOut={onTriggerQuestion}
      id="mcComponent"
    >
      <input
        type="text"
        className={styles.newOpenQuestionInput}
        placeholder="Vul hier uw vraag in..."
        defaultValue={props.value}
        onBlur={(e) => setQuestion(e.target.value)}
      ></input>
      <div id="optionsDiv" className={styles.mcOptionsDiv}>
        {props.options
          ? props.options.map((option) => {
              return (
                <div className={styles.mcOption} key={Math.random() * 100}>
                  <input
                    disabled
                    className={styles.radioBtn}
                    type="radio"
                    name="mcQuestion"
                  />
                  <input
                    className={styles.mcInput}
                    type="text"
                    name="mcQuestion"
                    defaultValue={option}
                    onBlur={onBlur}
                    disabled
                  />
                </div>
              );
            })
          : mcOption}
      </div>
      {props.options ? null : (
        <AddIcon
          id="newOption"
          onClick={newOption}
          className={styles.plusBtn}
        />
      )}
      <div className={styles.newOpenQuestionBtns}>
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

export default MCQuestion;
