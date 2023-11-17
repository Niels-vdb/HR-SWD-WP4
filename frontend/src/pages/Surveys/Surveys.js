import React, { useState, useEffect } from "react";
import NavBar from "../../components/Comp Niels/NavBar/NavBar";
import { CssBaseline } from "@mui/material";
import styles from "./Surveys.module.css";
import { Link } from "react-router-dom";

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);

  function fetchSurveys() {
    fetch("/api/survey")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSurveys(data);
      });
  }

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <>
      <CssBaseline />
      <NavBar />
      <h1>Op deze pagina kunnen surveys worden ingezien</h1>
      <div className={styles.surveyList}>
        {surveys.map((survey) => {
          return (
            <Link to={`/survey/${survey.id}`} className={styles.link}>
              <div className={styles.surveyDiv}>
                <iframe
                  className={styles.surveyiFrame}
                  src={`/survey/${survey.id}`}
                ></iframe>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Surveys;
