const express = require('express')
const router = express.Router()
const validUrl = require('valid-url')

const Url = require('../../models/Url')
const generateShortUrl = require('../../utils/generate_shortUrl')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {
  const inputUrl = req.body.url

  if (validUrl.isUri(inputUrl)) { // 用 validUrl 偵測輸入網址是否為 url
    Url.findOne({ url: inputUrl }) // 是 url 的話，搜尋資料庫是否有重複的 url
      .lean()
      .then(haveUrl => {
        const shortUrl = generateShortUrl()
        if (haveUrl) { // 有重複的 url ，網頁顯示對應的短網址
          res.render('index', { isSameUrl: true, url: inputUrl, short_url: haveUrl.short_url })
        } else { // 沒有重複，則建立建立新的短網址
          return Url.create({ url: inputUrl, short_url: shortUrl })
            .then(() => res.render('show', { url: inputUrl, short_url: shortUrl }))
            .catch(error => console.log(error))
        }
      })
  } else { // 不是 url 的話，網頁顯示錯誤提示訊息
    res.render('index', { isNotUrl: true })
  }
})

router.get('/:inputShortUrl', (req, res) => {
  const inputShortUrl = req.params.inputShortUrl

  Url.findOne({ short_url: inputShortUrl }) // 在資料庫搜尋該輸入的短網址
    .then(data => {
      if (!data) { // 沒有的話，網頁顯示錯誤提示訊息
        return res.render('index', { isErrorUrl: true, inputShortUrl })
      }
      res.redirect(data.url) // 有的話，則跳轉至對應的原本網址
    })
    .catch(error => console.error(error))
})

module.exports = router
