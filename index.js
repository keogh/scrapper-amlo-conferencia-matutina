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

async function createFile(link, header, content) {
  try {

  } catch (error) {

  }
}

async function processLink(link = '') {
  try {
    const response = await axios.get(link)

    const $ = cheerio.load(response.data)
    
    const entryHeader = $('#main .post .entry-header .entry-title').text()

    const $content = $('#main .post .entry-content')
    $content.find('[style="text-align: right;"]').remove()
    const entryContent = $content.text()

    await createFile(link, entryHeader, entryContent)
  } catch (error) {
    console.log(`Error with link ${link}: `, error)
  }
}

function processLinks(links = []) {
  links.map(processLink)
}

async function init() {
  const links = await getLinks()

  // console.log(links)

  // processLink(links[0])
  processLinks(links)
}

init()
