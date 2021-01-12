import Footer from 'components/Footer';
import Header from 'components/Header';
import Tabs from 'components/Tabs';
import React from 'react';
import { match } from 'react-router-dom';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ChallengeSolution({ match }: Props) {
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
                    active: false,
                }, {
                    name: '풀이',
                    link: `/challenge/${id}/solutions`,
                    active: true,
                }, {
                    name: '답안',
                    link: `/challenge/${id}/submissions`,
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

export default ChallengeSolution;