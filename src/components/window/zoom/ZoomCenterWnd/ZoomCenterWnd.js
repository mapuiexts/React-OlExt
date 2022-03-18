import {useState, useCallback} from 'react';
import Window from '../../../window/base/Window/Window.js'
import {Space, Select, Input, InputNumber, Button} from 'antd';
import {get as getProjection} from 'ol/proj/projections';
import {transform} from 'ol/proj';
import {getCoordinateLabel, coordinateToString, stringToCoordinate, zoomCenter} from '../../../../util/map';


const ZoomCenterWnd = ({
    title="Zoom Center",
    visible=true,
    onClose,
    map,
    defaultScale = 500,
    projs=[map.getView().getProjection()],
    style,
}) => {

    const [curProjCode, setCurProjCode] = useState(map.getView().getProjection().getCode());
    const [curStrCoordinate, setCurStrCoordinate] = useState(undefined);
    const [curScale, setCurScale] = useState(defaultScale);

    /**
     * Handler called once the projection is changed in the combo box
     */
    const onProjChangeHandler = useCallback((value) => {
        //parse x and y values from input
        const oldCoordinate = stringToCoordinate(curStrCoordinate, curProjCode);
        if(oldCoordinate)
            setCurStrCoordinate(coordinateToString(oldCoordinate, curProjCode, value))
        else
            setCurStrCoordinate(undefined);
        setCurProjCode(value);
    }, [curProjCode, curStrCoordinate]);

    const onCoordinateChangeHandler = (value) => {
        setCurStrCoordinate(value.target.value);
    };

    const onScaleChangeHandler = (value) => {
        setCurScale(value);
    };

    const onZoomHandler = useCallback(() => {
        let coordinate = stringToCoordinate(curStrCoordinate, curProjCode);
        const mapProjCode = map.getView().getProjection().getCode();
        if(coordinate) {
            if(curProjCode !== mapProjCode) {
                coordinate = transform(coordinate, curProjCode, mapProjCode);
            }
            zoomCenter(map, curScale, coordinate[0], coordinate[1]);
        }

    }, [map, curProjCode, curStrCoordinate, curScale]);


    return (
        <Window
            title={title}
            collapsible
            onClose={onClose}
            visible={visible}
            style={style}
        >
            <Space direction="vertical">
            <Select 
                    defaultValue={curProjCode}
                    onChange={onProjChangeHandler}
                >
                    {projs.map((proj) => {
                        return (
                            <Select.Option key={proj.getCode()} value={proj.getCode()}>
                                {proj.getCode()}
                            </Select.Option>
                        );
                    })}
                </Select>
                <Input
                    addonBefore={getCoordinateLabel(curProjCode)}
                    placeholder={
                        getProjection(curProjCode).getAxisOrientation() !== 'neu'? 'X, Y': 'Y, X'
                    }
                    style={{width:400}}
                    value={curStrCoordinate}
                    onChange={onCoordinateChangeHandler}
                />
                <InputNumber
                    //addonBefore="1/:"
                    defaultValue={defaultScale}
                    value={curScale}
                    step={100}
                    min={10}
                    formatter={(value) => { 
                        return `1/${value}`;
                    }}
                    parser={(value) => { 
                        if(value &&  value.split('/').length === 2) {
                            return value.split('/')[1].trim();
                        }
                        return undefined;
                    }}
                    placeholder="1/Scale"
                    onChange={onScaleChangeHandler}
                    style={{width:400}}
                />
                <Button type="primary" onClick={onZoomHandler}>Zoom</Button>
            </Space>
        </Window>

    );
};

export default ZoomCenterWnd;