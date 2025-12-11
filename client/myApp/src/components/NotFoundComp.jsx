import React from 'react';

export const NotFoundComp = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <a href="/">Go to Login Page</a>
        </div>
    );
};
