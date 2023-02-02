const validateData = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    
    if ({ details: [{ message }] }) {

      return res.status(400).json(message);
      next();
    }
  }
}

module.exports = { validateData };