import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import Collection from 'ol/Collection';
import Map from 'ol/Map';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import defined from '../../../../core/defined';
import useTranslateInteraction from '../../../../hooks/interactions/modify/useTranslateInteraction';
import useWfstWriteTransaction from '../../../../hooks/wfst/useWfstWriteTransaction';
import {refreshWmsLayer} from '../../../../core/wmsLayer';

/**
 * Button to translate the selected feature(s) in the grid.
 * After this operation, the selected feature(s) will be translated
 * and its coordinated will be updated in the database.
 * @visibleName WFST Translate Selected Features Button
 */
const WfstTranslateSelectedFeaturesButton = ({
    map,
    msg="Drag and Drop selected features",
    url,
    wmsLayer,
    vectorLayer,
    wfsOptions,
    gridApi, 
    children, 
    ...otherProps
}) => {
    const interaction = useTranslateInteraction(map, msg);
    const [sendRequest, clearRequest, isLoading, data, error] = useWfstWriteTransaction();
    const translatedFeaturesRef = useRef(null);
    
     /**
     * Handler called once the user clicks in the 
     * "Move Pole" button. At this point the system
     * will request the user to move the pole
     */
    const onClickHandler = useCallback(() => {
        const selectedRows = gridApi.getSelectedRows();
        const features = selectedRows.map(row => row.__feature);
        if(defined(features) && features.length > 0) {
            const featureCol = new Collection();
            features.forEach((feature) => {
                featureCol.push(feature);
            });
            interaction.start({features: featureCol});
        }
    }, [interaction, gridApi]);

    useEffect(() => {
        //response from interaction is returned with all translated features
        if(defined(interaction.translatedFeatures) ) {
            console.log('translated features', interaction.translatedFeatures);
            if(interaction.translatedFeatures.getLength() > 0) {
                interaction.translatedFeatures.forEach((feature) => {
                    const geom = feature.getGeometry();
                    feature.setGeometryName(wfsOptions.geometryName);
                    feature.setGeometry(geom);
                    feature.set('geometry', undefined);
                });
                //send wfst request
                sendRequest(url, null, interaction.translatedFeatures, null, wfsOptions);
            }
            translatedFeaturesRef.current =  interaction.translatedFeatures
            interaction.clear();
        }

    }, [interaction, sendRequest, url, wfsOptions]);

    useEffect(() => {
        //response from transaction is returned
        if(!isLoading && defined(data) ) {
            console.log('transaction finished', data);
            clearRequest();
            defined(wmsLayer) && refreshWmsLayer(wmsLayer);
            //remove translated features from vector layer
            if(defined(translatedFeaturesRef.current)) {
                translatedFeaturesRef.current.forEach((feature) => {
                    vectorLayer.getSource().removeFeature(feature);
                });
            }
        }

    }, [clearRequest, data, isLoading, wmsLayer, interaction, vectorLayer]);

    useEffect(() => {
        //response error from transaction is returned
        if(!isLoading && defined(error) ) {
            console.log('transaction failed', error);
            message.info(error);
            clearRequest();
            //defined(wmsLayer) && refreshWmsLayer(wmsLayer);
            //remove translated features from vector layer
            interaction.translatedFeatures.forEach((feature) => {
                vectorLayer.getSource().removeFeature(feature);
            });
        }

    }, [clearRequest, error, isLoading, wmsLayer, interaction, vectorLayer]);

    return (
        <Button {...otherProps} onClick={onClickHandler}>
            {children}
        </Button>
    );
};

WfstTranslateSelectedFeaturesButton.propTypes = {

    /**
     * The ol/Map
     */
    map: PropTypes.instanceOf(Map).isRequired,

    /*
     * The tooltip message to be show once the user starts the operations
     */
    msg: PropTypes.string,

    /**
     * The url used for the WFS request
     */
     url: PropTypes.string.isRequired,

    /**
      * The wms layer for the deleted feature.
      * If provided, the map will be refreshed to 
      * reflect the deleted features in the map.
      */
     wmsLayer: PropTypes.instanceOf(Layer),

    /**
      * The vector Layer on where the deleted features are stored.
      * After the deletion in the database, these features will
      * be removed from the vector layer
      */
     vectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,

    /**
     * The WFS options for the WFST WriteTransaction request.
     * This object has the same format as used in the OpenLayers 
     * <a href="https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html#writeTransaction">
     * ol/format/WFS.writeTransaction</a> method.
     */
    wfsOptions: PropTypes.object.isRequired,

    /**
     * The Grid Api for <a href="https://www.ag-grid.com/react-grid/grid-api/">Ag-Grid</a>.
     */
     gridApi: PropTypes.any,

    /**
     * The child node for the button
     */
    children: PropTypes.node
};

export default WfstTranslateSelectedFeaturesButton;