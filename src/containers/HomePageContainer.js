import React from "react";
import axios from "axios";
import { connect } from "react-redux";

//Components
import HomePage from "../components/HomePage";

class HomePageContainer extends React.Component {
  componentDidMount = () => {
    console.log("Home Page Container");
  };

  render() {
    return <HomePage {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    summoner: state.summoner
  };
};

export default connect(mapStateToProps)(HomePageContainer);
