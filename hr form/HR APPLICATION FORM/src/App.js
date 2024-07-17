import "./App.css";
import HOME from "./components/HOME/HOME";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./PSG HOSPITALS LOGO.jpg";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Register from "./components/HOME/Signup";
import Login from "./components/HOME/logIn";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://it23:3001/Search");
      setData(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error:", error.message);
      } else {
        console.log("Error:", error);
      }
    }
    setLoading(false);
  };
  return (
    <div className="App">
      <div className="mrd_nav">
        <img src={logo} className="mrd_nav_img" alt="PSG HOSPITALS"></img>
      </div>
      <div className="mrd_nav_line1">
        {" "}
        <h4>Job Applicant Registration Form</h4>
      </div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HOME />} />
      </Routes>
      <Modal show={show} onHide={handleClose} centered>
        {loading ? (
          <div className="mrd_ser_loading">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <Modal.Body>
            <Form onSubmit={handleSubmit}></Form>
            <div>{data}</div>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
}

export default App;
