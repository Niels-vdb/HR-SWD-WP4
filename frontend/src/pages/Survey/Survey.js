import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import NavBar from "../../components/Comp Niels/NavBar/NavBar";
import BasicTable from "../../components/Comp Niels/CustomTable";

const Survey = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  let { id } = useParams();

  fetch(`/api/survey/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setQuestions(data.questions);
    })
    .catch((e) => console.log(e));

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div>
      <CssBaseline />
      <NavBar />
      <h1>{capitalize(title)}</h1>
      <h2>{capitalize(description)}</h2>
      {questions.map((question) => {
        return (
          <div key={question.id}>
            <h3>{capitalize(question.question)}</h3>
            <BasicTable surveyId={id} questionId={question.id} />
          </div>
        );
      })}
    </div>
  );
};

export default Survey;
