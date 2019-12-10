import React from "react";
import axios from "axios";
import { connect } from "react-redux";

//Actions
import { addSummoner } from "../actions/summoner";

//Components
import HomePage from "../components/HomePage";

//DB
import firebase from "../firebase/firebase";

class HomePageContainer extends React.Component {
  componentWillMount = () => {
    this.getSummoner();
  };

  getSummoner = () => {
    const ranked = "RANKED_SOLO_5x5";
    const uri = `/lol/league/v4/challengerleagues/by-queue/${ranked}/?api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
    axios(uri)
      .then(result => {
        const newData = result.data.entries.map(summoner => {
          const db = firebase.firestore();
          db.settings({ timestampsInSnapshots: true });
          let setDoc = db
            .collection("challenger")
            .doc(summoner.summonerName)
            .set({
              summonerName: summoner.summonerName,
              summonerId: summoner.summonerId,
              accountId: ""
            });
          return {
            summonerName: summoner.summonerName,
            summonerId: summoner.summonerId,
            accountId: ""
          };
        });
        this.props.addSummoner(newData);
      })
      .catch(e => {
        console.log(e);
      });
  };

  getAccountId = summonerId => {
    const summonerUri = `/lol/summoner/v4/summoners/${summonerId}/?api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
    axios(summonerUri)
      .then(result => {
        console.log(result.data);
      })
      .catch(e => {
        console.log("summoner", e);
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
