import React, { useEffect, useState, useReducer } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

import { Flat, findAdjacentId } from 'components/naflat/flat'
import { FlatContext, defaultRootId, reducer, makeInitialState } from 'components/naflat/state'
import { CellPublished, CellDisplay, CellEditor, FlatPublishedComponent, FlatDisplayComponent, FlatEditorComponent } from 'components/naflat/component';

import { compileTex } from 'components/tex';
import HTMLParser, { Element, DOMNode, domToReact } from 'html-react-parser';

const pfaffianFlat : Flat = require('./pfaffian.json');

function Hidden() {
    // hidden bubble test page

    // for(var key of Object.keys(initialFlat)){
    //     console.log(key, findAdjacentId(initialFlat,key,1), findAdjacentId(initialFlat,key,-1));
    // }

//     const tikzStr = `\\begin{tikzpicture}
//     \\draw (0,0) circle (1in);
//     \\draw (0,0) circle (2in);
// \\end{tikzpicture}`;

//     const [rendered, setRendered] = useState(<div />);

//     useEffect(()=>{
//         compileTex(tikzStr).then(({html, style, svgAttributes})=>{
//             function replaceDiv(node : any){
//                 if(node.name === 'div'){
//                     var attrs = node.attribs;
//                     attrs.className = attrs.class;
//                     delete attrs.class;

//                     var divStyle = {...(node.style || {}), ...style }
//                     return <div {...attrs} style = { divStyle } >
//                         { domToReact(node.children, { replace: replaceSvg }) }
//                     </div>;
//                 }
                
//             }

//             function replaceSvg(node: any){
//                 if(node.name === 'svg'){
//                     return <svg {...(node.attribs )} {...svgAttributes}>
//                         { domToReact(node.children) }
//                     </svg>
//                 }
//             }

//             var elem = HTMLParser(html, { replace: replaceDiv });
//             if(Array.isArray(elem)){
//                 elem = elem[0];
//             }
//             if(typeof elem === 'string'){
//                 elem = <div>{ elem }</div>;
//             }
//             setRendered(elem);
//         })
//     }, [])

    const [display, setDisplay] = useState(false);
    const [state, dispatch] = useReducer(
        reducer,
        makeInitialState(
            pfaffianFlat,
            defaultRootId
        )
    );

    return (
        <>
            <Header/>
            
            <button onClick = { ()=>{
                setDisplay(!display);

                dispatch({ type: 'blur' });
                for(let cell of Object.values(state.flat)){
                    if(cell.type === 'section' && (cell.value.hideChildren !== !!state.hideChildren[cell.id] )){
                        dispatch({ type: 'toggleHideChildren', id: cell.id });
                    }
                }
            } }>
                Toggle to { display ? 'editor' : 'display' }
            </button>
            <FlatContext.Provider value={{ state, dispatch }}>
                {display && <CellPublished cellId = { defaultRootId } /> }
                {!display && <CellEditor cellId = { defaultRootId } /> }
            </FlatContext.Provider>

            <Footer/>
        </>
    );
}

export default Hidden;