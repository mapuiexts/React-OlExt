import React from 'react';
import WfsSearchByPolygonButton from '../../../../button/wfs/WfsSearchByPolygonButton/WfsSearchByPolygonButton';

const WfsSearchByPolygonMenuBar = ({
    url,
    layer,
    map,
    wfsOptions
}) => {
    
    return (
        <WfsSearchByPolygonButton 
            type='primary' 
            url={url}
            map={map}
            vectorLayer={layer}
            wfsOptions={wfsOptions}
        >
            Search by Polygon
        </WfsSearchByPolygonButton>
    );
};

export default WfsSearchByPolygonMenuBar;