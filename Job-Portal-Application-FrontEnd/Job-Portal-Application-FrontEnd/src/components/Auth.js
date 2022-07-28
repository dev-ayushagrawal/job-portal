import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function Auth(props) {
  if (props.Role === "Admin") {
    console.log("Token : ", localStorage.getItem("admin_token"));
    if (localStorage.getItem("admin_token") !== null) {
      //Token Found In Local Storage
      console.log("Routing On : ", props.path, " Role Type : ", props.Role);
      return <Route exact path={props.path} component={props.component} />;
      //
    } else {
      // Token Not Found In Local Storage
      console.log("Admin Token Not Found & Redirect To Sign Up Page");
      return <Redirect exact path="/" />;
      //
    }
  } else {
    console.log("Token : ", localStorage.getItem("user_token"));
    if (localStorage.getItem("user_token") !== null) {
      //Token Found In Local Storage
      console.log("Routing On : ", props.path, " Role Type : ", props.Role);
      return <Route exact path={props.path} component={props.component} />;
      //
    } else {
      // Token Not Found In Local Storage
      console.log("User Token Not Found & Redirect To Sign Up Page");
      return <Redirect exact path="/" />;
      //
    }
  }
}
