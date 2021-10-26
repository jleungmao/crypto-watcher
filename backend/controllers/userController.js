const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const bluebird = require('bluebird');
const fs = require('fs');

exports.getMain = (req, res, next) => {
    res.status(200).json({ message: "Successfully reached main page" });
};

const withBrowser = async (callback) => {
    const browser = await puppeteer.launch();
    try {
        return await callback(browser);
    } finally {
        await browser.close();
    }
};

const withPage = async (browser, callback) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1000 });
    try {
        return await callback(page);
    } finally {
        await page.close();
    }
};

const getBlockchainDataFromUrls = async (urls) => {
    return await withBrowser(async (browser) => {
        return bluebird.map(urls, async (url) => {
            return withPage(browser, async (page) => {
                await page.goto(url);

                //wait for input to be available
                await page.waitForSelector('.sc-cnyqQT.dygrPn');

                //set the crypto count to 1 and scrape prices
                await page.type('.sc-cnyqQT.dygrPn', "1");
                await page.waitForSelector('.sc-1ryi78w-0.meihw.sc-jSFkmK.lrNMr');
                let pageData = await page.evaluate(() => {
                    return document.documentElement.innerHTML;
                });
                let $ = cheerio.load(pageData);
                const buyPrice = $('.sc-1ryi78w-0.meihw.sc-jSFkmK.lrNMr').text();
                // console.log(buyPrice);

                //click to the sell to get the sell price
                await page.click('[data-e2e="sellSwitch"]');

                //scrape the new html
                pageData = await page.evaluate(() => {
                    return document.documentElement.innerHTML;
                });
                $ = cheerio.load(pageData);
                const sellPrice = $('.sc-1ryi78w-0.meihw.sc-jSFkmK.lrNMr').text();
                // console.log(sellPrice);
                return [buyPrice, sellPrice];
            });
        });
    });
};


const getBittrexDataFromUrls = async (urls) => {
    return '';
};
//old code 


// console.log($.html());
// fs.writeFile('data.html', $.html(), () => {
// });

exports.getBlockchainData = async (req, res, next) => {
    const urls = ['https://exchange.blockchain.com/trade/BTC-USD', 'https://exchange.blockchain.com/trade/ETH-USD'];
    let blockchainData = await getBlockchainDataFromUrls(urls);
    let data = {
        bitcoin: {
            buy: blockchainData[0][0],
            sell: blockchainData[0][1]
        },
        ethereum: {
            buy: blockchainData[1][0],
            sell: blockchainData[1][1]
        }
    };
    res.json(data);
};

exports.getBittrexData = async (req, res, next) => {
    let urls = ['https://bittrex.com/Market/Index?MarketName=USD-BTC'];
    let bittrexData = await getBittrexDataFromUrls(urls);
    res.json(bittrexData);
};
