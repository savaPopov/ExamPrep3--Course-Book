const { Data } = require('../models/Data')

async function getAll() {

  return Data.find().lean()
}

async function getById(id) {
  return Data.findById(id).lean()

}

async function getByIdWithProxy(id) {
  return Data.findById(id).populate('signUpList', 'username').populate('author', 'email')

}


function getRecent() {
  return Data.find().sort({ $natural: -1 }).limit(3).lean()
}

async function create(data, authorId) {

  const record = new Data({
    title: data.title,
    type: data.type,
    certificate: data.certificate,
    image: data.image,
    description: data.description,
    price: data.price,
    author: authorId
  })

  await record.save()

  return record
}

async function update(id, data, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }

  record.title = data.title
  record.type = data.type
  record.certificate = data.certificate
  record.image = data.image
  record.description = data.description
  record.price = data.price

  await record.save()

  return record
}

async function deleteById(id, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }

  await Data.findByIdAndDelete(id)


}

async function signCourse(courseId, userId) {
  const record = await Data.findById(courseId)

  if (!record) {
    throw new ReferenceError('Record not found!' + courseId)
  }

  if (record.author.toString() == userId) {
    console.log('err1')
    throw new Error('Access Denied!')
  }

  if (record.signUpList.find(l => l.toString() == userId)) {
    console.log('err2')
    return
  }

  record.signUpList.push(userId)

  await record.save()

}

module.exports = {
  getAll,
  getById,
  update,
  deleteById,
  create,
  getRecent,
  signCourse,
  getByIdWithProxy
}