/*
* Returns living parents with guardian responsibilities
* or living parents
*/

const normalizeContact = require('tfk-dsf-normalize-contact')
const lookupDsf = require('./lookup-dsf')
const lookupKor = require('./lookup-kor')
const mapToFint = require('./map-to-fint')

function isBosatt (person) {
  return person['STAT-KD'].toString() === '1'
}

function isAvailable (person) {
  const validStats = ['0']
  return validStats.includes(person['SPES-KD'].toString())
}

function getParentsPersonalIds (data) {
  let ids = data.map(person => `${person['FODT']}${person['PERS']}`)
  return ids
}

function getInrs (person) {
  let inrs = []
  if (person['FORAN-KD'] === 'D') {
    if (person['MOR-INR']) {
      inrs.push(person['MOR-INR'])
    }
    if (person['FAR-INR']) {
      inrs.push(person['FAR-INR'])
    }
  }
  if (person['FORAN-KD'] === 'M') {
    if (person['MOR-INR']) {
      inrs.push(person['MOR-INR'])
    }
  }
  if (person['FORAN-KD'] === 'F') {
    if (person['FAR-INR']) {
      inrs.push(person['FAR-INR'])
    }
  }
  return inrs
}

module.exports = async data => {
  let foreldre = []
  let type = 'hentForeldre'

  if (data.FOR && data.HOV && data.HOV['FORAN-KD']) {
    const parents = Array.isArray(data.FOR) ? data.FOR : [data.FOR]
    const bosatteParents = parents.filter(isBosatt).filter(isAvailable)
    const inrs = getInrs(data.HOV)
    foreldre = bosatteParents.filter(parent => inrs.includes(parent.INR))
  } else if (data.FOR && data.HOV) {
    type = 'hentDetaljer'
    const parents = Array.isArray(data.FOR) ? data.FOR : [data.FOR]
    foreldre = parents.filter(isBosatt).filter(isAvailable)
  }

  const person = normalizeContact(data.HOV)
  const foresatteIds = getParentsPersonalIds(foreldre)
  const alleForesatte = foresatteIds.length > 0 ? await Promise.all(foresatteIds.map(id => lookupDsf(id))) : []
  const tilgjengeligeForesatte = alleForesatte.map(foresatt => normalizeContact(foresatt.HOV))
  const validerteForesatte = type === 'hentForeldre' ? tilgjengeligeForesatte : tilgjengeligeForesatte.filter(foresatt => foresatt.address === person.address && foresatt.zip === person.zip && foresatt.city === person.city)
  const vfIds = validerteForesatte.map(foresatt => foresatt.personalIdNumber)
  console.log(`Got ${vfIds.length} vfIds`)
  const kors = await lookupKor(vfIds)
  console.log(`Got ${kors.length} kors`)
  const enrichedForesatte = validerteForesatte.map(foresatt => Object.assign({}, foresatt, kors[foresatt.personalIdNumber] || {}))
  console.log(`Got ${enrichedForesatte.length} enrichedForesatte`)
  return enrichedForesatte.map(mapToFint)
}
