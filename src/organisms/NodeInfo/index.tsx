import React from 'react';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { GraphState, NodeType } from '../../pages/NodeGraph/state'

const NodeInfo = styled('div')`
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    color: white;
`
const BASE_URL = 'https://www.reputation.link'

const typeMap: Record<NodeType, {
    typeDesc: string,
    urlLink: string
}> = {
    [NodeType.Contract]: {
        typeDesc: 'Contract',
        urlLink: 'contracts'
    },
    [NodeType.Oracle]: {
        typeDesc: 'Oracle',
        urlLink: 'oracle'
    }
}

export default ((({ selectedNode, contractMap, oracleMap }) => {
    if (!selectedNode) return null;
    return (
        <NodeInfo>
            <Typography variant="h3">{selectedNode.name}</Typography>
            <Typography>Contract: <Link color="inherit" target="_blank" rel="noreferrer noopener" href={`${BASE_URL}/${typeMap[selectedNode.type].urlLink}/${selectedNode.address}`}>{selectedNode.address}</Link></Typography>
            <Typography>Type: {typeMap[selectedNode.type].typeDesc}</Typography>
            {
                selectedNode?.type === NodeType.Contract
                    ? <>
                        <Typography>Number of oracles: {contractMap[selectedNode.address].oracles.length}</Typography>
                    </>
                    : <>
                        <Typography>Number of served feeds: {oracleMap[selectedNode.address].feeds.length}</Typography>
                    </>

            }
        </NodeInfo>
    )

})) as React.FC<{
    selectedNode: GraphState['selectedNode'],
    contractMap: GraphState['contractMap'],
    oracleMap: GraphState['oracleMap']
}>
