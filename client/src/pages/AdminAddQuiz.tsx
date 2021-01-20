import Footer from 'components/Footer';
import Header from 'components/Header';
import React from 'react';

function AdminAddQuiz() {
    return (
        <>
            <Header/>
                <h2 className='title' style={{marginBottom: '20px'}}> 퀴즈 추가 </h2>

                <div className='adminBox'>
                    <div className='adminLabel'> 퀴즈 제목 </div>
                    <input className='adminForm'/>
        
                    <div className='adminLabel'> 퀴즈 내용 </div>
                    <textarea className='adminForm' placeholder='Markdown 및 Mathjax 사용 가능'/>

                    <div className='adminLabel'> 보기 </div>
                    <textarea className='adminForm' placeholder='["보기1", "보기2", "보기3"]의 형태로 작성, Markdown 및 Mathjax 사용 가능'/>

                    <div className='adminLabel'> 정답 번호 </div>
                    <input className='adminForm' placeholder='1번에서 (보기 개수)번 사이의 정수'/>

                    <div className='adminLabel'> 풀이 </div>
                    <textarea className='adminForm' placeholder='Markdown 및 Mathjax 사용 가능'/>
                    <button className='button'> 추가하기 </button>
                </div>

            <Footer/>
        </>
    )
}


export default AdminAddQuiz;