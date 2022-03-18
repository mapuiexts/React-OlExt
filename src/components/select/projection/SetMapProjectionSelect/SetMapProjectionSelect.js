import PropTypes from 'prop-types';


/**
 * Select component to set the map projection (CRS) once the user selects
 * the projection.
 * 
 * @visibleName Set Map Projection Select 
 */
const SetMapProjectionSelect = ({
    map,
    url = 'https://epsg.io/',
    placeholder = "Please, select a projection",
    ...otherProps
}) => {

};

SetMapProjectionSelect.propTypes = {
    /**
     * The OpenLayers ol/Map on which the selected projection
     * will be set.
     */
    map: PropTypes.instanceOf(Map).isRequired

}

export default SetMapProjectionSelect;