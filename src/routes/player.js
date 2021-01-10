module.exports = (req, res) => {
    nickname = req.body.user.nickname;
    res.render('play', { nickname })
}