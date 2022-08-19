import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import OlZoomToExtent from 'ol/control/ZoomToExtent';
import 'ol/ol.css';

/**
 * Control to zoom to a extent defined by the user.
 * 
 * @visibleName Zoom to Extent Control
 */
const ZoomToExtentControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new OlZoomToExtent(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

ZoomToExtentControl.propTypes = {

    /**
     * The OpenLayers ol/Map on where the component
     * will zoom.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_ZoomToExtent-ZoomToExtent.html">
     * ol/control/ZoomToExtent</a>
     */
    options: PropTypes.object

}

export default ZoomToExtentControl;



