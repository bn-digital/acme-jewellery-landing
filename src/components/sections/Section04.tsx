import React from 'react';
import './Sections.scss'

const Section04 = () => {
    return (
        <div className={'section section-04'}>
            <div className="container">
                <div id={'section-04-content'} className="section-content ">
                    <div className="content-block">
                        <h2>{'Let your jewelry do the talking'}</h2>
                        <p>{'It is time to customise your ring'}</p>
                        <div className="btn-block">
                            <button id={'customizeBtn'} className={'customize-btn'}>{'Customize'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section04;
