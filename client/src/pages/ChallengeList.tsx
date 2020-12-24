import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

function ChallengeList() {
    return (
        <>
            <Header/>
            <table>
                <thead>
                    <tr>
                        <th style={{width: '5%'}}> # </th>
                        <th style={{width: '80%'}}> 문제 이름 </th>
                        <th style={{width: '15%'}}> 푼 사람 수 </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th> 1 </th>
                        <th> 리만 가설 </th>
                        <th> 15 </th> 
                    </tr>
                </tbody>
            </table>
            <Footer/>
        </>
    );
}

export default ChallengeList;