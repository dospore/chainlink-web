import { Network, Oracle, Feed } from './state';

const BASE_URL = 'https://api.dev.reputation.link';

export const fetchOracles: (network: Network) => Promise<Oracle[]> = (network) => (
    fetch(`${BASE_URL}/oracle/all?source=${network}`)
        .then((res) => res.json())
        .then((oracles) => {
            return oracles;
        }).catch((error) => {
            console.error('Failed to fetch oracles', error);
            throw Error(`Failed to fetch oracles ${error?.message ?? error}`);
        })
);

export const fetchOracleFeeds: (network: Network, oracle: string) => Promise<Feed[]> = (network, oracle) => (
    fetch(`${BASE_URL}/oracle/${oracle}/feeds?time=monthly&source=${network}`)
        .then((res) => res.json())
        .then((feeds) => {
            return feeds;
        }).catch((error) => {
            console.error('Failed to fetch oracle feeds', error);
            throw Error(`Failed to fetch oracle feeds${error?.message ?? error}`);
        })
);
