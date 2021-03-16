import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import React from 'react';

function AdminAddChallenge() {
    return (<>
        <Header/>
        <PageTitle style={{marginBottom: '20px'}}> 챌린지 추가 </PageTitle>

        <div className='adminBox'>
            <div className='adminLabel'> 챌린지 제목 </div>
            <input className='adminForm'/>

            <div className='adminLabel'> 문제 파일 </div>
            <input type='file'/>

            <div className='adminLabel'> 풀이 </div>
            <input type='file'/>
            
            <button className='button'> 추가하기 </button>
        </div>
        <Footer/>
    </>)
}


export default AdminAddChallenge;