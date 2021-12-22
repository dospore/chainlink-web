import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '../../atoms/Button';
import { styled } from '@mui/material';
import { Network } from '../../pages/NodeGraph/state';

const networkNames: Record<Network, string> = {
    [Network.BSC]: 'Binance',
    [Network.Arbitrum]: 'Arbitrum',
    [Network.Mainnet]: 'Eth Mainnet',
    [Network.Polygon]: 'Polygon'
}

const ButtonContainer = styled('div')`
    margin-right: 0.5rem;
`

export default ((({ network, networkOptions, setNetwork }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ButtonContainer>
            <Button
                id="network-button"
                aria-controls="network-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {networkNames[network]}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'network-button',
                }}
            >
                {
                    networkOptions.map((network) => (
                        <MenuItem key={network} onClick={() => { setNetwork(network); handleClose() }}>{networkNames[network]}</MenuItem>
                    ))
                }
            </Menu>
        </ButtonContainer>
    )

})) as React.FC<{
    network: Network,
    networkOptions: Network[]
    setNetwork: (network: Network) => void
}>
