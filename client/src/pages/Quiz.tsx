import Footer from 'components/Footer';
import Header from 'components/Header';
import Markdown from 'components/Markdown';
import { getQuizInfo } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, match } from 'react-router-dom';
import Loading from './Loading';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function Quiz({ match } : Props) {
    const id = Number.parseInt(match.params.id);
    let [quizLoading, quiz, quizError] = usePromise(() => getQuizInfo(id));
    let [choice, setChoice] = React.useState<string>();
    let [status, setStatus] = React.useState<number>(1);

    if (quizLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='quizBox'>
                <Markdown source={quiz.description} />
                <div style={{marginBottom: '30px'}} />
                { quiz.choices.map((item, i) => {
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
                        <p> {quiz.answer === choice ? '맞았습니다!' : '틀렸습니다..'} {` 정답은 ${quiz.answer}입니다.`} </p>
                        <Markdown source={quiz.explanation}/>
                        <Link to={`/quiz/${id+1}`}><button className='button'> 다음 문제 </button></Link>
                    </>
                )}
            </div>
            <Footer/>
        </>
    )
}

export default Quiz;