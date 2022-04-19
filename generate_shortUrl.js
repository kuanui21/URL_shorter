function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function generateShortUrl() {
  const lettersAndNum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

  let collection = lettersAndNum.split('')

  let shortUrl = ''
  for (let i = 1; i <= 5; i++) {
    shortUrl += sample(collection)
  }

  return shortUrl
}

module.exports = generateShortUrl