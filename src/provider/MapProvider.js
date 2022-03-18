import MapContext from '../context/MapContext';
import PropTypes from 'prop-types';
import Map from 'ol/Map';

/**
 * The Map Provider to globally store the map.
 * 
 * @author [Paulo ARAGAO] (<https://github.com/PauloSSAragao>)
 */
const MapProvider = ({map, children}) => {
    return(
        <MapContext.Provider value={map}>
            {children}
        </MapContext.Provider>
    );
};

MapProvider.propTypes = {
    /**
     * The OpenLayers ol/Map
     */
    map: PropTypes.instanceOf(Map).isRequired
};

export default MapProvider;