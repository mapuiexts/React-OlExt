import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {format as olFormat} from 'ol/coordinate';
import {MousePosition as olMousePosition} from 'ol/control';


const mapCoordinateFormat = (map, fractionDigits) => {
    const proj = map.getView().getProjection();
    const axisOrientation = proj.getAxisOrientation();
    const fmtFunc = (coord) => {
        let template = '{x}, {y}';
        //invert coordinate for lat/long
        if(axisOrientation === 'neu') {
            template = '{y}, {x}';
        }
        return olFormat(coord, template, fractionDigits);
    }
    return fmtFunc;
};

/**
 * Display Text with the current coordinate of the mouse position
 * in the map. If the mouse is outside the map, a empty string 
 * will be shown.
 * 
 * @visibleName Current Coordinate Text
 */
const CurrentCoordinateText = ({
    map,
    style= undefined,
    className= undefined,
    coordinateFormatFunc= mapCoordinateFormat(map, 2),
    ...otherProps
}) => {
    const ref = useRef();
    
    useEffect(() => {
        const mousePositionControl = new olMousePosition({
            className: 'custom-mouse-position',
            target: ref.current,
            coordinateFormat: coordinateFormatFunc,
            undefinedHTML: '&nbsp;'
        });
        map.addControl(mousePositionControl);

        return () => map.removeControl(mousePositionControl);
    }, [map, coordinateFormatFunc]);

    return(
        <span ref={ref} className={className} style={style} {...otherProps}></span>
    );

};

CurrentCoordinateText.propTypes = {
    /**
     * The OpenLayers ol/Map from where the coordinate will be 
     * retrieved.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * A CSS Style to render the Text
     */
    style:PropTypes.object,

    /**
     * The CSS class name for this component.
     */
    className: PropTypes.string,

    /**
     * A function that takes a ol/coordinate/Coordinate and 
     * transforms it into a string.
     * <p>The default function will format the string in <i>x, y</i>
     * with 2 decimal digits. If the map is in lat-long, the returned
     * string will be <i>y, x</i>.</p>
     */
    coordinateFormatFunc:PropTypes.func 

};

export default CurrentCoordinateText;