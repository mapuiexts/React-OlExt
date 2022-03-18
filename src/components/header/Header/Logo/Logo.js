import React from 'react';
import PropTypes from 'prop-types';
import '../Header.css';
import app_logo from '../../../../assets/images/react-olext_logo.svg';

/**
 * Logo to be shown in the <i>Header</i> component: 
 * this component will be used as a child of
 * <i>Header</i> component.
 * @visibleName Header.Logo
 */
const Logo = ({
    logo=app_logo,
    style={paddingLeft:'10px', paddingBottom:'5px', paddingTop:'5px'},
    alt= 'logo',
    width=undefined,
    height=undefined,
}) => {

    return (
        <div className="rolext-header-logo" style={style}>
            <img 
                src={logo}
                alt={alt}
                width={width}
                height={height}
            />
        </div>
    );
};

Logo.propTypes = {
    /**
     * A CSS Style to render the Logo
     */
    style:PropTypes.object,

    /**
     * The logo to be shown in the Header.
     * The default is the React-Olext Logo in
     * SVG format.
     */
    logo: PropTypes.any,

    /**
     * Specifies an alternate text for an image, if the image cannot be displayed
     */
    alt: PropTypes.string,

    /**
     * The height of the Logo.
     */
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    /**
     * The width of the Logo.
     */
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),


};


export default Logo;