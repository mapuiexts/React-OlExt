import React from 'react';
import WfsSearchByPointButton from '../../../../button/wfs/WfsSearchByPointButton/WfsSearchByPointButton';


const WfsSearchByPointMenuBar = ({
    url,
    layer,
    map,
    wfsOptions
}) => {
    
    return (
        <WfsSearchByPointButton 
            type='primary' 
            url={url}
            map={map}
            vectorLayer={layer}
            wfsOptions={wfsOptions}
        >
            Search by Point
        </WfsSearchByPointButton>
    );
};

export default WfsSearchByPointMenuBar;