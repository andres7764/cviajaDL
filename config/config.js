
module.exports = {
    development: {
        db: 'mongodb://35.184.69.152:80/cviaja',
        port: process.env.PORT || 5500, 
  		TOKEN_SECRET: process.env.TOKEN_SECRET || "DPlan"
    }
};