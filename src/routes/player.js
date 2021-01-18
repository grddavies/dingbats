module.exports = (req, res) => {
  req.player
  console.log(`from the GET we got ${req.player}`)
  res.render('play');
};
