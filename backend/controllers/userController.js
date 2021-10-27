const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const bluebird = require('bluebird');
const { delay } = require('bluebird');

exports.getMain = (req, res, next) => {
    res.status(200).json({ message: "Successfully reached main page" });
};

const withBrowser = async (callback) => {
    const browser = await puppeteer.launch({});
    try {
        return await callback(browser);
    } finally {
        await browser.close();
    }
};

const withPage = async (browser, callback) => {
    const page = await browser.newPage();
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
                return [parsePrice(buyPrice), parsePrice(sellPrice)];
            });
        });
    });
};


const getBittrexDataFromUrls = async (urls) => {

    return await withBrowser(async (browser) => {
        return bluebird.map(urls, async (url) => {
            return withPage(browser, async (page) => {
                await page.goto(url);

                //wait for input to be available
                await page.waitForXPath('/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[2]/div/div/div[1]/input');
                //set crypto count to 1, then get the ask button for determining price
                const [buyCountInput] = await page.$x('/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[2]/div/div/div[1]/input');
                await buyCountInput.type('1');
                await page.waitForSelector('.tiny.price-input-toggle.comp-toggle');
                const [askButton] = await page.$x('//*[@id="td-web-root"]/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[1]/div[1]/div[2]/div/button[2]');

                const buyPrice = await bittrexPriceWaitHelper(page, askButton, '/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div/div[1]/input');
                // console.log(buyPrice);

                //dismiss tooltips as it blocks the sell button, then click the selltab button
                const [dismissTipButton] = await page.$x('/html/body/div[4]/div[2]/div/div/button[1]');
                if (dismissTipButton) await dismissTipButton.click();
                const [sellTabButton] = await page.$x('/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[1]/div[1]/div/button[2]');
                if (sellTabButton) {
                    await sellTabButton.click();
                }

                // wait for the sell input to appear, then repeat process
                await page.waitForXPath('/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[1]/div/div[1]/div');
                const [sellCountInput] = await page.$x('/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div[1]/input');
                await sellCountInput.type('1');

                const sellPrice = await bittrexPriceWaitHelper(page, askButton, '/html/body/div[1]/div/div/main/div[1]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[3]/div/div/div[1]/input');
                // console.log(sellPrice);
                // await page.screenshot({ path: 'image.png' });
                return [parsePrice(buyPrice), parsePrice(sellPrice)];

            });
        });
    });
};

const bittrexPriceWaitHelper = async (page, askButton, pathToValue) => {
    let ready = false;
    let value;
    while (!ready) {
        await askButton.click();
        value = await page.evaluate((path) => {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;
        }, pathToValue);
        ready = (value != '');
        await delay(100);
        // console.log('waiting...');
    }
    return value;
};

const parsePrice = (priceString) => {
    let result = priceString.replace('$', '');
    result = result.replace(',', '');
    let splitArr = result.split('.');
    let front = splitArr[0].split('');
    for (let i = front.length - 3; i >= 0; i = i - 3) {
        front.splice(i, 0, ',');
        i--;
    }
    splitArr[0] = front.join('');
    splitArr[1] = splitArr[1].substr(0, 2);
    console.log(splitArr[1]);
    return splitArr.join('.');
};

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
    let urls = ['https://bittrex.com/Market/Index?MarketName=USD-BTC', 'https://bittrex.com/Market/Index?MarketName=USD-ETH'];
    let bittrexData = await getBittrexDataFromUrls(urls);
    let data = {
        bitcoin: {
            buy: bittrexData[0][0],
            sell: bittrexData[0][1]
        },
        ethereum: {
            buy: bittrexData[1][0],
            sell: bittrexData[1][1]
        }
    };
    res.json(data);
};
