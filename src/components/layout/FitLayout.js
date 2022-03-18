import React from 'react';
import Layout from './Layout';

//For the fit layout we want a single child to take up 100% height and width of the parent
const FitLayout = ({children}) => {
    const type='fit';
    return (
        <Layout type={type}>
            {children}
        </Layout>
    )
};

export default FitLayout;