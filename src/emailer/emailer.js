const puppeteer = require('puppeteer')
// const fs = require('fs')
// const path = require('path')

const sendEmail = require('./sendEmail')

const urlTemplate = "https://www.tripadvisor.es/Search?searchSessionId=918080052CEB038FB3E1D272A826B34C1593775472935ssid&searchNearby=&geo=1&sid=D82CC312BAAE201FDA0D300696B446E91593775483563&blockRedirect=true&ssrc=e&rf=5"

const MAX_PAGES = 33

const WAIT_FOR = 4000

const queries = ['el', 'the', 'in']

async function emailer(){
    for(let numPage = 8; numPage < 9; numPage++){
        console.log('Page: ', numPage)        
        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: {
                width: 800,
                height: 1200
            },
            args: ['--no-sandbox']
        })
        let page = await browser.newPage()
        try{
            const pageResult = numPage * 30
            const urlPage = `${urlTemplate}&q=${queries[queries.length - 1]}&o=${pageResult}`
            await page.goto(urlPage, { waitUntil: 'networkidle0'})

            const results = await page.$$('.result-card')
            console.log('Results: ', results.length)
            
            for(let n = 0; n < results.length; n++){
                try{     
                    const numResult = Number(n + 1)       
                    console.log(`Result ${numResult} of ${results.length}`)
                    await page.click(`.result-card:nth-of-type(${numResult})`)
                    await page.waitFor(WAIT_FOR)   
                    const pages = await browser.pages()
                    page = pages[2]
                    await page.waitFor(WAIT_FOR)   
                    const email = await getEmail(page)
                    if(email !== ''){
                        await sendEmail(email)
                    }else{
                        console.log('No mail found')
                    }
    
                    await page.close()   
                    page = pages[1]
                    await page.waitFor(WAIT_FOR)   
                    
                }catch(err){
                    console.error(`Error in ${urlPage}`)                
                }
            }
                    
        }catch(err){
            console.error(err)                
        }
        await browser.close()
    }
}

async function getEmail(page){
    try{
        const hrefs = await page.$$eval('a', arr => arr.map(el => el.getAttribute('href')))
        
        let email = ''
        if(hrefs.length > 0){
            for(let i = 0; i < hrefs.length; i++){
                if (hrefs[i] && hrefs[i].includes('mailto:')) email = hrefs[i].replace('mailto:', '').replace('?subject=?', '')
            }
            
        }       
        return email
        
    }catch(err){
        console.error(`Error in ${url}: ${err}`)        
    }
}


// function writeInFile(filename, data){
//     const newData = data + '\n'
//     fs.appendFile(path.join(__dirname, `${filename}.txt`), newData, err => {
//         if (err) return console.error(err)
//     })
// }

// async function getRestUrls(page, browser){
//     try{
//         const urls = []
//         const results = await page.$$('.result-card')
//         console.log('Results: ', results.length)
        
//         for(let n = 0; n < results.length; n++){
//             try{     
//                 const numResult = Number(n + 1)       
//                 console.log(`Result ${numResult} of ${results.length}`)
//                 await page.click(`.result-card:nth-of-type(${numResult})`)
//                 await page.waitFor(WAIT_FOR)   
//                 const pages = await browser.pages()
//                 page = await pages[2]
//                 await page.waitFor(WAIT_FOR)   
//                 const email = await getEmail(page)
//                 if(email){
//                     writeInFile(queries[queries.length - 1], email)
//                 }

//                 await page.close()   
//                 page = await pages[1]
//                 await page.waitFor(WAIT_FOR)   
                
//             }catch(err){
//                 console.error(err.Error)                
//             }
//         }
//         return urls

//     }catch(err){
//         console.error(err)        
//     }
// }


emailer()