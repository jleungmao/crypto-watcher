import { Paper, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import './styles/CryptoPaper.css';

function CryptoPaper(props) {


    return (
        <Paper
            key={props.prices}
            className='section'
            elevation={3}>
            <h1>{props.crypto}</h1>
            <div className='contents'>
                <Paper className='site-info'>
                    <h2>Blockchain.com</h2>
                    <div>
                        <label>Buy Price:</label>
                        {props.prices && props.prices.blockchain ? props.prices.blockchain.buy : '...'}
                    </div>
                    <div>
                        <label>Sell Price:</label>
                        {props.prices && props.prices.blockchain ? props.prices.blockchain.buy : '...'}
                    </div>
                </Paper>

                <Stack className='recommendations'>
                    <IconButton aria-label="" disabled={true}>
                    </IconButton>
                    <IconButton aria-label="" disabled={true}>
                    </IconButton>
                </Stack>

                <Paper className='site-info'>
                    <h2>Bittrex.com</h2>
                    <div>
                        <label>Buy Price:</label>
                        {props.prices && props.prices.bittrex ? props.prices.bittrex.buy : '...'}
                    </div>
                    <div>
                        <label>Sell Price:</label>
                        {props.prices && props.prices.bittrex ? props.prices.bittrex.sell : '...'}
                    </div>
                </Paper>
            </div>
        </Paper>
    );
}

export default CryptoPaper;