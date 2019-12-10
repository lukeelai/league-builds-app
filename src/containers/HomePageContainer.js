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
    let promise = Promise.resolve();
    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });
    axios(uri)
      .then(result => {
        result.data.entries.map(summoner => {
          return (promise = promise.then(() => {
            return new Promise(resolve => {
              const summonerUri = `/lol/summoner/v4/summoners/${summoner.summonerId}/?api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
              axios(summonerUri)
                .then(result => {
                  this.props.addSummoner({
                    summonerName: summoner.summonerName,
                    summonerId: summoner.summonerId,
                    accountId: result.data.accountId
                  });

                  db.collection("challenger")
                    .doc(summoner.summonerName)
                    .set(
                      {
                        summonerName: summoner.summonerName,
                        summonerId: summoner.summonerId,
                        accountId: result.data.accountId
                      },
                      { merge: true }
                    );
                })
                .catch(e => {
                  console.log("summoner", e);
                  return "error";
                });
              setTimeout(resolve, 2000);
            });
          }));
        });
        // this.props.addSummoner(newData);
      })
      .catch(e => {
        console.log(e);
      });
  };

  getAccountId = summonerId => {
    const summonerUri = `/lol/summoner/v4/summoners/${summonerId}/?api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
    let accountId = "";
    axios(summonerUri)
      .then(result => {
        accountId = result.data.accountId;
        console.log(accountId);
      })
      .catch(e => {
        console.log("summoner", e);
      });
    return accountId;
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
