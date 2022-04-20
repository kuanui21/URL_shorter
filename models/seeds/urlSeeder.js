const urlModel = require('../urlModel') // 載入 Url model
const db = require('../../config/mongoose')

const generateShortUrl = require('../../generate_shortUrl')

db.once('open', () => {
  for (let i = 1; i <= 3; i++) {
    const shortUrl = generateShortUrl()

    urlModel.create({
      url: `http://url-${i}`,
      short_url: `http://localhost:3000/${shortUrl}`
    })
  }

  console.log('done')
})