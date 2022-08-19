
/**
 * Method to refresh the wms layer.
 * This method is normally used after an updated in the database
 * through a wfs transaction request. The refresh will allow
 * the user to see the changes.
 * 
 * @param {ol/Layer} lyr The wms layer to be refreshed
 */
export const  refreshWmsLayer = (lyr) => {
    /*
    var params = lyr.getSource().getParams();
    params.t = new Date().getMilliseconds();
    lyr.getSource().updateParams(params);
    */
    lyr.getSource().updateParams({'TIMESTAMP': Date.now()});
    lyr.getSource().changed();
    lyr.getSource().refresh({force: true});
    
};