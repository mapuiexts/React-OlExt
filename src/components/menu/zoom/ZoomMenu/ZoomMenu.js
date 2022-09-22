import { useMemo } from "react";
import { Menu } from "antd"
import ZoomCenterButton from '../../../button/zoom/ZoomCenterButton/ZoomCenterButton';

const ZoomMenu = ({
    map,
    projs,
    defaultScaleDenominator = 500,
    defaultProjCode= map.getView().getProjection().getCode(),
    ...otherProps
}) => {

    const items = useMemo(() => {
        return(
            [{
                key: 'ZOOM_CENTER',
                label: <ZoomCenterButton 
                            type='text' size="small" 
                            map={map}
                            projs={projs}
                            defaultScaleDenominator={defaultScaleDenominator}
                            defaultProjCode={defaultProjCode}
                        >
                        Zoom Center
                       </ZoomCenterButton>
            }]
        );
    }, [map, defaultProjCode, defaultScaleDenominator, projs]);

    return(
        <Menu items={items} subMenuCloseDelay={0.05} {...otherProps}/>
    );
};

export default ZoomMenu;