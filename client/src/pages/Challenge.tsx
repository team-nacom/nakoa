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

function Challenge({ match }: ChallengeProps) {
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
                    active: true,
                }, {
                    name: '제출',
                    link: `/challenge/${id}/submit`,
                    active: false,
                }, {
                    name: '토론',
                    link: `/challenge/${id}/debate`,
                    active: false,
                }
            ]} />
            <object 
                data="https://nacom-main-storage.s3.ap-northeast-2.amazonaws.com/challs/test.pdf" 
                type="application/pdf" 
                style={{width: '100%', height: '600px'}}>
                Sorry, Your browser is outdated, or your PDF plugin is deactivated
            </object>
            <Footer/>
        </>
    )
}

export default Challenge;