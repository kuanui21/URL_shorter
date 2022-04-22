const Url = require('../Url') // 載入 Url model
const db = require('../../config/mongoose')

const generateShortUrl = require('../../utils/generate_shortUrl')

db.once('open', () => {
  for (let i = 1; i <= 3; i++) {
    const shortUrl = generateShortUrl()

    Url.create({
      url: `http://url-${i}`,
      short_url: `${shortUrl}`
    })
  }

  console.log('done')
})
