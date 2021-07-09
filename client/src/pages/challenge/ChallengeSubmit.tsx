import Footer from 'components/Footer';
import Header from 'components/Header';
import Tabs from 'components/Tabs';
import { getChallInfo } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { match } from 'react-router-dom';
import Loading from '../Loading';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

const submitPlaceholder = 
`여기에 풀이를 작성하거나 아래 버튼을 이용해 풀이를 담은 파일을 첨부해주세요.
$n^2$와 같이 수식을 작성할 수 있으며, markdown 형식을 사용할 수 있습니다.
작성한 풀이는 운영진이 읽고 피드백해 드립니다.
`

function ChallengeSubmit({ match }: Props) {
    const id = Number.parseInt(match.params.id);
    let [problemLoading, problem] = usePromise(() => getChallInfo(id));

    if (problemLoading) return <Loading/>;
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
                    active: true,
                }, {
                    name: '풀이',
                    link: `/challenge/${id}/solution`,
                    active: false,
                }, {
                    name: '답안',
                    link: `/challenge/${id}/submissions`,
                    active: false,
                }
        ]} />
            <textarea placeholder={submitPlaceholder} className='submitChallenge'/>
            <input type='file' style={{margin: '16px'}}/>
            <button className='button submitChallenge'> 제출 </button>
            <Footer/>
        </>
    )
}

export default ChallengeSubmit;