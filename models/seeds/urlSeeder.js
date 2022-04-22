const Url = require('../Url') // 載入 Url model
const db = require('../../config/mongoose')

const urlList = require('./urlList.json')

db.once('open', () => {
  urlList.results.forEach(urlSeed => {
    Url.create({
      url: urlSeed.url,
      short_url: urlSeed.short_url
    })
  })

  console.log('done')
})
