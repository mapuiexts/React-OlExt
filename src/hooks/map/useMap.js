import {useContext} from 'react';
import MapContext from '../context/MapContext';

/**
 * Hook to retrieve the global ol/Map.
 * @visibleName useMap Hook 
 * @public
 * 
 */
const useMap = () => {
    return useContext(MapContext);
};


export default useMap;
