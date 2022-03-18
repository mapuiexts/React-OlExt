import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import ZoomSlider from 'ol/control/ZoomSlider';
import 'ol/ol.css';

/**
 * A slider type of control for zooming.
 * 
 * @visibleName Zoom Slider Control
 */
const ZoomSliderControl = ({
    map,
    options
}) => {

    useEffect(() => {
        const control = new ZoomSlider(options);
        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
    }, [map, options]);

    return (
        <></>
    );
};

ZoomSliderControl.propTypes = {

    /**
     * The OpenLayers ol/Map on where the component
     * will zoom.
     */
    map: PropTypes.instanceOf(Map),

    /**
     * The options for the component. It is 
     * the same used for the openlayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_control_ZoomSlider-ZoomSlider.html">
     * ol/control/ZoomSlider</a>
     */
    options: PropTypes.object

}

export default ZoomSliderControl;



