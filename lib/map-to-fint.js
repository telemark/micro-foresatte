module.exports = data => {
  return {
    fødselsnummer: data.personalIdNumber || '',
    fødselsdato: data.birthDate || '',
    navn: data.fullName || '',
    fornavn: data.firstName || '',
    mellomnavn: data.middleName || '',
    etternavn: data.lastName || '',
    adresselinje: data.address || '',
    postnummer: data.zip || '',
    poststed: data.city || '',
    epostadresse: data.epostadresse || '',
    mobiltelefonnummer: data.mobiltelefonnummer || ''
  }
}
