import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';



function About() {
    let [message, setMessage] = React.useState('');

    fetch(process.env.PUBLIC_URL + '/aboutus.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return (
        <>
            <Header/>
            <div id='content'>
                <MarkdownRenderer isManual={true} useTOC>
                    { message }
                </MarkdownRenderer>
            </div>
            <Footer/>
        </>
    );
}

export default About;