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
    //read from db
    this.getData();
  };

  async getData() {
    const snapshot = await firebase
      .firestore()
      .collection("challenger")
      .get();
    return snapshot.docs.map(doc => this.props.addSummoner(doc.data()));
  }

  getSummoners = () => {
    const ranked = "RANKED_SOLO_5x5";
    const uri = `/lol/league/v4/challengerleagues/by-queue/${ranked}/?api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
    let promise = Promise.resolve();
    firebase.firestore().settings({ timestampsInSnapshots: true });
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

                  firebase
                    .firestore()
                    .collection("challenger")
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
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    return <HomePage {...this.props} getSummoners={this.getSummoners} />;
  }
}

const mapStateToProps = state => {
  return {
    summoner: state.summoner
  };
};

export default connect(mapStateToProps, { addSummoner })(HomePageContainer);
