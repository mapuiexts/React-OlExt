import { useMemo } from "react";
import { Menu } from "antd"
import ZoomCenterButton from '../../../button/zoom/ZoomCenterButton/ZoomCenterButton';

const ZoomMenu = ({
    map,
    ...otherProps
}) => {

    const items = useMemo(() => {
        return(
            [{
                key: 'ZOOM_CENTER',
                label: <ZoomCenterButton type='text' size="small" map={map} showTooltip={false}>
                        Zoom Center
                       </ZoomCenterButton>
            }]
        );
    }, [map]);

    return(
        <Menu items={items} subMenuCloseDelay={0.05} {...otherProps}/>
    );
};

export default ZoomMenu;