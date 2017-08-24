
module.exports = {
    development: {
        db: 'mongodb://35.184.251.26:80/dplan',
        port: process.env.PORT || 5500,
  		TOKEN_SECRET: process.env.TOKEN_SECRET || "DPlan"
    }
};