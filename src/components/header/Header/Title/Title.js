import React from 'react';
import PropTypes from 'prop-types';
import MainTitle from './MainTitle/MainTitle';
import SubTitle from './SubTitle/SubTitle';
import '../Header.css';

/**
 * Title to be shown in the <i>Header</i> component: 
 * this component will be used as a child of
 * <i>Header</i> component.
 * @visibleName Header.Title
 */
const Title = ({
    style=null,
    children
}) => {
    return (
        <div className="rolext-header-title" style={style}>
            {children}
        </div>
    );
};

Title.propTypes = {
    /**
     * A CSS Style to render the Title
     */
    style:PropTypes.object,


    /**
     * The child nodes of the Title component:
     * &lt;Header.Title.MainTitle&gt; and &lt;Header.Title.SubTitle&gt;.
     */
    children: PropTypes.node.isRequired
};

Title.MainTitle = MainTitle;
Title.SubTitle = SubTitle;

export default Title;