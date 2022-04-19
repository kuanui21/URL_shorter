const urlModel = require('./models/urlModel')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('generate mongodb error!')
})

db.once('open', () => {
  console.log('generate mongodb connected!')
})

function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function checkShortUrl(shortUrlCCC) {
  urlModel.find({})
    .lean()
    .then(ShortUrlList => {
      shortUrlCCC = String(shortUrlCCC)
      const checkShortUrl = ShortUrlList.some(DBshortUrl => DBshortUrl.short_url === shortUrlCCC)

      if (checkShortUrl) {
        console.log(shortUrlCCC, '有重複的短網址')
        generateShortUrl()
      }
    })
}

function generateShortUrl() {
  const lettersAndNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

  let collection = lettersAndNum.split('')

  let shortUrl = ''
  for (let i = 1; i <= 5; i++) {
    shortUrl += sample(collection)
  }

  checkShortUrl(shortUrl)
  return shortUrl
}

module.exports = generateShortUrl