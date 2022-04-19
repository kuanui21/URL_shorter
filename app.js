const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const validUrl = require('valid-url')

const urlModel = require('./models/urlModel')
const generateShortUrl = require('./generate_shortUrl')

const shortUrl = generateShortUrl()

const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.url

  if (validUrl.isUri(url)) {
    urlModel.find({ url })
      .lean()
      .then(longUrl => {
        const filterUrl = longUrl.filter(InputUrl => InputUrl.url.includes(url))

        if (filterUrl.length > 0) {
          console.log('有重複資料')
          const filterShortUrl = filterUrl[0].short_url
          res.render('index', { isSomeUrl: "true", shortUrl: filterShortUrl })
        } else {
          return urlModel.create({ url, short_url: shortUrl })
            .then(() => res.render('show', { shortUrl }))
            .catch(error => console.log(error))
        }
      })
  } else {
    res.render('index', { isUrl: "false" })
  }
})

app.get('/show', (req, res) => {
  res.render('show', { shortUrl })
})

app.listen(port, () => {
  console.log(`Express App is running on http://localhost:${port}`)
})