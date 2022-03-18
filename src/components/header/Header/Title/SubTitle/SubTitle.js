import React from 'react';
import PropTypes from 'prop-types';
import '../../Header.css';

/**
 * Subtitle to be shown in the <i>Header</i> component: 
 * this component will be used as a child of
 * <i>&lt;Header.Title&gt;</i> component.
 * 
 * @visibleName Header.Title.SubTitle
 */
const SubTitle = ({
    style=null,
    children
}) => {
    return (
        <h1 className="rolext-header-title-sub" style={style}>
            {children}
        </h1>
    );
};

SubTitle.propTypes = {

    /**
     * A CSS Style to render the subtitle in the header title
     */
    style:PropTypes.object,

    /**
     * The children elements having the subtitle to 
     * be shown in the header title
     */
    children: PropTypes.node,

};

export default SubTitle;