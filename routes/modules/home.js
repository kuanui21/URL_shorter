const express = require('express')
const router = express.Router()
const validUrl = require('valid-url')

const Url = require('../../models/Url')
const generateShortUrl = require('../../utils/generate_shortUrl')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {
  const url = req.body.url

  if (validUrl.isUri(url)) { // 用 validUrl 偵測輸入網址是否為 url
    Url.find({ url }) // 是 url 的話，搜尋資料庫是否有重複的 url
      .lean()
      .then(longUrl => {
        const filterUrl = longUrl.filter(InputUrl => InputUrl.url.includes(url))
        const shortUrl = generateShortUrl()

        if (filterUrl.length > 0) { // 有重複的 url ，網頁顯示對應的短網址
          const filterShortUrl = filterUrl[0].short_url
          res.render('index', { sameUrl: 'true', url, shortUrl: filterShortUrl })
        } else { // 沒有重複，則建立建立新的短網址
          return Url.create({ url, short_url: shortUrl })
            .then(() => res.render('show', { url, shortUrl }))
            .catch(error => console.log(error))
        }
      })
  } else { // 不是 url 的話，網頁顯示錯誤提示訊息
    res.render('index', { notUrl: 'true' })
  }
})

router.get('/:inputShortUrl', (req, res) => {
  const inputShortUrl = req.params.inputShortUrl

  Url.findOne({ short_url: inputShortUrl }) // 在資料庫搜尋該輸入的短網址
    .then(data => {
      if (!data) { // 沒有的話，網頁顯示錯誤提示訊息
        return res.render('index', { errorUrl: 'true', inputShortUrl })
      }
      res.redirect(data.url) // 有的話，則跳轉至對應的原本網址
    })
    .catch(error => console.error(error))
})

module.exports = router
