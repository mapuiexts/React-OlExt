import { useMemo } from "react";
import { Menu } from "antd"
import GetDistanceButton from "../../../button/measure/GetDistanceButton/GetDistanceButton";

const MeasureMenu = ({
    map,
    ...otherProps
}) => {

    const items = useMemo(() => {
        return(
            [{
                key: 'GET_DISTANCE',
                label: <GetDistanceButton type='text' size="small" map={map} showTooltip={false}>
                        Get Distance
                       </GetDistanceButton>
            }]
        );
    }, [map]);

    return(
        <Menu items={items} subMenuCloseDelay={0.05} {...otherProps}/>
    );
};

export default MeasureMenu;