const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Url = require('./models/url')
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
  return Url.create({ url, short_url: shortUrl })
    .then(() => res.redirect('/show'))
    .catch(error => console.log(error))
})

app.get('/show', (req, res) => {
  res.render('show', { shortUrl })
})

app.listen(port, () => {
  console.log(`Express App is running on http://localhost:${port}`)
})