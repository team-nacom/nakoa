import React, { useState } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

import { Flat, findAdjacentId } from 'components/naflat/flat'
import { FlatDisplayComponent, FlatEditorComponent } from 'components/naflat/component';

const initialFlat : Flat = {
    'c0' : {
        type: 'root',
        id: 'c0',
        childIds: ['c1','c2','c3','c4'],
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

다른 셀을 이제 레퍼런싱 해보자구요. §%c2%같이.

이건 테이블.
| a | b |
|--|--|
| a | bwer |
| c | drwepppppp |

§%c77%는 바뀌면 안됨.

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
    },
    'c4' : {
        type: 'image',
        id: 'c4',
        parentId: 'c0',
        childIds: [],
        value: { src: 'https://img.khan.co.kr/news/2021/03/14/l_2021031401001628900137951.jpg', caption: '무~야~호~~' }
    }
};

const pfaffianFlat : Flat = require('./pfaffian.json');

function Hidden() {
    // hidden bubble test page

    // for(var key of Object.keys(initialFlat)){
    //     console.log(key, findAdjacentId(initialFlat,key,1), findAdjacentId(initialFlat,key,-1));
    // }

    const [displayMode,setDisplayMode] = React.useState(false);

    return (
        <>
            <Header/>
            <FlatEditorComponent //FlatDisplayComponent
                cellId = 'c0'
                initialFlat = { pfaffianFlat }
            />

            <Footer/>
        </>
    );
}

export default Hidden;