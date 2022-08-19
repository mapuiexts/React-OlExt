import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import ScaleLine from 'ol/control/ScaleLine';
import 'ol/ol.css';

/**
 * A control displaying rough y-axis distances, calculated for the center of the viewport.
 * By default the scale line will show in the bottom left portion of the map, but this can 
 * be changed by using the css selector .ol-scale-line. When specifying bar as true, a 
 * scalebar will be rendered instead of a scaleline.
 * 
 * @visibleName ScaleLine Control
 */
const ScaleLineControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new ScaleLine(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

ScaleLineControl.propTypes = {

    /**
     * The OpenLayers ol/Map on where the component
     * will zoom.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html">
     * ol/control/ZoomScaleLine</a>
     */
    options: PropTypes.object

}

export default ScaleLineControl;