const proxy = require("http-proxy-middleware");
module.exports = app => {
  app.use(
    "/lol/league/v4/challengerleagues/by-queue/",
    proxy({ target: "https://na1.api.riotgames.com", changeOrigin: true })
  );

  app.use(
    "/lol/summoner/v4/summoners/",
    proxy({ target: "https://na1.api.riotgames.com", changeOrigin: true })
  );
};
