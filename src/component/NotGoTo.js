import React from 'react';

function NotGoTo() {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        },
        bouncingImg: {
            width: '200px',
            height: '200px',
            animation: 'bounce 1s infinite alternate',
        },
        '@keyframes bounce': {
            '0%': {
                transform: 'scale(1)',
            },
            '50%': {
                transform: 'scale(1.1)',
            },
            '100%': {
                transform: 'scale(1)',
            },
        },
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes bounce {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
            <img src="appIcon.png" alt="App Icon" style={styles.bouncingImg} />
            <h1>还没有去过这里哦</h1>
        </div>
    );
}

export default NotGoTo;