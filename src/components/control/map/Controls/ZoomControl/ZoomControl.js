import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Zoom from 'ol/control/Zoom';
import 'ol/ol.css';

/**
 * A control with 2 buttons, one for zoom in and one for zoom out. 
 * This control is one of the default controls of a map. 
 * To style this control use css selectors .ol-zoom-in and .ol-zoom-out.
 * 
 * @visibleName Zoom Control
 */
const ZoomControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new Zoom(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

ZoomControl.propTypes = {

    /**
     * The OpenLayers ol/Map container for the component.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_Zoom-Zoom.html">
     * ol/control/Zoom</a>
     */
    options: PropTypes.object

};

export default ZoomControl;