import React from "react";
import { Snackbar, Alert } from "@mui/material";

export const Successpage = ({ open, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="success">
        Data Inserted successfully...!!
      </Alert>
    </Snackbar>
  );
};
