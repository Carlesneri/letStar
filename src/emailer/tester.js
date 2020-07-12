const puppeteer = require('puppeteer')

const urlTemplate = "https://www.google.com/search?q=juguetes+lego"

async function emailer(){
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: {
            width: 800,
            height: 1200
        },
        args: ['--no-sandbox']
    })
    let page = await browser.newPage()
    try{
        const urlPage = `${urlTemplate}`

        await page.goto(urlPage, { waitUntil: 'networkidle0'})

        const results = await page.$$eval('.r > a', arr => arr.map(el => el.getAttribute('href')))
        
        console.log('Results: ', results)
        
        let nthSiguiente = null
       
        const spanInnerText = await page.$$eval('span', arr => arr.map(el => el.innerText))
        

        spanInnerText.forEach((el, i) => {
            if(el === 'Siguiente') nthSiguiente = i
        })
        
        console.log(nthSiguiente)

        const siguienteSelector = `span:nth-of-type(${nthSiguiente})`

        await page.click(`span:nth-of-type(${nthSiguiente})`)

        // for(let n = 0; n < results.length; n++){
        //     try{     
        //         const numResult = Number(n + 1)       
        //         console.log(`Result ${numResult} of ${results.length}`)
        //         await page.click(`.result-card:nth-of-type(${numResult})`)
        //         await page.waitFor(WAIT_FOR)   
        //         const pages = await browser.pages()
        //         page = pages[2]
        //         await page.waitFor(WAIT_FOR)   
        //         const email = await getEmail(page)
        //         if(email !== ''){
        //             await sendEmail(email)
        //         }else{
        //             console.log('No mail found')
        //         }

        //         await page.close()   
        //         page = pages[1]
        //         await page.waitFor(WAIT_FOR)   
                
        //     }catch(err){
        //         console.error(`Error in ${urlPage}`)                
        //     }
        // }
                
    }catch(err){
        console.error(err)                
    }
    // await browser.close()
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




emailer()