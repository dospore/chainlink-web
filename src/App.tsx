import React from 'react';
import './App.css';
import NodeGraph from './pages/NodeGraph';

const App = (() => {
    return (
        <div>
            <NodeGraph />
        </div>
    );
}) as React.FC;

export default App;
