const config = {
  "sahip": (process.env.sahip),//SAHİP İD

  "dashboard" : {
    "oauthSecret": (process.env.secret),// BOTUNUZUN SECRET IDSI
    "callbackURL": (process.env.callback),//CALLBACK URL ADRESİNİZ
    "sessionSecret": (process.env.secret2),
    "domain": (process.env.domain),//PROJE LİNKİNİZ
    "port": 8000
  },
};

module.exports = config;