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
                  this.addFirebaseAccount(
                    summoner.summonerName,
                    summoner.summonerId,
                    result.data.accountId
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

  addFirebaseAccount = (summonerName, summonerId, accountId) => {
    firebase
      .firestore()
      .collection("challenger")
      .doc(summonerName)
      .set(
        {
          summonerName: summonerName,
          summonerId: summonerId,
          accountId: accountId
        },
        { merge: true }
      );
  };
  addFirebaseMatch = ({
    lane,
    gameId,
    champion,
    platformId,
    timestamp,
    queue,
    role,
    season,
    summonerName,
    accountId
  }) => {
    firebase
      .firestore()
      .collection("matches")
      .doc()
      .set(
        {
          lane,
          gameId,
          champion,
          platformId,
          timestamp,
          queue,
          role,
          season,
          summonerName,
          accountId
        },
        { merge: true }
      );
  };

  getMatches = () => {
    let index, totalGames;
    console.log(this.props.summoner.length);
    firebase.firestore().settings({ timestampsInSnapshots: true });
    let promise = Promise.resolve();
    if (this.props.summoner.length > 1) {
      this.props.summoner.map(summoner => {
        return (promise = promise.then(() => {
          return new Promise(resolve => {
            index = 0;
            let matchUri = `/lol/match/v4/matchlists/by-account/${summoner.accountId}/?beginIndex=${index}&api_key=${process.env.REACT_APP_LEAGUE_API_KEY}`;
            axios(matchUri)
              .then(result => {
                index = result.data.endIndex;
                totalGames = result.data.totalGames;
                return result.data.matches.map(match => {
                  match.summonerName = summoner.summonerName;
                  match.accountId = summoner.accountId;
                  return this.addFirebaseMatch(match);
                });
              })
              .catch(e => console.log(e));
            setTimeout(resolve, 2000);
          });
        }));
      });
    }
  };

  render() {
    return (
      <HomePage
        {...this.props}
        getSummoners={this.getSummoners}
        getMatches={this.getMatches}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    summoner: state.summoner
  };
};

export default connect(mapStateToProps, { addSummoner })(HomePageContainer);
