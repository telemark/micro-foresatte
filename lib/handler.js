const { readFile } = require('fs').promises
const md = require('markdown-it')()
const { json, send } = require('micro')
const isValidFnr = require('is-valid-fodselsnummer')
const NodeCache = require('node-cache')
const lookupDsf = require('./lookup-dsf')
const getForesatte = require('./get-foresatte')
const myCache = new NodeCache({ stdTTL: 3600 })

exports.getFrontpage = async (request, response) => {
  const readme = await readFile('README.md', 'utf-8')
  send(response, 200, md.render(readme))
}

exports.getForesatte = async (request, response) => {
  const { fnr } = request.method === 'GET' ? request.params : await json(request)

  try {
    if (fnr && isValidFnr(fnr)) {
      const cachedInfo = myCache.get(fnr)
      if (cachedInfo) {
        console.log('Serving from cache')
        send(response, 200, cachedInfo)
      } else {
        console.log('Looking up person')
        const person = await lookupDsf(fnr)
        console.log('Looking up guardians')
        const foresatte = await getForesatte(person)
        console.log(`Finished. Got ${foresatte.length} guardians`)
        myCache.set(fnr, foresatte)
        send(response, 200, foresatte)
      }
    }
  } catch (error) {
    console.error(error)
    send(response, 400, error.message)
  }
}
