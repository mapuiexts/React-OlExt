import { useCallback, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import Collection from 'ol/Collection';
import defined from '../../../../core/defined';
import useWfsGetFeatureByBoxSelectionInteraction from '../../../../hooks/interactions/wfs/useWfsGetFeatureByBoxSelectionInteraction';
import useTranslateInteraction from '../../../../hooks/interactions/modify/useTranslateInteraction';
import useWfstWriteTransaction from '../../../../hooks/wfst/useWfstWriteTransaction';
import {refreshWmsLayer} from '../../../../core/wmsLayer';


/**
 * Button to translate feature(s) selected by the user through a 
 * WFS Transaction call.
 * @visibleName WFST Translate Features Button
 */
const WfstTranslateFeaturesButton = ({
    map,
    selectMsg = "Select feature to translate",
    translateMsg="Drag and Drop selected features",
    url,
    wmsLayer,
    vectorLayer,
    wfsOptions,
    fetchOptions = null,
    children, 
    ...otherProps
}) => {
    const size = 10;
    const selectInteraction = useWfsGetFeatureByBoxSelectionInteraction(map, url, selectMsg, wfsOptions, size, vectorLayer, fetchOptions);
    const interaction = useTranslateInteraction(map, translateMsg);
    const wfst = useWfstWriteTransaction();
    const translatedFeaturesRef = useRef(null);

    /**
     * Handler called once the user clicks in the 
     * "Translate" button. At this point the system
     * will request the user the position to select the feature
     * to be translated
     */
    const onClickHandler = useCallback((event) => {
        selectInteraction.start();
    }, [selectInteraction]);

    /**
     * Method executed once the feature(s) is retrieved from 
     * the position provided by the user input.
     * This method will request the user to translate the
     * previously selected feature(s)
     */
     useEffect(() => {
        if(defined(selectInteraction.features)) {
            if(selectInteraction.features.length > 0) {
                const featureCol = new Collection();
                selectInteraction.features.forEach((feature) => {
                    featureCol.push(feature);
                });
                interaction.start({features: featureCol});
            }
            else {
                message.info('feature not found');
            }
            selectInteraction.clear();
        }
    }, [selectInteraction, interaction]);


    /**
     * Method executed after the user has translated the features.
     * This method will update in the database the new position of
     * the translated features.
     */
    useEffect(() => {
        //response from interaction is returned with all translated features
        if(defined(interaction.translatedFeatures) ) {
            if(interaction.translatedFeatures.getLength() > 0) {
                interaction.translatedFeatures.forEach((feature) => {
                    const geom = feature.getGeometry();
                    feature.setGeometryName(wfsOptions.geometryName);
                    feature.setGeometry(geom);
                    feature.set('geometry', undefined);
                });
                //send wfst request
                wfst.sendRequest(url, null, interaction.translatedFeatures, null, wfsOptions);
            }
            translatedFeaturesRef.current =  interaction.translatedFeatures
            interaction.clear();
        }

    }, [wfst, interaction, url, wfsOptions]);

    /**
     * This method is executed after the position is updated in 
     * the database.
     * This method will refresh the wms layer to reflect in the 
     * map the translated feature(s) 
     */
    useEffect(() => {
        //response from transaction is returned
        if(!wfst.isLoading && defined(wfst.data) ) {
            wfst.clearRequest();
            defined(wmsLayer) && refreshWmsLayer(wmsLayer);
            //remove translated features from vector layer
            if(defined(translatedFeaturesRef.current)) {
                translatedFeaturesRef.current.forEach((feature) => {
                    vectorLayer.getSource().removeFeature(feature);
                });
                translatedFeaturesRef.current = null;
            }
        }

    }, [wfst, wmsLayer, vectorLayer]);

    /**
     * This method is executed it the update in the database fails. 
     * This method will provide a message error and remove the 
     * features from the vector layer 
     */
    useEffect(() => {
        //response error from transaction is returned
        if(!wfst.isLoading && defined(wfst.error) ) {
             message.info(wfst.error);
            wfst.clearRequest();
            //remove translated features from vector layer
            if(defined(translatedFeaturesRef.current)) {
                translatedFeaturesRef.current.forEach((feature) => {
                    vectorLayer.getSource().removeFeature(feature);
                });
                translatedFeaturesRef.current = null;
            }
        }

    }, [wfst, interaction, vectorLayer]);

    return (
        <Button {...otherProps} onClick={onClickHandler}>
            {children}
        </Button>
    );
};

export default WfstTranslateFeaturesButton;