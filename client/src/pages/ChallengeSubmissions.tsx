import Footer from 'components/Footer';
import Header from 'components/Header';
import Tabs from 'components/Tabs';
import { getChallInfo } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { match } from 'react-router-dom';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ChallengeSubmissions({ match } : Props) {
    const id = Number.parseInt(match.params.id);
    let [problemLoading, problem, problemError] = usePromise(() => getChallInfo(id));

    if (problemLoading) return (<><Header/><Footer/></>)
    else return (
        <>
            <Header/>
            <h2 className='title' style={{marginBottom: '20px'}}>
                { problem.name }
            </h2>
            <Tabs data={[
                {
                    name: '문제',
                    link: `/challenge/${id}`,
                    active: false,
                }, {
                    name: '제출',
                    link: `/challenge/${id}/submit`,
                    active: false,
                }, {
                    name: '풀이',
                    link: `/challenge/${id}/solution`,
                    active: false,
                }, {
                    name: '답안',
                    link: `/challenge/${id}/submissions`,
                    active: true,
                }
            ]} />
            <p> 각 행을 클릭하면 사람들이 제출한 풀이를 확인할 수 있습니다. </p>
            <p> 공식 풀이를 제외한 풀이는 문제를 푼 사람만 열람할 수 있습니다. </p>
            <p/>
            <table>
                <thead>
                    <tr>
                        <th style={{width: '10%'}}> # </th>
                        <th style={{width: '20%'}}> 닉네임 </th>
                        <th style={{width: '20%'}}> 점수 </th>
                        <th style={{width: '30%'}}> 제출 시각 </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> 29 </td>
                        <td> 듀벤 </td>
                        <td> 100 / 100 </td>
                        <td> 2021년 1월 3일 4시 56분 </td>
                    </tr>
                </tbody>
            </table>
            <Footer/>
        </>
    )
}

export default ChallengeSubmissions;