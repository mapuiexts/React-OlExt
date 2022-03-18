import React from 'react';
import PropTypes from 'prop-types';
import Logo from './Logo/Logo';
import Title from './Title/Title';
import Content from './Content/Content';
import './Header.css';

/**
 * Header to be shown in the application.
 * The Header can include one or more of child elements:
 * <ul>
 *  <li>&lt;Header.Logo&gt;: Show the application Logo</li>
 *  <li>&lt;Header.Title&gt;: Show the application title</li>
 *  <li>&lt;Header.Content&gt;:Used to include any controls you want</li>
 * </ul>
 * On this documentation you can find the description of these child elements;
 */
const Header = ({
    style=null,
    children,
    ...otherProps
}) => {

    return (
        <div className="rolext-header-container" style={style} {...otherProps}>
            {children}
        </div>
    );
};

Header.propTypes = {
    /**
     * A CSS Style to render the Header
     */
    style:PropTypes.object,

    /**
     * The children nodes of the header:
     * &lt;Header.Logo&gt;, &lt;Header.Title&gt;, &lt;Header.Content&gt;.
     */
    children: PropTypes.node.isRequired
};

Header.Logo = Logo;
Header.Title = Title;
Header.Content = Content;


export default Header;