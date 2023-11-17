import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function BasicTable(props) {
  const [answers, setAnswers] = useState([]);

  function fetchAnswers() {
    fetch(`/api/answer/${props.questionId}`)
      .then((res) => res.json())
      .then((data) => setAnswers(data));
  }

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Naam</TableCell>
            <TableCell align="right">Antwoord</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {answers.map((answer) => (
            <TableRow key={Math.random() * 100}>
              <TableCell component="th" scope="row">
                {answer.userName}
              </TableCell>
              <TableCell align="right">{answer.answer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
