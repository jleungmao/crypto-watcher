import { Divider, getStepLabelUtilityClass, Stack } from '@mui/material';
import './App.css';
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

	useEffect(() => {
		const source = axios.CancelToken.source();
		const getPriceData = async () => {
			for (const site of websites) {
				axios.get(`http://localhost:8080/${site}-data`)
					.then(result => {
						let temp = { ...allPrices };
						for (const crypto of cryptos) {
							temp[crypto][site] = result.data[crypto];
						}
						setAllPrices(temp);
					})
					.catch(err => {
						console.log(err);
					});
			}
		};

		getPriceData();

		return () => {
			source.cancel();
		};
	}, []);

	useEffect(() => {
		console.log(allPrices);
	}, [allPrices]);


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
