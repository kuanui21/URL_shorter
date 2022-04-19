const urlModel = require('../urlModel') // 載入 Url model
const mongoose = require('mongoose')

const generateShortUrl = require('../../generate_shortUrl')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  for (let i = 0; i < 3; i++) {
    const shortUrl = generateShortUrl()

    urlModel.create({
      url: `http://url-${i}`,
      short_url: `http://short_url-${i}/${shortUrl}`
    })
  }

  console.log('done')
})