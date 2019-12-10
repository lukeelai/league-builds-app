import React from "react";
import { Button } from "reactstrap";

const HomePage = props => {
  return (
    <div>
      <h1>Home</h1>
      <Button onClick={props.getSummoners}>Refresh</Button>
      <Button onClick={props.getMatches}>Matches</Button>
    </div>
  );
};

export default HomePage;
