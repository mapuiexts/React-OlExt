import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import FullScreen from 'ol/control/FullScreen';
import 'ol/ol.css';

/**
 * Provides a button that when clicked fills up the full screen with the map
 * 
 * @visibleName Full Screen Control
 */
const FullScreenControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new FullScreen(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

FullScreenControl.propTypes = {

    /**
     * The OpenLayers ol/Map on where the component
     * will zoom.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_FullScreen-FullScreen.html">
     * ol/control/FullScreen</a>
     */
    options: PropTypes.object

}

export default FullScreenControl;