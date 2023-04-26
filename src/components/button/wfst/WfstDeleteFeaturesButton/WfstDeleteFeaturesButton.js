import React, {useCallback, useEffect, useRef} from 'react';
import Collection from 'ol/Collection';
import { Button, Modal, message } from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import useWfsGetFeatureByBoxSelectionInteraction from '../../../../hooks/interactions/wfs/useWfsGetFeatureByBoxSelectionInteraction';
import useWfstWriteTransaction from '../../../../hooks/wfst/useWfstWriteTransaction'
import defined from '../../../../core/defined';
import {refreshWmsLayer} from '../../../../core/wmsLayer';

/**
 * Button to delete feature(s) selected by the user through a 
 * WFS Transaction call.
 * @visibleName WFST Delete Features Button
 */
const WfstDeleteFeaturesButton = ({
    map,
    url,
    wmsLayer,
    vectorLayer,
    wfsOptions,
    fetchOptions,
    children, 
    ...otherProps
}) => {

    const msg = "Select object to delete or &lt;esc&gt; to cancel"
    const size = 10;

    const selectedFeatureRef = useRef(null);
    const interaction = useWfsGetFeatureByBoxSelectionInteraction(map, url, msg, wfsOptions, size, vectorLayer, fetchOptions);
    const wfst = useWfstWriteTransaction();

    /**
     * Show the confirm dialog box requesting if the user 
     * really wants to delete the feature
     */
     const showConfirmDialog = useCallback(() => {
        Modal.confirm({
            title: 'Delete Feature',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete the selected features(s)',
            //Handler called once the user clicks the OK button.
            //This handler will send the wfst request to update the pole
            onOk: () => {
                const deletedFeatures = new Collection();
                deletedFeatures.push(selectedFeatureRef.current);
                wfst.sendRequest(url, null, null, deletedFeatures, wfsOptions);
            },
            // Handler called once the user click the close 
            // button in the "Update Pole" dialog box.
            // The window will be closed
            onCancel: () => {
                vectorLayer.getSource().removeFeature(selectedFeatureRef.current);
                selectedFeatureRef.current = null;
            },
        })
    }, [wfst, url, wfsOptions, vectorLayer]);

    /**
     * Handler called once the user clicks in the 
     * "Delete" button. At this point the system
     * will request the user the position to select the feature
     * to be deleted
     */
    const onClickHandler = useCallback((event) => {
        interaction.start();
    }, [interaction]);

    /**
     * Method executed once the feature(s) is retrieved from 
     * the position provided by the user input
     */
    useEffect(() => {
        if(defined(interaction.features)) {
            if(interaction.features.length > 0) {
                selectedFeatureRef.current = interaction.features[0];
                showConfirmDialog();
            }
            else {
                message.info('pole not found');
            }
            interaction.clear();
        }
    }, [interaction, showConfirmDialog]);


    

    /**
     * Show the confirm dialog once the feature(s) is retrieved
     * from user selection
     */
    /*
    useEffect(() => {
        if(defined(selectedFeature)) {
            showConfirmDialog();
        }

    }, [selectedFeature, showConfirmDialog]);
    */

     /**
     * Method returned once the feature is deleted in the database
     * The wms layer is refreshed to remove the deleted feature
     * from the wms layer
     */
      useEffect(() => {
        //response from transaction is returned
        if(!wfst.isLoading && defined(wfst.data) ) {
            wfst.clearRequest();
            defined(wmsLayer) && refreshWmsLayer(wmsLayer);
            vectorLayer.getSource().removeFeature(selectedFeatureRef.current);
            selectedFeatureRef.current = null;
        }

    }, [wfst, wmsLayer, vectorLayer]);

    /**
     * method returned if a error is reported during
     * the delete operation in the database
     */
     useEffect(() => {
        //response error from transaction is returned
        if(!wfst.isLoading && defined(wfst.error) ) {
            message.info(wfst.error);
            wfst.clearRequest();
            selectedFeatureRef.current = null;
        }

    }, [wfst]);

    return (
        <React.Fragment>
            <Button {...otherProps} onClick={onClickHandler}>
                {children}
            </Button>
        </React.Fragment>
    );
};

export default WfstDeleteFeaturesButton;