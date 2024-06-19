

const { courseRouter } = require('../controllers/courses')
const { homeRouter } = require('../controllers/home')
const { userRouter } = require('../controllers/user')

function configRoutes(app) {
  app.use(homeRouter)
  app.use(userRouter)
  app.use(courseRouter)
  app.get('*',(req,res)=>{
    res.render('404')
  })


}

module.exports = {
  configRoutes
}