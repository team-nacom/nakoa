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

const dateString = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`;
}

function ChallengeSolution({ match }: Props) {
    const id = Number.parseInt(match.params.id);
    let [problemLoading, problem, problemError] = usePromise(() => getChallInfo(id));
    let time = React.useMemo(() => new Date(), []);
    let solutionOpenTime = React.useMemo(() => new Date(problem ? problem.solutionOpenDate: 0), [problem]);

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
                    active: true,
                }, {
                    name: '답안',
                    link: `/challenge/${id}/submissions`,
                    active: false,
                }
            ]} />
            { solutionOpenTime <= time ? (
                <object 
                    data={problem.problemUrl}
                    type="application/pdf" 
                    style={{width: '100%', height: '600px'}}>
                    Sorry, Your browser is outdated, or your PDF plugin is deactivated
                </object>
            ) : (
                <p> 풀이는 {dateString(solutionOpenTime)}에 공개됩니다. </p>
            )}
            <Footer/>
        </>
    )
}

export default ChallengeSolution;