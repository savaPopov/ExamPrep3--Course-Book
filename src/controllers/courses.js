const { Router } = require('express');
const { create, getById, update, deleteById, signCourse } = require('../services/data');
const { body, validationResult } = require('express-validator');
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util');

const courseRouter = Router()


courseRouter.get('/create', isUser(), async (req, res) => {
  res.render('create')
})

courseRouter.post('/create', isUser(),
  body('image').trim().isURL({ require_tld: false }).withMessage('The Course Image should start with http:// or https://'),
  body('title').trim().isLength({ min: 5 }).withMessage('The Title should be at least 5 characters'),
  body('type').trim().isLength({ min: 3 }).withMessage('The Type should be a minimum of 3 characters long'),
  body('certificate').trim().isLength({ min: 2 }).withMessage('The Certificate should be a minimum of 2 characters long'),
  body('description').trim().isLength({ min: 10 }).withMessage('The Description should be a minimum of 10 characters long'),
  body('price').trim().isInt({ min: 0 }).withMessage('The Price should be a positive number'),

  async (req, res) => {
    console.log(req.body)
    try {
      const validation = validationResult(req)

      if (validation.errors.length) {
        throw validation.errors
      }

      const result = await create(req.body, req.user._id)
      res.redirect('/catalog')
    } catch (err) {
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

courseRouter.get('/edit/:id', isUser(), async (req, res) => {
  const course = await getById(req.params.id)


  if (!course) {
    res.render('404')
  }

  const isOwner = req.user?._id == course.author.toString()

  if (!isOwner) {
    res.redirect('/login')
    return;
  }
  console.log(course)
  res.render('edit', { data: course })
})

courseRouter.post('/edit/:id', isUser(),
body('image').trim().isURL({ require_tld: false }).withMessage('The Course Image should start with http:// or https://'),
body('title').trim().isLength({ min: 5 }).withMessage('The Title should be at least 5 characters'),
body('type').trim().isLength({ min: 3 }).withMessage('The Type should be a minimum of 3 characters long'),
body('certificate').trim().isLength({ min: 2 }).withMessage('The Certificate should be a minimum of 2 characters long'),
body('description').trim().isLength({ min: 10 }).withMessage('The Description should be a minimum of 10 characters long'),
body('price').trim().isInt({ min: 0 }).withMessage('The Price should be a positive number'),
  async (req, res) => {
    const courseId = req.params.id
    const userId = req.user._id
    try {
      const validation = validationResult(req)

      if (validation.errors.length) {
        throw validation.errors
      }
      console.log(req.body)
      const result = await update(courseId, req.body, userId)
      res.redirect('/catalog/' + courseId)
    } catch (err) {
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

courseRouter.get('/delete/:id', isUser(), async (req, res) => {
  const courseId = req.params.id
  const userId = req.user._id

  try {

    const result = await deleteById(courseId, userId)
    res.redirect('/catalog')
  } catch (err) {
    res.redirect('/catalog/' + courseId)
  }
}
)

courseRouter.get('/sign/:id', isUser(), async (req, res) => {
  const courseId = req.params.id
  const userId = req.user._id

  try {

    const result = await signCourse(courseId, userId)
    res.redirect('/catalog/' + courseId)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
}
)
 

module.exports = {
  courseRouter
}