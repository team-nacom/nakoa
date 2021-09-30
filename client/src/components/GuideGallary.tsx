import React from 'react';
import { GuideType } from 'etc/api/guide';
import { Link } from 'react-router-dom';


interface GuideViewProps {
    guide: GuideType;
}

function GuideView({ guide } : GuideViewProps) {
    return (
        <div key={guide.name} className='guideFeed'>
            <Link to={`/guide/${guide.index}`}>
                <div 
                    className={`guideFeedContent`}
                >
                    <div className='author'> { guide.authors.join(', ')} </div>
                    <div className='title'> { guide.name } </div>
                    <div className='content'> { guide.content.substring(0, 100) } </div>
                    <div className='tags'> { guide.tags && guide.tags.map((s) => `#${s} `) } </div> 
                </div>
            </Link>
        </div>
    );
}

interface Props {
    guides: GuideType[];
};

function GuideGallary({ guides }: Props) {
    
    return (
        <>
            <div>
                { `총 ${guides?.length || 0}개` }
            </div>
            <div className='guideFeedList'>
                { guides?.map((guide) => <GuideView guide={guide} />) }
            </div>
        </>
    );
}

export default GuideGallary;