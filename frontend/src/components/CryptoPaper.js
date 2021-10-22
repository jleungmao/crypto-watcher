import { Paper, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import './styles/CryptoPaper.css';
import axios from "axios";

function CryptoPaper(props) {

    const [blockchainPrices, setBlockchainPrices] = useState([]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        let crypto = props.crypto.toLowerCase();
        console.log(crypto);
        const getBlockchainPrices = async () => {
            axios.get(`http://localhost:8080/${crypto}-data`)
                .then(result => {
                    console.log(result.data);
                    setBlockchainPrices(result.data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getBlockchainPrices();

        return () => {
            source.cancel();
        };
    }, []);


    return (
        <Paper
            className='section'
            elevation={3}>
            <h1>{props.crypto}</h1>
            <div className='contents'>
                <Paper className='site-info'>
                    <h2>Blockchain.com</h2>
                    <div>
                        <label>Buy Price:</label>
                        {blockchainPrices[0]}
                    </div>
                    <div>
                        <label>Sell Price:</label>
                        {blockchainPrices[1]}
                    </div>
                </Paper>

                <Stack className='recommendations'>
                    <IconButton aria-label="" disabled={true}>
                    </IconButton>
                    <IconButton aria-label="" disabled={true}>
                    </IconButton>
                </Stack>

                <Paper className='site-info'>
                    <h2>OtherSite.com</h2>
                    <label>Buy:</label>
                    <label>Sell:</label>
                </Paper>
            </div>
        </Paper>
    );
}

export default CryptoPaper;