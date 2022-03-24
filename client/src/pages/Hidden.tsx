import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

import { Flat, findAdjacentId } from 'components/naflat/flat'
import { FlatDisplayComponent, FlatEditorComponent } from 'components/naflat/component';
import CreatePdfButton from 'components/naflat/CreatePdfButton';

import { compileTex } from 'components/tex';
import HTMLParser, { Element, DOMNode, domToReact } from 'html-react-parser';

const pfaffianFlat: Flat = require('./pfaffian.json');

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
    const pdfRef = React.createRef<HTMLDivElement>();

    return (
        <>
            <Header />

            {/* { rendered } */}
            <button onClick={() => { setDisplay(!display) }}>
                Toggle to {display ? 'editor' : 'display'}
            </button>
            {display &&
                <>
                    <CreatePdfButton pdfElementRef={pdfRef} fileName='example.pdf' />
                    <div ref={pdfRef}>
                        <FlatDisplayComponent
                            cellId='c0'
                            initialFlat={pfaffianFlat}
                        />
                    </div>
                </>
            }
            {!display &&
                <FlatEditorComponent
                    cellId='c0'
                    initialFlat={pfaffianFlat}
                />
            }

            <Footer />
        </>
    );
}

export default Hidden;