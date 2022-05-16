import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import AboutWnd from '../../../window/common/AboutWnd/AboutWnd';

/**
 * <p>
 *  About Button to show the "About" window.
 *  This window will provide information about
 *  the <i>React-OlExt library</i>
 * </p>
 * <p>Please, use it in your application to let the people to know about React-OlExt</p>
 * <p>
 *  Check in the <a href="https://ant.design/components/button/">documentation</a> 
 *  for additional properties for the button.
 * </p>
 * @visibleName About Button
 */
const AboutButton = ({
    wndStyle, 
    children = 'About',
    content = 'Content about your application goes here...',
    ...otherProps
}) => {

    const [visibleWnd, setVisibleWnd] = useState(false);

    /**
     * Handler to close the "About" Window once the OK button
     * on this window is clicked
     */
    const onCloseWindow = useCallback(() => {
        setVisibleWnd(false);
    }, []);

    /**
     * Handler to show the About Window once the button is Clicked
     */
    const onShowWindow = useCallback(() => {
        setVisibleWnd(true);
    }, []);

    return (
        <React.Fragment>
            <Button onClick={onShowWindow} {...otherProps}>{children}</Button>
            {visibleWnd && <AboutWnd onClose={onCloseWindow} style={wndStyle} visible={visibleWnd} content={content} />}
        </React.Fragment>
    );
    
};

AboutButton.propTypes = {

     /**
     * A CSS Style to render the style for the About Window
     */
    wndStyle:PropTypes.object,

     /**
     * The child node for the About Button
     */
    children: PropTypes.node,

    /**
     * The custom content for the About Button
     */
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ])
};

export default AboutButton;

