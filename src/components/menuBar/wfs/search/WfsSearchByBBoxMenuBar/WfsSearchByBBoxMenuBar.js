import React from 'react';
import WfsSearchByBBoxButton from '../../../../button/wfs/WfsSearchByBBoxButton/WfsSearchByBBoxButton';

const WfsSearchByBBoxMenuBar = ({
    url,
    layer,
    map,
    wfsOptions
}) => {
    
    return (
        <WfsSearchByBBoxButton 
            type='primary' 
            url={url}
            map={map}
            vectorLayer={layer}
            wfsOptions={wfsOptions}
        >
            Search by BBox
        </WfsSearchByBBoxButton>
    );
};

export default WfsSearchByBBoxMenuBar;