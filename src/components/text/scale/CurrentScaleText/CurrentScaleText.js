import React, {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {METERS_PER_UNIT} from 'ol/proj';

/**
 * 
 * Display the Text with the current scale of the map.
 * The scale of the map is changed once the zoom of the map
 * is changed.
 * @visibleName Current Scale Text
 */
const CurrentScaleText = ({
    map,
    style = undefined,
    className = undefined,
    ...otherProps
}) => {

    const [scale, setScale] = useState(null);

    /**
     * Event handler to calculate the scale every time the scale
     * of the map is changed.
     */
    const scaleHandler = useCallback((evt) => {
        if(!evt) return;
        const resolution = evt.target.get('resolution');
		const units = map.getView().getProjection().getUnits();
		const dpi = 25.4 / 0.28;
        const mpu = METERS_PER_UNIT[units];
        let newScale = resolution * mpu * 39.37 * dpi
		if (newScale >= 9500 && newScale <= 950000) {
		    newScale = Math.round(newScale / 1000) + "K";
		} else if (newScale >= 950000) {
		    newScale = Math.round(newScale / 1000000) + "M";
		} else {
			newScale = Math.round(newScale);
        }
        setScale(newScale);
    },[map]);

    /**
     * Register/Unregister 'change:resolution' event handler
     */
    useEffect(() => {
        map.getView().on('change:resolution', scaleHandler);
        return () => map.getView().un('change:resolution', scaleHandler)
    }, [map, scaleHandler]);

    return(
        <span style={style} className={className} {...otherProps}>{scale}</span>
    );

};

CurrentScaleText.propTypes = {
    /**
     * The OpenLayers ol/Map from where the scale will be 
     * retrieved.
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /**
     * A CSS Style to render the scale Text
     */
    style:PropTypes.object,

    /**
     * The CSS class name for this component.
     */
    className: PropTypes.string,


}

export default CurrentScaleText;