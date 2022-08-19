import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import MousePosition from 'ol/control/MousePosition';
import 'ol/ol.css';

/**
 * A control to show the 2D coordinates of the mouse cursor. 
 * By default, these are in the view projection, but can be in any supported projection
 * 
 * @visibleName Mouse Position Control
 */
const MousePositionControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new MousePosition(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

MousePositionControl.propTypes = {

    /**
     * The OpenLayers ol/Map container for the component.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_MousePosition-MousePosition.html">
     * ol/control/MousePosition</a>
     */
    options: PropTypes.object

};

export default MousePositionControl;