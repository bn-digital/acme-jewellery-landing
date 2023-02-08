import React from 'react';
import './Customizer.scss'

const Customizer = () => {
    return (
        <div className={'customizer'}>
            <div className="section-title">{'Gold color'}</div>
            <button id={'white'} className={'customizer-btn'}/>
            <button id={'yellow'} className={'customizer-btn'}/>
            <button id={'red'} className={'customizer-btn'}/>

        </div>
    );
};

export default Customizer;
