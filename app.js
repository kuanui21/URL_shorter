const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const validUrl = require('valid-url')

const urlModel = require('./models/urlModel')
const generateShortUrl = require('./generate_shortUrl')
require('./config/mongoose')

const app = express()
const port = 3000

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
        const shortUrl = generateShortUrl()

        if (filterUrl.length > 0) {
          const filterShortUrl = filterUrl[0].short_url
          res.render('index', { isSomeUrl: "true", url, shortUrl: filterShortUrl })
        } else {
          return urlModel.create({ url, short_url: shortUrl })
            .then(() => res.render('show', { url, shortUrl }))
            .catch(error => console.log(error))
        }
      })
  } else {
    res.render('index', { isUrl: "false" })
  }
})

app.get("/:InputShortUrl", (req, res) => {
  const InputShortUrl = req.params.InputShortUrl
  console.log(InputShortUrl)
  urlModel.findOne({ short_url: InputShortUrl })
    .then(data => {
      if (!data) {
        return res.render('index', { isError: "true", InputShortUrl })
      }
      res.redirect(data.url)
    })
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express App is running on http://localhost:${port}`)
})