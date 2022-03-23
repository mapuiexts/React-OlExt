<p>Example showing how to use the CurrentCoordinate Text component:</p>
<li>The <i>CurrentCoordinate Text</i> will show the coordinate of the mouse for the current map projection:</li>
<li>If the user checks the checkbox, the <i>CurrentCoordinate Text</i> will have a custom format function in the parameter</li>

```js
import {useCallback, useState} from 'react';
import {Space, Checkbox} from 'antd';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import CurrentCoordinateText from './CurrentCoordinateText';
import MapProjectionSelect from '../../../select/projection/MapProjectionSelect/MapProjectionSelect';
import {get as getProjection} from 'ol/proj';
import {format as coordinateFormat} from 'ol/coordinate';


const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};

//create map and vector layer
const map = createDefaultMap(viewOpts);
const projs= [getProjection('EPSG:31370'), getProjection('EPSG:4326')];


//custom component
const CurrentCoordinateTextExample = () => {

    const [useCustomFormatFunction, setUseCustomFormatFunction] = useState(false);
    const [textStyle, setTextStyle] = useState({color: 'blue', fontWeight:'bold', padding: '5px'});
    //function to format the string
    const fmtFunc = useCallback((coord) => {
        const template = 'Coord X={x}, Coord Y={y}';
        return coordinateFormat(coord, template, 4);
    }, []);

    //event handler called to set the variables  if the user check/uncheck the checkbox control
    const onUseCustomFormatCheckBox = (evt) => {
        if(evt.target.checked) {
            setUseCustomFormatFunction(true);
            setTextStyle({color: 'red', fontWeight:'bold', padding: '5px'});
        }
        else {
            setUseCustomFormatFunction(false);
            setTextStyle({color: 'blue', fontWeight:'bold', padding: '5px'});
        }
    };

    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <Space style={{width:'100%'}}>
                <MapProjectionSelect map={map} projs={projs} style={{width:150}}/>
                <Checkbox onChange={onUseCustomFormatCheckBox} checked={useCustomFormatFunction}>Use Custom Format</Checkbox>
                <CurrentCoordinateText map={map} coordinateFormatFunc={(useCustomFormatFunction ? fmtFunc : null)} style={textStyle}/>
            </Space>
            <MapWidget map={map} height='90%' width='100%'/>
        </div>
    );
};

<CurrentCoordinateTextExample/>
```