import React from 'react';
import Layout from './Layout';

// The hbox layout is where we will really start to see the benefit of the 
//CSS flexbox layout system. The hbox layout organizes its child items horizontally 
//with no wrapping. This is the layout that’s applied by default to Header and Toolbar components in Ext JS.
const HBoxLayout = ({children}) => {
    const type='hbox';
    return (
        <Layout type={type}>
            {children}
        </Layout>
    )
};

export default HBoxLayout;