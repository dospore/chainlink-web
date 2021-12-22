export type Oracle = {
    oracle_address: string;
    name: string;
    type: ContractType;
}

export type Feed = {
    type: ContractType;
    contract_address: string;
    submission_count: string;
    contract_name: string;
}

export type ContractType = 'flux' | 'ocr';

export enum Network {
  Mainnet = 'Eth_Mainnet',
  BSC = 'BSC',
  Polygon = 'Polygon',
  // Arbitrum = 'Arbitrum'
}

// NodeType
export enum NodeType {
    Oracle = 1,
    Contract = 2
}

// NodeType used for easly accessing
export const SelectedNodeType: Record<NodeType, 'selectedOracles' | 'selectedContracts'> = {
    [NodeType.Oracle]: 'selectedOracles',
    [NodeType.Contract]: 'selectedContracts'
}

type Node = {
  id: string
}

type Link = {
  source: string
  target: string
}

export type OracleMap = Record<string, {
    feeds: Feed[],
    name: string,
    address: string
}>

export type ContractMap = Record<string, {
    oracles: Oracle[],
    address: string
    name: string
}>

export type GraphState = {
  network: Network
  nodes: Node[],
  links: Link[],
  cachedMaps: Partial<Record<Network, {
      contractMap: ContractMap,
      oracleMap: OracleMap
  }>>,
  selectedOracles: string[],
  selectedContracts: string[],
  selectedNode: {
      name: string;
      address: string,
      type: NodeType
  } | undefined,
  contractMap: ContractMap,
  oracleMap: OracleMap,
  controlsModalOpen: boolean
};

export const initialGraphState: GraphState = {
    network: Network.Mainnet,
    nodes: [],
    links: [],
    cachedMaps: {},
    selectedOracles: [],
    selectedContracts: [],
    contractMap: {},
    oracleMap: {},
    selectedNode: undefined,
    controlsModalOpen: false,
};

export type GraphAction =
    | { type: 'resetWeb' }
    | { type: 'setNetwork', network: Network }
    | { type: 'setControlsModal', open: boolean }
    | { type: 'addToCache', network: Network, contractMap: ContractMap, oracleMap: OracleMap }
    | { type: 'selectAll', nodeType: NodeType, options: string[] }
    | { type: 'unSelectAll', nodeType: NodeType }
    | { type: 'setSelectedNode', node: string | undefined }
    | { type: 'toggleCheckedOracle', id: string }
    | { type: 'toggleCheckedContract', id: string }
    | {
        type: 'setNodesAndLink',
        contractMap: ContractMap,
        oracleMap: OracleMap
      }

const toggleItem: (array: string[], item: string) => string[] = (array, item) => {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    } else {
        array.push(item);
    }
    return array;
};

export const reducer: (state: GraphState, action: GraphAction) => GraphState = (state, action) => {
    let node;
    switch (action.type) {
    case 'resetWeb':
        return {
            ...state,
            selectedNode: undefined
        };
    case 'setNetwork':
        return {
            ...state,
            network: action.network,
        };
    case 'setControlsModal':
        return {
            ...state,
            controlsModalOpen: action.open,
        };
    case 'selectAll':
        return {
            ...state,
            [SelectedNodeType[action.nodeType]]: action.options,
        };
    case 'unSelectAll':
        return {
            ...state,
            [SelectedNodeType[action.nodeType]]: [],
        };
    case 'toggleCheckedOracle':
        return {
            ...state,
            selectedOracles: [...toggleItem(state.selectedOracles, action.id)],
        };
    case 'addToCache':
        return {
            ...state,
            cachedMaps: {
                ...state.cachedMaps,
                [action.network]: {
                    contractMap: action.contractMap,
                    oracleMap: action.oracleMap,
                }
            }
        };
    case 'toggleCheckedContract':
        return {
            ...state,
            selectedContracts: [...toggleItem(state.selectedContracts, action.id)],
        };
    case 'setSelectedNode':
        if (!action.node) return state
        if (state.contractMap[action.node]) {
            node = state.contractMap[action.node];
            return {
                ...state,
                selectedNode: {
                    address: node.address,
                    name: node.name,
                    type: NodeType.Contract
                },
            };
        } else if (state.oracleMap[action.node]) {
            node = state.oracleMap[action.node];
            return {
                ...state,
                selectedNode: {
                    address: node.address,
                    name: node.name,
                    type: NodeType.Oracle
                },
            };
        } // else
        return state;
    case 'setNodesAndLink':
        const contracts = Object.keys(action.contractMap).map((contract) => ({
            id: contract,
            name: action.contractMap[contract].name,
            color: '#151414'
        }));
        const oracles = Object.values(action.oracleMap).map((oracle) => ({
            id: oracle.address,
            name: oracle.name,
            color: '#EFB33D',
        }));
        const links: Link[] = [];
        Object.keys(action.contractMap).forEach((contract) => {
            action.contractMap[contract].oracles.forEach((oracleFeed) => {
                links.push({
                    source: oracleFeed.oracle_address,
                    target: contract,
                });
            });
        });
        return {
            ...state,
            nodes: oracles.concat(contracts),
            links,
            contractMap: action.contractMap,
            oracleMap: action.oracleMap,
        };
    default:
        throw new Error('Unexpected action');
    }
};
