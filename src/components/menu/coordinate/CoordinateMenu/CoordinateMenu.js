import { useMemo } from "react";
import { Menu } from "antd"
import GetCoordinateButton from '../../../button/coordinate/GetCoordinateButton/GetCoordinateButton';
import GoToCoordinateButton from '../../../button/coordinate/GoToCoordinateButton/GoToCoordinateButton';

const CoordinateMenu = ({
    map,
    wndProps = {style: {width:'32rem'}},
    projs,
    defaultProjCode= map.getView().getProjection().getCode(),
    defaultScaleDenominator = 500,
    ...otherProps
}) => {

    const items = useMemo(() => {
        return(
            [
                {
                    key:    'GET_COORDINATE',
                    label:  <GetCoordinateButton 
                                type='text' 
                                size="small" 
                                map={map} 
                                wndProps = {wndProps}
                                projs = {projs}
                                defaultProjCode={defaultProjCode}
                                //defaultScaleDenominator = {defaultScaleDenominator}
                                //showTooltip={false}
                            >
                                Get Coordinate
                            </GetCoordinateButton>
                },
                {
                    key:    'GOTO_COORDINATE',
                    label:  <GoToCoordinateButton 
                                type='text' 
                                size="small" 
                                map={map} 
                                wndProps = {wndProps}
                                projs = {projs}
                                defaultProjCode={defaultProjCode}
                                defaultScaleDenominator = {defaultScaleDenominator}
                                //showTooltip={false}
                            >
                                Go To Coordinate
                            </GoToCoordinateButton>
                }
        ]
        );
    }, [map, defaultScaleDenominator, projs, wndProps, defaultProjCode]);

    return(
        <Menu items={items} subMenuCloseDelay={0.05} {...otherProps}/>
    );
};

export default CoordinateMenu;