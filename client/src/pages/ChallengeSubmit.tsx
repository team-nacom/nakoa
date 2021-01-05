import Footer from 'components/Footer';
import Header from 'components/Header';
import Tabs from 'components/Tabs';
import React from 'react';
import { match } from 'react-router-dom';

interface MatchParams {
    id: string;
};

interface ChallengeProps {
    match: match<MatchParams>;
};

function ChallengeSubmit({ match }: ChallengeProps) {
    const id = match.params.id;
    return (
        <>
            <Header/>
            <h2 className='title' style={{marginBottom: '20px'}}>
                리만 가설
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
                    name: '토론',
                    link: `/challenge/${id}/debate`,
                    active: false,
                }
            ]} />
            
            <Footer/>
        </>
    )
}

export default ChallengeSubmit;