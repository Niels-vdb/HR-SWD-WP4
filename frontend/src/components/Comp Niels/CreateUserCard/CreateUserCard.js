import React, { useState } from "react";
import styles from "./CreateUserCard.module.css";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";

function CreateUserCard(props) {
  const [file, setFile] = useState();
  const [csvToggle, setCsvToggle] = useState(false)
  const { register, handleSubmit } = useForm();

  const fileReader = new FileReader();

  function handleOnChange(e) {
    setFile(e.target.files[0]);
    setCsvToggle(!csvToggle)
  }

  function svgUpload(e) {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        const csvRows = csvOutput.split("\n");
        const userArray = [];
        for (let row of csvRows) {
          let data = row.replace("\r", "").split(", ");
          userArray.push({
            firstName: data[0],
            lastName: data[1],
            email: data[2],
            admin: data[3],
          });
        }
        fetchRequest(userArray);
      };

      fileReader.readAsText(file);
    }
  }

  function saveData(data) {
    fetchRequest([data]);
    document.getElementById("firstName").value = ""
    document.getElementById("lastName").value = ""
    document.getElementById("email").value = ""
    document.getElementById("admin").checked = false
    props.handleCallback()
  }

  function fetchRequest(data) {
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        props.handleCallback("user success")
      }) 
      .catch(e => {
        console.log(e);
        props.handleCallback("user failure");
      })
    }

  return (
    <div className={styles.card}>
      <h3>Maak nieuwe gebruiker aan</h3>
      <div className={styles.inputDiv}>
        <form
          onSubmit={handleSubmit((data) => {
            saveData(data);
          })}
        >
          <div>
            <label htmlFor="firstName">Voornaam</label>
            <input
              type="text"
              id="firstName"
              placeholder="Vul hier de informatie in..."
              className={styles.inputFields}
              {...register("firstName")}
            />
          </div>
          <div>
            <label htmlFor="lastName">Achternaam</label>
            <input
              type="text"
              id="lastName"
              placeholder="Vul hier de informatie in..."
              className={styles.inputFields}
              {...register("lastName")}
            />
          </div>
          <div>
            <label htmlFor="email">Email adres</label>
            <input
              type="email"
              id="email"
              placeholder="Vul hier de informatie in..."
              className={styles.inputFields}
              {...register("email")}
            />
          </div>
          <div className={styles.adminAndSubmit}>
            <input type="checkbox" id="admin" {...register("admin")} />
            <label htmlFor="admin" className={styles.adminLabel}>
              Admin
            </label>
            <Button variant="contained" type="submit">
              Opslaan
            </Button>
          </div>
        </form>
        <div className={styles.csvInput}>
          <label htmlFor="csvInput">Importeer via CSV file</label>
          <input
            type="file"
            accept=".csv"
            id="csvInput"
            onChange={handleOnChange}
          />
          <Button onClick={svgUpload} variant="contained" disabled={csvToggle ? false : true}>
            Sla CSV op
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserCard;
