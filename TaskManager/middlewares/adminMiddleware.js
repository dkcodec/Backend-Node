module.exports = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(200).redirect('/') // Если нет пользователя или роли, перенаправляем
  }

  if (req.user.role !== 'admin') {
    return res.status(200).redirect('/') // Если не админ, доступ запрещён
  }

  next() // Если всё ок, передаём управление дальше
}
