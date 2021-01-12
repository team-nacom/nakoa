import Footer from 'components/Footer';
import Header from 'components/Header';
import Markdown from 'components/Markdown';
import React from 'react';

const description = '$1+1=3$일 때, 영국의 수도는 어디인가?';
const choices = ['신라', '베를린', '런던', '$$\\max_{i=1, \\cdots, k-1} (dp[i] + ax^2 + bx + c)$$'];
const answer = '3';
const explanation = '영국의 수도는 당연히 베를린이지요';

function Quiz() {
    let [choice, setChoice] = React.useState<string>();
    let [status, setStatus] = React.useState<number>(1);

    return (
        <>
            <Header/>
            <div className='quizBox'>
                <Markdown source={description} />
                <div style={{marginBottom: '30px'}} />
                { choices.map((item, i) => {
                    let index = (i+1).toString();
                    return (
                        <div className={'choiceForm' + ((choice === index) ? ' active' : ' inactive')} key={item} onClick={(status === 1 ) ? (() => setChoice(index)) : undefined}> 
                            <Markdown source={`${index}. ${item}`} />
                        </div> 
                    );
                }) }
                <div style={{marginBottom: '10px'}} />
                <button className='button' onClick={choice ? (() => setStatus(2)) : undefined}> 제출 </button>
                { status === 2 && (
                    <>
                        <p> {answer === choice ? '맞았습니다!' : '틀렸습니다..'} {' '} { `정답은 ${answer}입니다.`} </p>
                        <Markdown source={explanation}/>
                        <button className='button'> 다음 문제 </button>
                    </>
                )}
            </div>
            <Footer/>
        </>
    )
}

export default Quiz;