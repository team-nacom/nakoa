import Button from 'components/Button';
import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import { postQuiz } from 'etc/api/quiz';
import React from 'react';


function QuizWrite() {
    let [index, setIndex] = React.useState<number>();
    let [name, setName] = React.useState<string>();
    let [description, setDescription] = React.useState<string>();
    let [choiceString, setChoiceString] = React.useState<string>();
    let [answer, setAnswer] = React.useState<string>();
    let [explanation, setExplanation] = React.useState<string>();
    let [message, setMessage] = React.useState<string>();

    return (<>
        <Header/>
        <PageTitle style={{marginBottom: '20px'}}> 퀴즈 추가 </PageTitle>

        <div className='writeBox'>
            <div className='adminLabel'> 퀴즈 번호 </div>
            <input type='number' className='writeForm' placeholder='-1' value={index} onChange={(e) => setIndex(Number.parseInt(e.target.value))}/>

            <div className='adminLabel'> 퀴즈 제목 </div>
            <input className='writeForm' value={name} onChange={(e) => setName(e.target.value)}/>

            <div className='adminLabel'> 퀴즈 내용 </div>
            <textarea className='writeForm' placeholder='Markdown 및 Mathjax 사용 가능' value={description} onChange={(e) => setDescription(e.target.value)}/>

            <div className='adminLabel'> 보기 </div>
            <textarea className='writeForm' placeholder='["보기1", "보기2", "보기3"]의 형태로 작성, Markdown 및 Mathjax 사용 가능. 여기서 \ 문자를 쓰려면 \를 두 번 반복해서(\\) 써줘야 합니다' value={choiceString} onChange={(e) => setChoiceString(e.target.value)} />

            <div className='adminLabel'> 정답 번호 </div>
            <input type='number' className='writeForm' placeholder='1번에서 (보기 개수)번 사이의 정수' value={answer} onChange={(e) => setAnswer(e.target.value)}/>

            <div className='adminLabel'> 풀이 </div>
            <textarea className='writeForm' placeholder='Markdown 및 Mathjax 사용 가능' value={explanation} onChange={(e) => setExplanation(e.target.value)}/>
            <Button className='button' onClick={() => {
                if (!name || !description || !choiceString || !answer || !explanation) {
                    setMessage('모든 항목을 채워주세요.');
                    return;
                }
                let choices : string[];
                try {
                    choices = JSON.parse(choiceString);
                } catch {
                    setMessage('보기 항목을 형식에 맞추어 써주세요.');
                    return;
                }
                postQuiz({index, name, description, choices, answer, explanation}).then((success) => {
                    if (success) setMessage('업로드에 성공했습니다!');
                    else setMessage('업로드에 실패했습니다...');
                })
            }}> 추가하기 </Button>
            {message}
        </div>

        <Footer/>
    </>)
}


export default QuizWrite;