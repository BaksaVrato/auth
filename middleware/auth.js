
const auth = (req, res, next) => {

  if (req.user) next();

  console.log(req.user);

  return res.sendStatus(401);

};

module.exports = auth;