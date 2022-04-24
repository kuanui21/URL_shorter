const Url = require('../models/Url')
const db = require('../config/mongoose')

function sample (array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function checkShortUrl (newShortUrl) {
  db.once('open', () => {
    Url.findOne({ short_url: newShortUrl }) // 搜尋資料庫是否有重複的 short_url
      .lean()
      .then(haveUrl => {
        if (haveUrl) { // 有重複的 short_url ，重新產生
          generateShortUrl()
        } else {
          console.log('沒有重複')
        }
      })
      .catch(error => console.log(error))
  })
}

function generateShortUrl () {
  const lettersAndNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

  const collection = lettersAndNum.split('')

  let shortUrl = ''
  for (let i = 1; i <= 5; i++) {
    shortUrl += sample(collection)
  }

  checkShortUrl(shortUrl)
  return shortUrl
}

module.exports = generateShortUrl
