import React from 'react';
import Layout from './Layout';

//Layout to show one child item at a time
const CardLayout = ({children, items, activeCard=0}) => {
    const type='card';
    return(
        <Layout type={type}>
            {React.cloneElement(children, {}, items[activeCard] )}
        </Layout>
    );
};

export default CardLayout;