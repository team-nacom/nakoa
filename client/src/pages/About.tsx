import React from 'react';
import Markdown from '#/components/markdown-lab/Markdown';
import { Layout } from '#/layout/Layout';


function About() {
    let [message, setMessage] = React.useState('');

    fetch(process.env.PUBLIC_URL + '/aboutus.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return <Layout>
        <div className='aboutDisplayWrapper'>
            <Markdown>
                { message }
            </Markdown>
        </div>
    </Layout>;
}

export default About;
// export default ApplyLayout({Content: About});