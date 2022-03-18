import React, {useEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Control from 'ol/control/Control';
import 'ol/ol.css';

/**
 * <p>
 *  A control is a visible widget with a DOM element in a fixed 
 *  position on the screen. They can involve user input (buttons), 
 *  or be informational only; the position is determined using CSS. 
 *  By default these are placed in the container with CSS class name
 *  ol-overlaycontainer-stopevent, but can use any outside DOM element.
 * </p>
 * 
 * @visibleName Custom Control
 */
const CustomControl = ({
    map,
    options,
    children
}) => {
    
    const elementRef = useRef();
   
    useEffect(() => {
        const opts = {
            ...options,
            element: elementRef.current
        }
        
        
        delete opts.className;
        const control = new Control(opts);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    const StyledChildren = useCallback(() => {
        return (
            React.Children.map(children, child => {
                return (
                    React.cloneElement(child, {
                        //className: `${child.props.className} ${options.className}`
                        className: options.className
                    })
                )}
            )
        );
    }, [children, options.className]);

    return (
        <div ref={elementRef} >
            <StyledChildren/>
        </div>
    );
};

CustomControl.propTypes = {

    /**
     * The OpenLayers ol/Map container for the component.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. 
     */
    options: PropTypes.object

};

export default CustomControl;