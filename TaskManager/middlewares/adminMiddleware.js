module.exports = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(200).redirect('/') // If no user or role, access denied
  }

  if (req.user.role !== 'admin') {
    return res.status(200).redirect('/') // If user is not admin, access denied
  }

  next()
}
