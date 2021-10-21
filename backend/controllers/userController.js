const axios = require('axios').default;
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

exports.getMain = (req, res, next) => {
    res.status(200).json({ message: "Successfully reached main page" });
};

const getBlockchainDataFromUrl = async (url) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.sc-cnyqQT.dygrPn');

    //set the number of BTC to 1 for prices to show buy price
    await page.type('.sc-cnyqQT.dygrPn', "1");
    await page.waitForSelector('.sc-1ryi78w-0.meihw.sc-jSFkmK.lrNMr');

    let pageData = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });
    let $ = cheerio.load(pageData);
    const buyPrice = $('.sc-1ryi78w-0.meihw.sc-jSFkmK.lrNMr').text();
    console.log(buyPrice);

    //click to the sell to get the sell price
    await page.click('[data-e2e="sellSwitch"]');

    //scrape the new html
    pageData = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });
    $ = cheerio.load(pageData);
    const sellPrice = $('.sc-1ryi78w-0.meihw.sc-jSFkmK.lrNMr').text();
    console.log(sellPrice);

    await page.screenshot({ path: 'image.png' });
    // console.log($.html());
    // fs.writeFile('data.html', $.html(), () => {
    // });
    await browser.close();
    return [buyPrice, sellPrice];
};




exports.getBitcoinData = async (req, res, next) => {
    let blockchainBtcData = await getBlockchainDataFromUrl('https://exchange.blockchain.com/trade/BTC-USD');
    let blockchainEthData = await getBlockchainDataFromUrl('https://exchange.blockchain.com/trade/ETH-USD');
    res.json({
        blockchainBtc: blockchainBtcData,
        blockchainEth: blockchainEthData
    });
};