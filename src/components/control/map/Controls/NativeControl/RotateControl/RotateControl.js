import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import Rotate from 'ol/control/Rotate';
import 'ol/ol.css';

/**
 * <p>
 *  A button control to reset rotation to 0. 
 *  To style this control use css selector .ol-rotate. 
 *  A .ol-hidden css selector is added to the button when the rotation is 0.
 * </p>
 * <p>
 *  <strong>Remark:</strong> use Alt + Shift + Drag to rotate the map.
 * </p>
 * 
 * @visibleName Rotate Control
 */
const RotateControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new Rotate(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

RotateControl.propTypes = {

    /**
     * The OpenLayers ol/Map container for the component.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_Rotate-Rotate.html">
     * ol/control/Rotate</a>
     */
    options: PropTypes.object

};

export default RotateControl;