import {useCallback, useState, useRef} from 'react';
import {Space, Select, Input, Button} from 'antd'
import Window from '../../base/Window/Window';
import {getCoordinateLabel, coordinateToString} from '../../../../util/map';

const CoordinateWnd = ({
    title="Coordinate",
    visible=true,
    onClose,
    map,
    coordinate,
    coordinateProj = map.getView().getProjection(),
    projs=[map.getView().getProjection()],
    style
    
}) => {


    const inputCoordinateEl = useRef(null);
    const [curProjCode, setCurProjCode] = useState(map.getView().getProjection().getCode());
    const [curStrCoordinate, setCurStrCoordinate] = useState(coordinateToString(coordinate, coordinateProj.getCode(), coordinateProj.getCode()));

    /**
     * Handler called once the projection is changed in the combo box
     */
    const onProjChangeHandler = useCallback((value) => {
        setCurProjCode(value);
        setCurStrCoordinate(coordinateToString(coordinate, coordinateProj.getCode(), value));
    }, [coordinate, coordinateProj]);

    const onCoordinateChangeHandler = (value) => {
        setCurStrCoordinate(value.target.value);
    }

    /**
     * Method to copy the coordinate to clipboard once the user 
     * click in "copy" button
     */
    const onCopyHandler = useCallback(() => {
        const inputEl = inputCoordinateEl.current;
        inputEl.select();
        inputEl.setSelectionRange(0, 99999); //for mobile devices
        /* Copy the text inside the text field */
        document.execCommand("copy");
    }, []);

    
    return (
        <Window
            title={title}
            collapsible
            onClose={onClose}
            visible={visible}
            style={style}
            //style={{width: 500, height: 500}}
        >
            <Space direction="vertical">
                <Select 
                    // defaultValue={map.getView().getProjection().getCode()}
                    //defaultValue={curProjCode}
                    defaultValue={coordinateProj.getCode()}
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
                <div style={{display:'flex', gap:5}}>
                    <Input
                        addonBefore={getCoordinateLabel(curProjCode)}
                        ref={inputCoordinateEl}
                        style={{width:400}}
                        value={curStrCoordinate}
                        onChange={onCoordinateChangeHandler}
                    />
                    <Button type="primary" onClick={onCopyHandler}>Copy</Button>
                </div>
            </Space>
      </Window>
    );
};

export default CoordinateWnd;