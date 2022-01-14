import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

import { FlatRenderer } from 'components/naflat/component';


function NotFound() {
    let [message, setMessage] = React.useState('');

    React.useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/404.md')
            .then(response => response.text())
            .then(text => setMessage(text));
    }, [])

    return (
        <>
            <Header/>
            <div id='content'>
                <MarkdownRenderer isManual>
                    { message }
                </MarkdownRenderer>
            </div>
            {/* for testing: */}
            <FlatRenderer editMode
                cellId = 'c0'
                initialFlat = { {
                    'c0' : {
                        type: 'root',
                        id: 'c0',
                        childIds: ['c1','c2','c3'],
                        value: '똑떨'
                    },
                    'c1' : {
                        type: 'text',
                        id: 'c1',
                        parentId: 'c0',
                        childIds: [],
                        value:
`# 제목

으아아아앙

## 부제목

$$
x^2 + y^2 = z^2
$$
수식입력도 좀 해보고`
                    },
                    'c2' : {
                        type: 'text',
                        id: 'c2',
                        parentId: 'c0',
                        childIds: ['c22','c23'],
                        value:
`# 또다른 제목

꺄르르르륵

## 또다른 부제목

> 아아, 이것은 인용구라는 것이다.`
                    },
                    'c3' : {
                        type: 'text',
                        id: 'c3',
                        parentId: 'c0',
                        childIds: [],
                        value:
`# 세번째 제목

그롸롸롸롸

@@@expand[스포일러]
스표일려
@@@

나컴-exclusive한 것도 표시는 잘 되긴 하는데.`
                    },
                    'c22' : {
                        type: 'code',
                        id: 'c22',
                        parentId: 'c2',
                        childIds: [],
                        value: `console.log('Hello, World!')`
                    },
                    'c23' : {
                        type: 'math',
                        id: 'c23',
                        parentId: 'c2',
                        childIds: [],
                        value: `p_\\mu p^\\mu = -m^2 \\quad (-+++)`
                    }
                } }
            />

            <Footer/>
        </>
    );
}

export default NotFound;