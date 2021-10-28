import { Divider, Stack } from '@mui/material';
import './styles/App.css';
import CryptoPaper from './components/CryptoPaper';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

	const [allPrices, setAllPrices] = useState({
		bitcoin: {},
		ethereum: {}
	});
	const websites = ['blockchain', 'bittrex'];
	const cryptos = ['bitcoin', 'ethereum'];

	//queries all of the prices from backend

	const getPriceData = async () => {
		for (const site of websites) {
			axios.get(`http://localhost:8080/${site}-data`)
				.then(result => {
					let temp = { ...allPrices };
					for (const crypto of cryptos) {
						temp[crypto][site] = result.data[crypto];
					}
					setAllPrices(temp);
					console.log(site);
				})
				.catch(err => {
					console.log(err);
				});
		}
	};


	useEffect(() => {
		const source = axios.CancelToken.source();
		getPriceData();
		console.log('repeating?');
		const interval = setInterval(() => {
			getPriceData();
		}, 3000);
		return () => {
			source.cancel();
			clearInterval(interval);
		};
	}, []);



	return (
		<div className="App">
			<Stack
				className='app'
				divider={<Divider flexItem />}
				spacing={2}>
				<CryptoPaper crypto='Bitcoin' prices={allPrices.bitcoin} />
				<CryptoPaper crypto='Ethereum' prices={allPrices.ethereum} />
			</Stack>
		</div>
	);
}

export default App;
