const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const sendEmail = require('./sendEmail')

const ejsFile = fs.readFileSync(path.join(__dirname, '/nodemailer-template-styled.html'), {
    encoding: 'utf8',
    flag: 'r'
})

const urlTemplate = "https://www.tripadvisor.es/Search?searchSessionId=918080052CEB038FB3E1D272A826B34C1593775472935ssid&searchNearby=&sid=D82CC312BAAE201FDA0D300696B446E91593775483563&ssrc=e"

const MAX_PAGES = 34

const WAIT_FOR = 0 // 1000

const queries = ['el', 'the', 'in', 'of', 'my', 'is', 'at', 'us', 'go', 'hu', 'fu']

const usedEmails = []

async function emailer(){
    for(let numPage = 0; numPage < MAX_PAGES; numPage++){
        console.log('Page: ', numPage)        
        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: {
                width: 800,
                height: 1200
            },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        let page = await browser.newPage()
        try{
            const pageResult = numPage * 30
            const urlPage = `${urlTemplate}&q=${queries[queries.length - 1]}&o=${pageResult}`
            await page.goto(urlPage, { waitUntil: 'load', timeout: 100000})

            // await page.waitFor(WAIT_FOR)   
            await page.waitForSelector('.result-card')   

            const results = await page.$$('.result-card')
            console.log('Results: ', results.length)

            let pages
            
            for(let n = 0; n < results.length; n++){
                try{     
                    const numResult = Number(n + 1)   
                    console.log(`Result ${numResult} of ${results.length}`)

                    //--> VERIFICAMOS RESULT VÁLIDO
                    if((numResult === 1 || (numResult - 1) % 6 !== 0) && numResult !== 4){
                        // console.log(await page.title())
                        await page.waitForSelector(`.result-card:nth-of-type(${numResult})`)   
                        await page.click(`.result-card:nth-of-type(${numResult})`)
                        await page.waitFor(2100)   
                        pages = await browser.pages()
                        page = pages[2]
                        // console.log(await page.title())
                        // await page.waitFor(WAIT_FOR)   
                        const emailReceiver = await getEmail(page)
                        // console.log(emailReceiver)
                        
                        if(emailReceiver !== ''){
                            const emailReceiverIndex = usedEmails.findIndex(el => el === emailReceiver)
                            // console.log(emailReceiverIndex)

                            if(emailReceiverIndex < 0){
                                await sendEmail(ejsFile, emailReceiver)
                                usedEmails.push(emailReceiver)
                                
                            }else{
                                console.log('Used email')
                            }
                            
                        }else{
                            console.log('No mail found')
                        }
        
                        await page.close()   
                        pages = await browser.pages()
                        page = pages[1]
                        // await page.waitFor(WAIT_FOR)   
                    }else{
                        console.log('No valid selector')
                    }
                    
                }catch(err){
                    console.error(err)     
                    pages = await browser.pages()
                    page = pages[1]          
                    // await page.waitFor(WAIT_FOR)   
                }
            }
                    
        }catch(err){
            console.error(err)                
        }
        await browser.close()
    }
}

async function getEmail(page){
    let email = ''
    try{
        await page.waitForSelector('a')

        const hrefs = await page.$$eval('a', arr => arr.map(el => el.getAttribute('href')))
        
        if(hrefs.length > 0){
            for(let i = 0; i < hrefs.length; i++){

                if(hrefs[i] && hrefs[i].includes('mailto:')){
                    email = hrefs[i]
                    email = email.replace('mailto:', '')
                    if(email.includes('?subject=?')) email = email.replace('?subject=?', '')

                }
            }            
        }       
        
    }catch(err){
        console.error(err)        
    }
    return email
}

emailer()