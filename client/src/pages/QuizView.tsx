import Footer from 'components/Footer';
import Header from 'components/Header';
import Markdown from 'components/Markdown';
import { getQuizInfo, Quiz } from 'etc/api';
import React from 'react';
import { Link, match } from 'react-router-dom';
import Loading from './Loading';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

const maxId = 4;

function QuizView({ match } : Props) {
    const id = Number.parseInt(match.params.id);
    let [quiz, setQuiz] = React.useState<Quiz>();
    let [description, setDescription] = React.useState<JSX.Element>();
    let [choices, setChoices] = React.useState<JSX.Element[]>();
    let [choice, setChoice] = React.useState<string>();
    let [status, setStatus] = React.useState<number>(1);

    React.useEffect(() => {
        setQuiz(undefined);
        setChoice(undefined);
        setStatus(1);
        getQuizInfo(id).then((quiz) => {
            setDescription(<Markdown source={quiz.description}/>);
            setChoices(quiz.choices.map((choice, index) => <Markdown source={`${index+1}. ${choice}`} />));
            setQuiz(quiz);
        })
    }, [id]);

    if (!quiz) return <Loading/>;
    else return (
        <>
            <Header/>
            <Link to='/admin/quiz/add'><button className='button'> 퀴즈 추가하기 </button></Link>
            <div className={`quizBox shadowOver${Math.min(3, maxId - id)}`}>
                <div style={{marginBottom: '27px'}}> { `#${id}. ${quiz.name}` } </div>
                { description }
                <div style={{marginBottom: '30px'}} />
                { choices && choices.map((choiceElement, i) => {
                    let index = (i+1).toString();
                    return (
                        <div className={'choiceForm' + ((choice === index) ? ' active' : ' inactive')} onClick={(status === 1 ) ? (() => setChoice(index)) : undefined}> 
                            { choiceElement }
                        </div> 
                    );
                }) }
                <div style={{marginBottom: '10px'}} />
                <button className='button' onClick={choice ? (() => setStatus(2)) : undefined}> 제출 </button>
                { status === 2 && (
                    <>
                        <p> {quiz.answer === choice ? '맞았습니다!' : '틀렸습니다..'} {` 정답은 ${quiz.answer}입니다.`} </p>
                        <Markdown source={quiz.explanation}/>
                        <Link to={`/quiz/${Math.min(maxId, id+1)}`}><button className='button'> 다음 문제 </button></Link>
                    </>
                )}
            </div>
            <Footer/>
        </>
    )
}

export default QuizView;