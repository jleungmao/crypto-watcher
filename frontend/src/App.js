import { Divider, Stack } from '@mui/material';
import './App.css';
import CryptoPaper from './components/CryptoPaper';

function App() {

	return (
		<div className="App">
			<Stack
				className='app'
				divider={<Divider flexItem />}
				spacing={2}>
				<CryptoPaper crypto='Bitcoin' />
				<CryptoPaper crypto='Ethereum' />
			</Stack>
		</div>
	);
}

export default App;
