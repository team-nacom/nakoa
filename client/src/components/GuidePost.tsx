import React from 'react';
import Exercise from './Exercise';
import Markdown from './Markdown';

function subsection(sectionNum: number, subsectionNum: number, text: string) {
    return (        
        <div className='subsection'>
            <div className='subsectionText'> {`${sectionNum}.${subsectionNum}.`} </div>
            <Markdown source={text} /> 
        </div>
    )
}

function section(sectionNum: number, text: string) {
    return (
        <div className='section'>
            <div className='sectionText'> {`${sectionNum}.`} </div>
            <Markdown source={text} /> 
        </div>
    )
}

const samplePost = {
    id: 1,
    content: String.raw`$p$가 홀수 소수고, $\text{gcd}(a, p) = 1$이며, $a$가 $\pmod{p}$에 대한 이차잉여라 합시다. 

이 경우, $x^2 \equiv a \pmod{p^k}$가 정확하게 두 개의 해를 가짐을 증명하세요.`,
    answer: String.raw`먼저 해가 존재함을 보입시다. $a$가 이차잉여이므로, $r^2 \equiv a \pmod{p}$인 $r$이 존재합니다. 또한, $p$가 홀수 소수이고 $\text{gcd}(a, p)=1$이므로, $2r$이 $p$의 배수가 아님은 자명합니다. 이는 $f(x) = x^2 - a$라 할 때, $f'(r)$이 $p$의 배수가 아니라는 것을 의미합니다. 그러므로, Hensel Lifting을 사용하여 $x^2 \equiv a \pmod{p^k}$의 해를 하나 찾을 수 있습니다. 또한, $x$가 해라면 $-x$ 역시 해입니다. $x \equiv -x \pmod{p^k}$였다면 $2x$가 $p$의 배수가 됩니다. $p$가 홀수 소수이므로 이는 $x$가 $p$의 배수임을 의미하고, $\text{gcd}(a, p)=1$에 모순을 얻습니다. 그러니 $x \not\equiv -x \pmod{p^k}$이며 해는 2개 이상 존재합니다.

이제 해가 정확히 두 개 존재함을 보이기 위해서, $x, -x$와 $\pmod{p^k}$에서 합동이 아닌 $y$가 있어 $y^2 \equiv a \pmod{p^k}$라 하겠습니다. 그러면 $y^2 \equiv a \equiv x^2 \pmod{p^k}$이므로, $(y-x)(y+x)$가 $p^k$의 배수가 됩니다. 그런데 $y-x$와 $y+x$가 모두 $p$의 배수라면, 그 합인 $2y$ 역시 $p$의 배수가 됩니다. $p$가 홀수이므로, 이는 $y$가 $p$의 배수라는 것이고 다시 $\text{gcd}(a, p)=1$에 모순입니다. 그러므로, 우리의 결론은 $y-x$가 $p^k$의 배수거나 $y+x$가 $p^k$의 배수라는 것입니다. 즉, $y$는 $x, -x$ 중 하나와 $\pmod{p^k}$에서 합동이어야 합니다. 그러니 모순이고, 해는 정확히 두 개 존재합니다.

풀이를 읽으면서, $p$가 홀수임이 어디에서 사용되었는지 복습해보는 것을 추천합니다.`,
}



interface Params {
    text: string;
}

function GuidePost({ text }: Params) {
    const lines = text.split('\n');

    let sectionNum = 0, subsectionNum = 0, exerciseNum = 1;

    let previews : JSX.Element[] = [];
    let components : JSX.Element[] = [];

    let nowLines = '';
    for (let line of lines) {
        let isSection = /^## /.test(line);
        let isSubsection = /^### /.test(line);
        let isExercise = /^\[연습문제 .+\]\(.+\)/.test(line);

        if (isSection || isSubsection || isExercise) {
            let specialElement : JSX.Element;
            
            if (isSection) {
                sectionNum += 1;
                subsectionNum = 0;
                specialElement = section(sectionNum, line);
            } else if (isSubsection) {
                subsectionNum += 1;
                specialElement = subsection(sectionNum, subsectionNum, line);
            } else { // isExercise
                specialElement = <Exercise id={exerciseNum} content={samplePost.content} answer={samplePost.answer} />;
                exerciseNum += 1;
            }

            components.push(<Markdown source={nowLines}/>);
            nowLines = '';

            if (isSection || isSubsection) previews.push(specialElement);
            components.push(specialElement);
        }
        else {
            nowLines = nowLines + line + '\n';
        }
    }
    components.push(<Markdown source={nowLines}/>);

    return (
        <>
            <div className='preview'>
                { previews }
            </div>
            <div className='blog'>
                { components }
            </div>
        </>
    );
}

export default GuidePost;