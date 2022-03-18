import React from 'react';
import Layout from './Layout';

// The vbox layout is very nearly identical to hbox except that that items are arranged in a column. 
// This is the layout that’s applied by vertically oriented Header and Toolbar components in Ext JS.
const VBoxLayout = ({children}) => {
    const type='vbox';
    return (
        <Layout type={type}>
            {children}
        </Layout>
    )
};

export default VBoxLayout;