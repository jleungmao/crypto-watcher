import { Button, Divider, Paper } from "@mui/material";

function MarketDisplay(props) {


    //option is equal to buying or selling
    const betterOption = (option) => {
        if (props.price !== '...' && props.isBetterOption(props.siteTitle, option) != null) {
            if (props.isBetterOption(props.siteTitle, option))
                return true;
            else
                return false;
        }
    };


    return (
        <Paper className='site-info'>
            <h2>{props.siteTitle}</h2>
            <Divider />
            <div className='price-div'>
                <label className='price-label'>Buy Price: </label>
                <span className='price-span'>{props.buy}</span>
                <Button
                    className='button'
                    variant="contained"
                    color={betterOption('buy') ? "success" : "error"}
                    href={props.getLink(props.siteTitle)}>
                    Buy
                </Button>
            </div>
            <div className='price-div'>
                <label className='price-label'>Sell Price: </label>
                <span className='price-span'>{props.sell}</span>
                <Button
                    className='button'
                    variant="contained"
                    color={betterOption('sell') ? "success" : "error"}
                    href={props.getLink(props.siteTitle)}>
                    Sell
                </Button>
            </div>
        </Paper>
    );
}

export default MarketDisplay;