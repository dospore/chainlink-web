import React, {
    useEffect, useRef, useReducer, useMemo,
} from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { styled } from '@mui/material/styles';
import { 
    fetchOracles, 
    fetchOracleFeeds 
} from './helpers';
import {
    initialGraphState, reducer, OracleMap, ContractMap, NodeType, Network
} from './state';


// import { save as allFeeds } from './save'

import ControlModal from '../../organisms/ControlModal';
import NodeInfo from '../../organisms/NodeInfo';
import FilterIcon from '../../atoms/FilterIcon';
import NetworkMenu from '../../molecules/NetworkMenu';

const Controls = styled('div')`
  position: absolute;
  right: 2rem;
  top: 2rem;
  display: flex;
`;

export default ((() => {
    const fgRef = useRef();
    const [state, dispatch] = useReducer(reducer, initialGraphState);

    useEffect(() => {
        const getOracles = async (network: Network) => {
            let contractMap: ContractMap, oracleMap: OracleMap;
            dispatch({ type: 'resetWeb' });

            if (state.cachedMaps[network]) {
                // cache exists
                console.info(`Cached maps for network: ${network}`)
                contractMap = state.cachedMaps[network]?.contractMap as ContractMap;
                oracleMap = state.cachedMaps[network]?.oracleMap as OracleMap;
            } else {
                const oracles = await fetchOracles(network);

                // can comment this out and used allFeeds from ./save for testing
                const allFeeds = await Promise.all(oracles.map((oracle) => {
                    return(fetchOracleFeeds(state.network, oracle.oracle_address))
                }))

                contractMap = {};

                oracleMap = {};

                allFeeds.forEach((oracleFeeds, i) => {
                    oracleFeeds.forEach((feed) => {
                        if (!contractMap[feed.contract_address]) {
                            contractMap[feed.contract_address] = {
                                oracles: [],
                                name: feed.contract_name,
                                address: feed.contract_address,
                            };
                        }
                        if (!oracleMap[oracles[i].oracle_address]) {
                            oracleMap[oracles[i].oracle_address] = {
                                feeds: [],
                                name: oracles[i].name,
                                address: oracles[i].oracle_address,
                            };
                        }
                        contractMap[feed.contract_address].oracles.push(oracles[i]);
                        oracleMap[oracles[i].oracle_address].feeds.push(feed);
                    });
                });
                dispatch({ type: 'addToCache', network: network, contractMap, oracleMap });
            }
            if (network === state.network) {
                dispatch({ type: 'setNodesAndLink', contractMap, oracleMap });
                dispatch({ type: 'selectAll', nodeType: NodeType.Oracle, options: Object.keys(oracleMap) });
                dispatch({ type: 'selectAll', nodeType: NodeType.Contract, options: Object.keys(contractMap) });
            }

        };

        getOracles(state.network.toString() as Network);
    }, [state.network]);

    const filteredLinks = useMemo(() => (
        // the source will always be an oracle and the target is always a contract
        state.links
            .filter((link) => (state.selectedOracles.includes((link.source as any).id) && state.selectedContracts.includes((link.target as any).id)
          || state.selectedOracles.includes(link.source) && state.selectedContracts.includes(link.target)))
    ), [state.links, state.selectedOracles, state.selectedContracts])

    const filteredNodes = useMemo(() => (
        state.nodes.filter((node) => state.selectedOracles.includes(node.id) || state.selectedContracts.includes(node.id))
    ), [state.nodes, state.links, state.selectedOracles, state.selectedContracts]);


    const highlightLinks = useMemo(() => {
        const highlighted = new Set();
        filteredLinks.map((link) => {
            if (state.selectedNode?.type === NodeType.Oracle) {
                if (state.selectedNode?.address === link.source) {
                    highlighted.add(`${link.source}-${link.target}`)
                } else if (state.selectedNode?.address === (link.source as any)?.id) {
                    highlighted.add(`${(link.source as any)?.id}-${(link.target as any)?.id}`)
                }
            } else if (state.selectedNode?.type === NodeType.Contract) {
                if (state.selectedNode?.address === link.target) {
                    highlighted.add(`${link.source}-${link.target}`)
                } else if (state.selectedNode?.address === (link.target as any)?.id) {
                    highlighted.add(`${(link.source as any)?.id}-${(link.target as any)?.id}`)
                }
            } 
        })
        return highlighted;
    }, [filteredLinks, state.selectedNode])

    return (
        <>
            <ForceGraph3D
                ref={fgRef}
                graphData={{
                    links: filteredLinks,
                    nodes: filteredNodes
                }}
                linkOpacity={0.3}
                linkWidth={(link) => highlightLinks.has(`${(link.source as any)?.id}-${(link.target as any)?.id}`) ? 0.5 : 0}
                linkColor={(link) => highlightLinks.has(`${(link.source as any)?.id}-${(link.target as any)?.id}`) ? '#EFB33D' : 'white'}
                linkDirectionalParticles={(link) => highlightLinks.has(`${(link.source as any)?.id}-${(link.target as any)?.id}`) ? 2 : 0}
                linkDirectionalParticleWidth={1}
                onNodeClick={(node) => { 
                    dispatch({ type: 'setSelectedNode', node: node?.id?.toString() })
                }}
            />
            <NodeInfo
                selectedNode={state.selectedNode}
                oracleMap={state.oracleMap}
                contractMap={state.contractMap}
            />
            <Controls>
                <NetworkMenu 
                    network={state.network}
                    networkOptions={Object.values(Network)}
                    setNetwork={(network) => {
                        dispatch({ type: 'setNetwork', network: network })
                    }}
                />
                <FilterIcon onClick={() => dispatch({ type: 'setControlsModal', open: true })} />
            </Controls>
            <ControlModal
                open={state.controlsModalOpen}
                handleClose={() => dispatch({ type: 'setControlsModal', open: false })}
                state={state}
                dispatch={dispatch}
            />
        </>
    );
})) as React.FC;
