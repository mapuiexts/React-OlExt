import React from 'react';
import PropTypes from 'prop-types';
import '../Header.css';

/**
 * The content to be shown in the header.
 * The content can include any element(s). But common elements
 * included are the current coordinate and current scale.
 * By default,  the elements in the Content will be placed
 * in the horizontal direction.
 * @visibleName Header.Content
 */
const Content = ({
    style=null,
    children
}) => {
    return (
        <div className="rolext-header-content" style={style}>
            {children}
        </div>
    );
};

Content.propTypes = {
    /**
     * A CSS Style to render the Content
     */
    style:PropTypes.object,

    /**
     * The children node of the Content
     */
    children: PropTypes.node.isRequired
};

export default Content;