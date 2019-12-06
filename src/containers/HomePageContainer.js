import React from "react";
import axios from "axios";
import { connect } from "react-redux";

//Actions
import { addSummoner } from "../actions/summoner";

//Components
import HomePage from "../components/HomePage";

class HomePageContainer extends React.Component {
  componentDidMount = () => {
    console.log("Home Page Container");
    this.getSummoner();
  };

  getSummoner = () => {
    const ranked = "RANKED_SOLO_5x5";
    const uri = `/lol/league/v4/challengerleagues/by-queue/${ranked}/?api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
    axios(uri)
      .then(result => {
        console.log(result.data);
        this.props.addSummoner(result.data.entries);
      })
      .catch(e => {
        console.log(e);
      });
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

export default connect(mapStateToProps, { addSummoner })(HomePageContainer);
