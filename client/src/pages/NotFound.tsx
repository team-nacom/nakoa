import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

// import { EditorBubble, useNaBubbleState } from 'components/nabubble'

function NotFound() {
    let [message, setMessage] = React.useState('');

    // let [ bubble ] = useNaBubbleState('bubble');
    // React.useEffect(()=>{
    //     const intv = setInterval(()=>{
    //         console.log(bubble)
    //     },5000);

    //     return () => clearInterval(intv);
    // })

    fetch(process.env.PUBLIC_URL + '/404.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return (
        <>
            <Header/>

            <MarkdownRenderer isManual={true}>
                { message }
            </MarkdownRenderer>

            {/* for testing: */}
            {/* <EditorBubble bubbleId = { bubble.rootId }/> */}
            
            <Footer/>
        </>
    );
}

export default NotFound;