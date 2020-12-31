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
                        <td> 1 </td>
                        <td> 리만 가설 </td>
                        <td> 15 </td> 
                    </tr>
                </tbody>
            </table>
            <Footer/>
        </>
    );
}

export default ChallengeList;