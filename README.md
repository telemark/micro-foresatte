[![Build Status](https://travis-ci.com/telemark/micro-foresatte.svg?branch=master)](https://travis-ci.com/telemark/micro-foresatte)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# micro-foresatte

Get guardians for a person

## API

All calls must supply a valid jwt

### ```GET /foresatte/:fnr```

**fnr** Official Norwegian personal id-number

### ```POST /foresatte

```JavaScript
{
  fnr: '<Official Norwegian personal id-number>'
}
```

### Returns

```JavaScript
[
  {
    fødselsnummer: '18117139876',
    fødselsdato: '1971-11-18',
    navn: 'Gandalf Grå',
    fornavn: 'Gandalf',
    mellomnavn: '',
    etternavn: 'Grå',
    adresselinje: 'Konglevegen 24',
    postnummer: '1732',
    poststed: 'Høtten',
    epostadresse: 'gandis@wizmail.com',
    mobiltelefonnummer: '39779339'
  },
  {
    fødselsnummer: '04067639876',
    fødselsdato: '1976-06-04',
    navn: 'Gunhild Georgina Grå',
    fornavn: 'Gunhild',
    mellomnavn: 'Georgina',
    etternavn: 'Grå',
    adresselinje: 'Konglevegen 24',
    postnummer: '1732',
    poststed: 'Høtten',
    epostadresse: 'geogun@wizmail.com',
    mobiltelefonnummer: '97397397'
  }
]
```

## Related

- [micro-dsf2](https://github.com/telemark/micro-dsf2) microservice for dsf
- [micro-kor](https://github.com/telemark/micro-kor) microservice for kontakt- og reservasjonsregisteret

## License

[MIT](LICENSE)