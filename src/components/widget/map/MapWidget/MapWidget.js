import React, { useRef, useEffect } from 'react';
import { Map as olMap } from 'ol';
import PropTypes from 'prop-types';
import Controls from '../../../control/map/Controls/Controls';

/**
 * The Map Widget representing the OpenLayers Map.
 * 
 * @visibleName Map
 */
const MapWidget = ({ map, height = "100%", width = "100%", children }) => {
    const mapRef = useRef();

    useEffect(() => {
        map.setTarget(mapRef.current);
        return () => map.setTarget(undefined);

    }, [map]);

    return (<div ref={mapRef}
        style={{ height: height, width: width }}
    >
        {children}
    </div>
    );

};

MapWidget.propTypes = {
    /**
     * The OpenLayers ol/Map
     */
    map: PropTypes.instanceOf(olMap).isRequired,
    /**
     * The height of the map.
     */
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    /**
     * The width of the map.
     */
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

MapWidget.Controls = Controls;

export default MapWidget;