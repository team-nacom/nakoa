import React from 'react';
import { Link } from 'react-router-dom';

interface TabDataLink {
    name: string;
    link: string;
    active: boolean;
};

interface TabDataOnClick {
    name: string;
    onClick: () => void;
    active: boolean;
};

export type TabData = TabDataLink | TabDataOnClick;

interface Props {
    data: TabData[];
    className?: string;
}

function Tabs({data, className = 'tabs'} : Props) {
    return (
        <div className={className}>
            {
                data.map((data) => {
                    if ("link" in data) return (
                        <Link to={data.link} key={data.name}>
                            <button className={data.active ? 'active' : undefined}> 
                                {data.name} 
                            </button>
                        </Link>
                    );
                    else return (
                        <button className={data.active ? 'active' : undefined} onClick={data.onClick} key={data.name}> 
                            {data.name} 
                        </button>
                    );
                } )
            }
        </div>
    );
}

export default Tabs;