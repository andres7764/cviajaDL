
module.exports = {
    development: {
        db: 'mongodb://130.211.169.44:80/dplan',
        port: process.env.PORT || 5500,
  		TOKEN_SECRET: process.env.TOKEN_SECRET || "DPlan"
    }
};