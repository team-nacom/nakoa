import React from 'react'
import ReactDOM from 'react-dom/client'

// import App from './rdt/RdtApp'
// import App from './dkst/DkstApp'

// import App from './DummyApp'
// import App from './App220831'
// import App from './App220908'
import App from './App220915'


const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(rootElement)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
