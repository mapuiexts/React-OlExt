import React from 'react';
import PropTypes from 'prop-types';
import '../../Header.css';


/**
 * Main Title to be shown in the <i>Header</i> component: 
 * this component will be used as a child of
 * <i>Header.Title</i> component.
 * 
 * @visibleName Header.Title.MainTitle
 */
const MainTitle = ({
    style=null,
    children
}) => {
    return (
        <h1 className="rolext-header-title-main" style={style}>
            {children}
        </h1>
    );
};

MainTitle.propTypes = {

    /**
     * A CSS Style to render the title in the header main title.
     */
    style:PropTypes.object,

    /**
     * The children elements having the main title to 
     * be shown in the header
     */
    children: PropTypes.node,


};

export default MainTitle;