import React from 'react';

import {SortableTree} from './SortableTree';

const Wrapper = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      maxWidth: 600,
      padding: 10,
      margin: '0 auto',
      marginTop: '10%',
    }}
  >
    {children}
  </div>
);

function App(){
    return (
        <Wrapper>
            <SortableTree collapsible indicator removable />
        </Wrapper>
    )
}
    
export default App;