import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

// import { ParentBubble, TextBubble } from 'components/nabubble/NaBubble';

function NotFound() {
    let [message, setMessage] = React.useState('');

    // let [namu, setNamu] = React.useState(new ParentBubble([
    //     new TextBubble('AAAAAA'),
    //     new TextBubble('BBB'),
    // ]))

    // React.useEffect(()=>{
    //     const intv = setInterval(()=>{
    //         console.log(namu.serialize(3))
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
            {/* <React.Fragment>
                { namu.render() }
            </React.Fragment> */}

            <textarea>
                XXXX
            </textarea>
            
            <Footer/>
        </>
    );
}

export default NotFound;