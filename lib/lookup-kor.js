const config = require('../config')
const getData = require('./get-data')

module.exports = async personalIds => {
  console.log('lookup-kor')
  const options = {
    url: config.KOR_SERVICE_URL,
    secret: config.KOR_JWT_SECRET,
    payload: personalIds
  }
  try {
    const data = await getData(options)
    return data.personer.reduce((prev, current) => {
      prev[current.personidentifikator] = {}
      if (current.reservasjon === 'NEI' && current.status === 'AKTIV' && current.kontaktinformasjon) {
        prev[current.personidentifikator].epostadresse = current.kontaktinformasjon.epostadresse || false
        prev[current.personidentifikator].mobiltelefonnummer = current.kontaktinformasjon.mobiltelefonnummer || false
      }
      return prev
    }, {})
  } catch (error) {
    throw error
  }
}
