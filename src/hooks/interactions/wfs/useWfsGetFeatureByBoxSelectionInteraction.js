import {useCallback, useEffect, useMemo} from 'react';
import {bbox} from 'ol/format/filter';
import useGetBoxSelectionGeomInteraction from '../geometry/useGetBoxSelectionGeomInteraction';
import useWfsGetFeature from '../../../hooks/wfs/useWFSGetFeature';
import defined from '../../../core/defined';

/** this interaction will retrieve a point from the user and 
 *  retrieve all the features intersected by the point through
 *  a WFS GetFeature request.
 * 
 * @param {ol/Map} map The map where the retrieved features will be added
 * @param {String} url The url for the WFS Server
 * @param {String} msg The message to show during the location selection
 * @param {Object} wfsOptions  the wfs options
 * @param {Array} vectorLayer the vector layer where the features will be added
 * @param {Object} fetchOptions the optional options for the fetch command
 * @returns {start, features, isRunning, error}
 */
const useWfsGetFeatureByBoxSelectionInteraction = (map, url, msg, wfsOptions, size, vectorLayer, fetchOptions) => {

    const {geometryName, /*srsName*/} = wfsOptions;
    const interaction = useGetBoxSelectionGeomInteraction(map, msg, size, null);
    const wfsGetFeature = useWfsGetFeature();


    //retrieve the srs from map
    const proj = map.getView().getProjection();
    let srsName = proj.getCode();
    const axisOrientation = proj.getAxisOrientation();
    if(axisOrientation === 'neu') srsName = 'urn:x-ogc:def:crs:' + srsName;
    const wfsFilteredOptions = useMemo(() => {
        return {...wfsOptions, srsName}
    }, [wfsOptions, srsName]);

    /**
     * Start the interaction to click the point location
     */
    const start = useCallback(() => {
        interaction.start();
    }, [interaction]);

    /**
     * Effect to send wfs request once the location is retrieved
     */
    useEffect(() => {
        if(defined(interaction.bbox) && !interaction.isRunning) {
            const geomName = defined(geometryName) ? geometryName : 'geometry';
            //clear layer
            vectorLayer.getSource().clear();
            //create wfs filter
            const extent = interaction.bbox;
            const filter = bbox(
                geomName, 
                extent,
                srsName
            );
            wfsFilteredOptions.filter = filter;
            console.log('sending request');
            wfsGetFeature.sendRequest(url, map, vectorLayer, wfsFilteredOptions, fetchOptions);
            interaction.clear();
        }

    }, [interaction, vectorLayer, fetchOptions, geometryName, map, srsName, url, wfsGetFeature, wfsFilteredOptions]);

    /**
     * Effect to be executed if the user cancel the selection in the map
     * using the <esc> key.
     */
    useEffect(() => {
        if(interaction.bbox === undefined && !interaction.isRunning) {
            console.log('cancelled');
            interaction.clear();
        }

    }, [interaction]);

    return {
        start,
        clear: wfsGetFeature.clearRequest,
        features: wfsGetFeature.features,
        isRunning: interaction.isRunning || wfsGetFeature.isLoading,
        error: wfsGetFeature.error
    };

};

export default useWfsGetFeatureByBoxSelectionInteraction;