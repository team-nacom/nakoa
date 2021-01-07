import Footer from 'components/Footer';
import Header from 'components/Header';
import React from 'react';

function SignUp() {
    return (
        <>
            <Header/>
            <h2> 가입 </h2>
            <p> 나무컴퍼스에 관심을 가지고 가입해주셔서 감사합니다. </p>
            <p> 가입하시려면, 아래 항목을 채워주세요. 입력해주신 개인정보는 로그인 외 다른 용도로 이용되지 않습니다.</p>

            <div className='signupBox'>
                <div className='signupLabel'> 이메일 (아이디) </div>
                <input className='signupForm' placeholder='예시: example@gmail.com'/>

                <div className='signupLabel'> 비밀번호 </div>
                <input type='password' className='signupForm' placeholder='8글자 이상 영문+숫자'/>

                <div className='signupLabel'> 비밀번호 확인 </div>
                <input type='password' className='signupForm'/>
            </div>

            <button className='button'> 가입하기 </button>
            <Footer/>
        </>
    )
}

export default SignUp;