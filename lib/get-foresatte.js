const normalizeContact = require('tfk-dsf-normalize-contact')
const lookupDsf = require('./lookup-dsf')
const lookupKor = require('./lookup-kor')
const mapToFint = require('./map-to-fint')

function getParentsPersonalIds (data) {
  let ids = []
  if (data['MOR-FODT'] && data['MOR-PERS']) {
    ids.push(`${data['MOR-FODT']}${data['MOR-PERS']}`)
  }
  if (data['FAR-FODT'] && data['FAR-PERS']) {
    ids.push(`${data['FAR-FODT']}${data['FAR-PERS']}`)
  }
  return ids
}

function isBosatt (person) {
  return person['STAT-KD'].toString() === '1'
}

function isAvailable (person) {
  const validStats = ['0']
  return validStats.includes(person['SPES-KD'].toString())
}

module.exports = async data => {
  const person = normalizeContact(data)
  const foresatteIds = getParentsPersonalIds(data)
  console.log(`Got ${foresatteIds.length} foresatteIds`)
  const alleForesatte = foresatteIds.length > 0 ? await Promise.all(foresatteIds.map(id => lookupDsf(id))) : []
  console.log(`Got ${alleForesatte.length} alleForesatte`)
  const tilgjengeligeForesatte = alleForesatte.filter(foresatt => foresatt && isBosatt(foresatt) && isAvailable(foresatt)).map(foresatt => normalizeContact(foresatt))
  console.log(`Got ${tilgjengeligeForesatte.length} tilgjengeligeForesatte`)
  const validerteForesatte = tilgjengeligeForesatte.filter(foresatt => foresatt.address === person.address && foresatt.zip === person.zip && foresatt.city === person.city)
  console.log(`Got ${validerteForesatte.length} validerteForesatte`)
  const vfIds = validerteForesatte.map(foresatt => foresatt.personalIdNumber)
  console.log(`Got ${vfIds.length} vfIds`)
  const kors = await lookupKor(vfIds)
  console.log(`Got ${kors.length} kors`)
  const enrichedForesatte = validerteForesatte.map(foresatt => Object.assign({}, foresatt, kors[foresatt.personalIdNumber] || {}))
  console.log(`Got ${enrichedForesatte.length} enrichedForesatte`)
  return enrichedForesatte.map(mapToFint)
}
