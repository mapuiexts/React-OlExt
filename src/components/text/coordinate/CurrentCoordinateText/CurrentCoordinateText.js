import React, {useRef, useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {format as olFormat} from 'ol/coordinate';
import {MousePosition as olMousePosition} from 'ol/control';


/**
 * Display Text with the current coordinate of the mouse position
 * in the map. If the mouse is outside the map, a empty string 
 * will be shown.
 * 
 * @visibleName CurrentCoordinate Text
 */
const CurrentCoordinateText = ({
    map,
    style= null,
    className= null,
    coordinateFormatFunc = null,
    ...otherProps
}) => {

    const [view, setView ] = useState(map.getView());
    const ref = useRef();

    /**
     * Method to return the default coordinate format function.
     * This method will return a function to format the coordinate as:
     * <ul>
     *  <li>x,y with 2 decimal digits: for projected coordinate</li>
     *  <li>y,x with 4 decimal digits: for lat/long</li>
     * </ul>
     * @param {Number} fractionDigits The number of decimal digits for the coordinate
     */
    const getDefaultCoordinateFormatFunc = useCallback(() => {
        const proj = view.getProjection();
        const axisOrientation = proj.getAxisOrientation();
        const fmtFunc = (coord) => {
            let template = '{x}, {y}';
            //invert coordinate for lat/long
            if(axisOrientation === 'neu') {
                template = '{y}, {x}';
                return olFormat(coord, template, 4);
            }
            else {
                return olFormat(coord, template, 2);
            }
        }
        return fmtFunc;
    }, [view]);

   
    /**
     * Handler to change the state view
     * if a new view is assigned to the map (it 
     * happens if the projection in the map is changed)
     */
     const onChangeViewHandler = useCallback((evt) => {
        setView(evt.target.getView());
    }, []);

    /**
     * Register 'change:view' for the map
     * fired if a new view is assigned to the map
     */
     useEffect(() => {
        map.on('change:view', onChangeViewHandler);
        //clean-up:
        return () => map.un('change:view', onChangeViewHandler);;
    }, [map, onChangeViewHandler]);
    
    useEffect(() => {
        const mousePositionControl = new olMousePosition({
            className: 'custom-mouse-position',
            target: ref.current,
            coordinateFormat: (!coordinateFormatFunc ? getDefaultCoordinateFormatFunc() : coordinateFormatFunc),
            undefinedHTML: '&nbsp;'
        });
        map.addControl(mousePositionControl);

        return () => map.removeControl(mousePositionControl);
    }, [map, coordinateFormatFunc, getDefaultCoordinateFormatFunc]);

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