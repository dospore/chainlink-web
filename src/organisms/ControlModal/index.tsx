import React, { useState, useMemo } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { styled } from '@mui/material';
import TabPanel from '../../atoms/TabPanel';
import Control from '../../molecules/Control';
import { GraphAction, GraphState, NodeType } from '../../pages/NodeGraph/state';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ModalBox = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400;
    border: none;
    outline: none;
    border-radius: 10px;
    background: white;
    padding: 0.5rem;
`;

const ControlsBox = styled(Box)`
    max-height: 600px;
    overflow-y: auto;
`;

export default ((({
    open, handleClose, state, dispatch,
}) => {
    const [value, setValue] = useState(0);

    const handleChange = (_event: any, newValue: number) => {
        setValue(newValue);
    };

    const oracleOptions = useMemo(() => (
        Object.values(state.oracleMap).map((oracle) => ({
            id: oracle.address,
            label: oracle.name,
            checked: state.selectedOracles.includes(oracle.address),
        }))), [state.selectedOracles, state.oracleMap]);

    const allOraclesSelected: boolean = useMemo(() => state.selectedOracles.length === Object.keys(state.oracleMap).length, [state.selectedOracles, state.oracleMap]);

    const contractOptions = useMemo(() => (
        Object.values(state.contractMap).map((contract) => ({
            id: contract.address,
            label: contract.name,
            checked: state.selectedContracts.includes(contract.address),
        }))), [state.selectedContracts, state.contractMap]);

    const allContractsSelected: boolean = useMemo(() => state.selectedContracts.length === Object.keys(state.contractMap).length, [state.selectedContracts, state.contractMap]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalBox>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Oracles" {...a11yProps(0)} />
                        <Tab label="Contracts" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ControlsBox>
                        <Control
                            selectAll={() => dispatch({ type: 'selectAll', nodeType: NodeType.Oracle, options: Object.keys(state.oracleMap) })}
                            unSelectAll={() => dispatch({ type: 'unSelectAll', nodeType: NodeType.Oracle })}
                            allSelected={allOraclesSelected}
                            options={oracleOptions}
                            handleOnChange={(id) => dispatch({ type: 'toggleCheckedOracle', id })}
                        />
                    </ControlsBox>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ControlsBox>
                        <Control
                            selectAll={() => dispatch({ type: 'selectAll', nodeType: NodeType.Contract, options: Object.keys(state.contractMap) })}
                            unSelectAll={() => dispatch({ type: 'unSelectAll', nodeType: NodeType.Contract })}
                            allSelected={allContractsSelected}
                            options={contractOptions}
                            handleOnChange={(id) => dispatch({ type: 'toggleCheckedContract', id })}
                        />
                    </ControlsBox>
                </TabPanel>
            </ModalBox>
        </Modal>
    );
})) as React.FC<{
  open: boolean;
  handleClose: () => any;
  state: GraphState;
  dispatch: React.Dispatch<GraphAction>
}>;
