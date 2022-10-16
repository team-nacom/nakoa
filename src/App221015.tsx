import React from 'react'

import Markdown from '#/components/markdown/MarkdownRenderer'
import MarkdownLab from '#/components/markdown-lab/Markdown'

const initSentence = '수식(%c11%)의 분모에 있는 $n! \\cdot 2^{n}$을 먼저 제거해줍시다.\r\n\r\n순열 $\\sigma \\in S_{2n}$을 정점이 $[2n] = \\{1, \\cdots, 2n\\}$인 완전그래프 $K_{2n}$의 완전 매칭으로 생각합시다. $\\sigma(1)$과 $\\sigma(2)$를 간선 $e_{1}$으로, $\\sigma(3)$과 $\\sigma(4)$를 간선 $e_{2}$로, ... , $\\sigma(2n-1)$과 $\\sigma(2n)$을 간선 $e_{n}$으로 이어주었다고 생각합니다. 이 때 간선은 방향이 있고, 방향은 $\\sigma(2k-1)$에서 $\\sigma(2k)$로 가는 쪽입니다. 즉, 길이 $2n$의 순열은 하나의 oriented-labeled perfect matching으로 생각할 수 있습니다.\r\n한편, $\\sigma \\in S_{2n}$에 대해 $\\mathrm{sgn}(\\sigma) a_{\\sigma(1)\\sigma(2)} \\cdots a_{\\sigma(2n-1)\\sigma(2n)}$을 $P(\\sigma)$라고 정의합시다. 즉, (%c11%)를 다시 쓰면 아래와 같습니다.'

export default function App(){
    const [mode, setMode] = React.useState(1)
    const [value, setValue] = React.useState(initSentence)

    return <div>
        <div style={ { width:'100%', height:'400px', border:`1px solid ${ mode === 1 ? 'black' : 'red' }` } }>
            { mode === 1 && <Markdown>{ value }</Markdown> }
            { mode === 2 && <MarkdownLab>{ value }</MarkdownLab> }
        </div>
        <textarea
            style={ { width:'100%', height:'400px', overflowY:'scroll', resize:'vertical' } }
            value={value}
            onChange={ (ev)=>{ setValue(ev.target.value) } }
        />
        <button onClick={ ()=> setMode(1) }>Normal</button>
        <button onClick={ ()=> setMode(2) }>Lab</button>
    </div>
}
