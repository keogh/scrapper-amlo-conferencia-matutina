const axios = require('axios').default
const cheerio = require('cheerio')

const URL = 'https://presidente.gob.mx/secciones/version-estenografica/'

async function getLinks() {
  try {
    const response = await axios.get(URL)

    const $ = cheerio.load(response.data)
    return $('#main article .entry-title a')
      .map((_, elem) => $(elem).attr('href'))
      .toArray()
  } catch (error) {
    console.log('Error: ', error)
  }
}


async function init() {
  const links = await getLinks()


}

init()
