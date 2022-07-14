import {useCallback, useEffect} from 'react';
import {intersects} from 'ol/format/filter';
import useGetPointGeomInteraction from '../useGetPointGeomInteraction';
import useWfsGetFeature from  '../../wfs/useWFSGetFeature';
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
 * @returns 
 */
const useWfsGetFeatureByPointInteraction = (map, url, msg, wfsOptions, vectorLayer, fetchOptions) => {

    const {geometryName, /*srsName*/} = wfsOptions;
    const interaction = useGetPointGeomInteraction(map, msg);
    const wfsGetFeature = useWfsGetFeature();


    //retrieve the srs from map
    const proj = map.getView().getProjection();
    let srsName = proj.getCode();
    const axisOrientation = proj.getAxisOrientation();
    if(axisOrientation === 'neu') srsName = 'urn:x-ogc:def:crs:' + srsName;
    wfsOptions.srsName = srsName;

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
        if(defined(interaction.geometry) && !interaction.isRunning) {
            const geomName = defined(geometryName) ? geometryName : 'geometry';
            //clear layer
            vectorLayer.getSource().clear();
            //create filter
            const geom = interaction.geometry;
            const filter = intersects(
                geomName, 
                geom,
                srsName
            );
            const wfsFilteredOptions = {...wfsOptions, filter};
            wfsGetFeature.sendRequest(url, map, vectorLayer, wfsFilteredOptions, fetchOptions);
            interaction.clear();
        }

    }, [interaction, vectorLayer, fetchOptions, geometryName, map, srsName, url, wfsGetFeature, wfsOptions]);

    return {
        start,
        clear: wfsGetFeature.clearRequest,
        features: wfsGetFeature.features,
        isRunning: interaction.isRunning || wfsGetFeature.isLoading,
        error: wfsGetFeature.error
    };

};

export default useWfsGetFeatureByPointInteraction;