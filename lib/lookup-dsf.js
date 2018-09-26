process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const config = require('../config')
const getData = require('./get-data')

module.exports = personalId => {
  return new Promise(async (resolve, reject) => {
    let dsfData = false
    const options = {
      url: `${config.DSF_SERVICE_URL}/hentDetaljer`,
      secret: config.DSF_JWT_SECRET,
      payload: {
        saksref: 'micro-foresatte',
        foedselsnr: personalId
      }
    }
    dsfData = await getData(options)

    if (dsfData !== false) {
      const person = dsfData.RESULT && dsfData.RESULT.HOV ? dsfData.RESULT.HOV : false
      return resolve(person)
    } else {
      return reject(new Error('DSF lookup failed'))
    }
  })
}
