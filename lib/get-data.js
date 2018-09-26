const axios = require('axios')
const generateSystemToken = require('./generate-system-token')

module.exports = options => {
  return new Promise(async (resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = generateSystemToken(options.secret)
    axios.post(options.url, options.payload)
      .then(result => {
        return resolve(result.data)
      })
      .catch(error => {
        console.log(error)
        return resolve(false)
      })
  })
}
