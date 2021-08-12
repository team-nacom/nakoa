import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';



function About() {
    let [message, setMessage] = React.useState('');

    fetch('./404.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return (
        <>
            <Header/>

            <MarkdownRenderer isManual={true}>
                { message }
            </MarkdownRenderer>
            
            <Footer/>
        </>
    );
}

export default About;