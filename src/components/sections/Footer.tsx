import React from 'react';
import './Sections.scss'

const Section03 = () => {
    return (
        <div className={'footer'}>
            <div className="container">
                <div id={'footer-content'} className="footer-content">
                    <div className="content-block">
                    <p>{new Date().getFullYear()}</p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section03;
