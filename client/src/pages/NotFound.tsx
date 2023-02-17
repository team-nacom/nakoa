import React from 'react';
import Markdown from '#/components/markdown-lab/Markdown';
import { Layout } from '#/layout/Layout';

function NotFound() {
    let [message, setMessage] = React.useState('');

    React.useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/404.md')
            .then(response => response.text())
            .then(text => setMessage(text));
    }, [])

    // TODO : merge 404.md here
    return <Layout title='존재하지 않는 페이지입니다.'>
        <Markdown>
            { message }
        </Markdown>
    </Layout>;
}

export default NotFound;
// export default ApplyLayout({ Content: NotFound });