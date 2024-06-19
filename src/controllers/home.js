const { Router } = require('express');
const { getRecent, getAll, getByIdWithProxy, getById } = require('../services/data');
const { findUserById } = require('../services/user');

const homeRouter = Router()


homeRouter.get('/', async (req, res) => {
  const courses = await getRecent()

  res.render('home', { courses })
})


homeRouter.get('/catalog', async (req, res) => {
  const courses = await getAll()

  res.render('catalog', { courses })
})

homeRouter.get('/catalog/:id', async (req, res) => {
  try {
    const course = await getById(req.params.id)
    const coursePopulated = await getByIdWithProxy(req.params.id)

    if (!course) {
      res.render('404');
      return;
    }

    const isOwner = req.user?._id == course.author._id.toString();
    const hasSigned = Boolean(course.signUpList.find(l => req.user?._id == l._id.toString()));

    const signedUsernames = coursePopulated.signUpList.map(user => user.username);
    const authorEmail = coursePopulated.author.email;


    let buff = signedUsernames.join(', ')


    res.render('details', { course, isOwner, hasSigned, authorEmail, buff });
  } catch (err) {
    res.render('404')
  }
});




module.exports = {
  homeRouter
}
