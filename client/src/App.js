import React, { Fragment } from "react";
import Rules from "./components/Rules";
import MissionStatement from "./components/MissionStatement";
import "./App.css";

function App() {
  return (
    <Fragment>
      <h1>NOKAP</h1>
      <div className="container">
        <MissionStatement />
        <Rules />
      </div>
    </Fragment>
  );
}

export default App;
