const puppeteer = require('puppeteer');
const yargs = require('yargs');

async function runAutomation() {
  const { url, name, password, publisher, sheet } = yargs(process.argv.slice(2))
    .option('url', {
      describe: 'URL of the application',
      demandOption: true,
      type: 'string'
    })
    .option('name', {
      describe: 'Username',
      demandOption: true,
      type: 'string'
    })
    .option('password', {
      describe: 'Password',
      demandOption: true,
      type: 'string'
    })
    .option('publisher', {
      describe: 'Publisher name for sheet registration',
      type: 'string'
    })
    .option('sheet', {
      describe: 'Sheet name to open',
      type: 'string'
    })
    .help()
    .argv

  // Launch Puppeteer with a visible browser window
  const browser = await puppeteer.launch({
    headless: false, 
    args: ['--start-maximized']
  })
  const page = await browser.newPage()
  
  // Set the viewport to the retrieved dimensions
  await page.setViewport({
    width: 1400,
    height: 700
  })

  try {
    // Navigate to the application URL
    await page.goto(url)

    // Example: Login
    await page.waitForSelector('input[name="Username"]')

    await page.type('input[name="Username"]', name)
    await page.type('input[name="Password"]', password)
    await page.click('button[name="Login"]')

    // Wait for a delete button to show up - means spreadsheet list is loaded
    await page.waitForSelector('button[name="delete"]')

    // Example: Navigate to Dashboard (uncomment and modify as needed)
    console.log('Logged in. Navigating to Dashboard...')

    if (publisher === name) {
      // Evaluate the page to find the element with the exact text and click it
      const mySheet = await page.waitForSelector(`#${publisher}-${sheet}`)
      await mySheet.click()

    } else {
        // Else if sheet is on other sheets list 
        await page.click('button[name="otherSheets"]')
        const otherSheet = await page.waitForSelector(`#${publisher}-${sheet}`)
        await otherSheet.click()
    }

    // Keep the browser window open (comment out to close automatically)
    await new Promise(() => {})

  } catch (error) {
    console.error('Error occurred:', error)
  } finally {
    // Close the browser
    await browser.close()
  }
}

runAutomation()
