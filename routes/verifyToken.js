const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    jwt.verify(token, process.env.JTW_SEC, (err, user) => {
      if (err) res.status(403).json("許可されたトークンではありません");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("権限がありません");
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("アクセスが許可されていません");
    }
  });

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
