const { User } = require('../models/User')
const bcrypt = require('bcrypt')


const identityName = 'email'
async function register(identity, password, username) {
  const existing = await User.findOne({ [identityName]: identity })

  if (existing) {
    throw new Error(`This  ${identityName} is  already in use`)
  }

  const existingUsername = await User.findOne({ username: username })
  if (existingUsername) {
    throw new Error(`This  ${username} is  already in use`)
  }

  const user = new User({
    username: username,
    [identityName]: identity,
    password: await bcrypt.hash(password, 10),

  })

  await user.save()

  return user
}

async function login(identity, password) {
  const user = await User.findOne({ [identityName]: identity })

  if (!user) {
    throw new Error('Incorrect username or password')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw new Error('Incorrect username or password')
  }

  return user

}

async function findUserById(id) {
const user = await User.findById(id)
return user
}

module.exports = {
  register,
  login,
  findUserById

}