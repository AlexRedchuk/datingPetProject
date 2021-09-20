import React from 'react';
import cutes from '../../imgs/Page under development.png'

const PageIsDeveloping = () => {
    return (
        <div style={{
            width: '1100px',
            display: 'flex',
            alignItems: 'center'
        }}>
            <img width="1007px" height="646px" style={{
                position: 'relative',
                margin: '20px auto'
            }} src={cutes} alt="error"/>
        </div>
    );
};

export default PageIsDeveloping;