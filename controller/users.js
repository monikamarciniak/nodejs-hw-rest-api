const { User } = require("../service/schemas/user.js");
const service = require("../service/users.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const getAll = async (req, res, next) => {
  try {
    const results = await User.find();
    res.status(200).json(results);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await service.getUser({ email });

  if (user) return res.status(409).json({ message: "Email in use" });

  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await service.getUser({ email });

    if (!user || !user.validPassword(password))
      return res.status(401).json({ message: "Email or password is wrong" });

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    await service.updateUser(user.id, { token });
    res
      .status(200)
      .json({ token, user: { email, subscription: user.subscription } });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await service.getUser({ _id: req.user._id });
    if (!user) return res.status(401).json({ message: "Not authorized" });
    await service.updateUser(user.id, { token: null });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const current = async (req, res, next) => {
  try {
    const user = await service.getUser({ token: req.user.token });
    if (!user) return res.status(401).json({ message: "Not authorized" });
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (err) {
    next(err);
  }
};

const updateSub = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const user = await service.getUser({ token: req.user.token });
    if (!user) return res.status(401).json({ message: "Not authorized" });
    const newUser = await service.updateUser(user.id, { subscription });
    res
      .status(200)
      .json({ email: newUser.email, subscription: newUser.subscription });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, getAll, login, logout, current, updateSub };