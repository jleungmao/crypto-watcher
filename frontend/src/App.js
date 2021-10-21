import { Divider, Paper, Stack } from '@mui/material';

function App() {
	return (
		<div className="App">
			<Stack

				divider={<Divider flexItem />}
				spacing={2}>
				<Paper></Paper>
			</Stack>
		</div>
	);
}

export default App;
