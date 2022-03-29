const axios = require('axios').default
const cheerio = require('cheerio')
const fs = require('fs').promises

const BASE_URL = 'https://presidente.gob.mx/secciones/version-estenografica/'

async function getLinks() {
  // TODO: Find a better way to find the last page
  // TODO: Access denied is thrown when try to scrape all pages, I need to find a better way to handle this
  const lastPage = 95
  const startPage = 1
  let allLinks = []

  for (let currentPage = startPage; currentPage <= lastPage; currentPage++) {
    const url = currentPage > 1 ? `${BASE_URL}page/${currentPage}/` : BASE_URL
    console.log('Geting links in page: ', currentPage)
    try {
      const response = await axios.get(url)
      const $ = cheerio.load(response.data)
      const links = $('#main article .entry-title a')
        .map((_, elem) => $(elem).attr('href'))
        .toArray()

      allLinks = [...allLinks, ...links]
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return allLinks;
}

async function createFile(link, header, content) {
  // example link: https://presidente.gob.mx/28-03-22-version-estenografica-de-la-conferencia-de-prensa-matutina-del-presidente-andres-manuel-lopez-obrador
  const filename = link.replace(/\/$/, '').split('/').pop()
  const extension = 'txt'
  const basePath = './data'

  // TODO: Check the header for the date instead of the url
  const match = filename.match(/^\d{2}-\d{2}-\d{2}/)
  if (match === null) {
    console.log(`cannot find date in filename: ${filename}`)
    return
  }

  const [ _, month, year ] = filename.split('-')
  const path = `${basePath}/20${year}/${month}`

  const fullPathName = `${path}/${filename}.${extension}`
  const fullContent = `${header}\n${content}`
  try {
    await fs.mkdir(path, { recursive: true })
    await fs.writeFile(fullPathName, fullContent, { flag: 'wx' })
  } catch (error) {
    console.log('Error: ', error)
  }
}

async function processLink(link = '') {
  console.log('Processing link: ', link)
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

  console.log(links)
  console.log('Links length: ', links.length)

  processLinks(links)
}

init()
