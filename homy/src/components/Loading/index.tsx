import React from 'react';
import { CSSProperties } from 'react';

const Loading = () => {
    const loadingStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    };

    return (
        <div style={loadingStyle}>
            <div className="text-center">
                <div className="spinner-border spinner-border-lg text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Loading;