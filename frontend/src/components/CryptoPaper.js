import { Divider, Paper } from "@mui/material";
import '../styles/CryptoPaper.css';
import MarketDisplay from "./MarketDisplay";

function CryptoPaper(props) {

    const allInfoExists = () => {
        if (props?.prices?.blockchain?.buy && props?.prices?.bittrex?.buy
            && props?.prices?.blockchain?.sell && props?.prices?.bittrex?.sell) {
            return true;
        }
        return false;
    };
    //find if this site is better depending on the operation you are trying to perform
    const isBetterOption = (site, operation) => {
        if (allInfoExists()) {
            switch (site) {
                case 'Blockchain.com':
                    if (operation === 'buy')
                        return props.prices.blockchain.buy < props.prices.bittrex.buy;
                    else
                        return props.prices.blockchain.sell > props.prices.bittrex.sell;
                case 'Bittrex.com':
                    if (operation === 'buy')
                        return props.prices.blockchain.buy > props.prices.bittrex.buy;
                    else
                        return props.prices.blockchain.sell < props.prices.bittrex.sell;
                default:
                    return null;
            }
        }
        return null;
    };

    const getLink = (site) => {
        const links = {
            blockchainBtc: 'https://exchange.blockchain.com/trade/BTC-USD',
            blockchainEth: 'https://exchange.blockchain.com/trade/ETH-USD',
            bittrexBtc: 'https://bittrex.com/Market/Index?MarketName=USD-BTC',
            bittrexEth: 'https://bittrex.com/Market/Index?MarketName=USD-ETH'
        };

        switch (site) {
            case 'Blockchain.com':
                if (props.crypto === 'Bitcoin') {
                    return links.blockchainBtc;
                } else {
                    return links.blockchainEth;
                }
            case 'Bittrex.com':
                if (props.crypto === 'Ethereum') {
                    return links.bittrexEth;
                } else {
                    return links.bittrexBtc;
                }
            default:
                return;
        }
    };

    return (
        <Paper
            key={props.prices}
            className='section'
            elevation={3}>
            <h1>{props.crypto}</h1>
            <div className='contents'>
                <MarketDisplay
                    siteTitle='Blockchain.com'
                    buy={props.prices && props.prices.blockchain ? props.prices.blockchain.buy : '...'}
                    sell={props.prices && props.prices.blockchain ? props.prices.blockchain.sell : '...'}
                    isBetterOption={isBetterOption}
                    getLink={getLink}
                />
                <MarketDisplay
                    siteTitle='Bittrex.com'
                    buy={props.prices && props.prices.bittrex ? props.prices.bittrex.buy : '...'}
                    sell={props.prices && props.prices.bittrex ? props.prices.bittrex.sell : '...'}
                    isBetterOption={isBetterOption}
                    getLink={getLink}
                />
            </div>
        </Paper>
    );
}

export default CryptoPaper;