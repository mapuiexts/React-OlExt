<p>This Example shows the Header Component located in the top of the map</p>
<p>
    Also you can find <i>CurrentCoordinateText</i> and <i>CurrentScaleText</i> components
     inside the <i>Header</i>. Check in this documentation how to use them.
</p>

```js
import {createDefaultMap} from '../../../util/map';
import MapWidget from '../../widget/map/MapWidget/MapWidget';
import CurrentCoordinateText from '../../text/coordinate/CurrentCoordinateText/CurrentCoordinateText';
import CurrentScaleText from '../../text/scale/CurrentScaleText/CurrentScaleText';
import Header from './Header';
import logo from '../../../assets/images/react-olext_logo.svg';

//Create Map
const map = createDefaultMap();


<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    {/* The Header Component */}
    <Header style={{height:'15%'}}>
        <Header.Logo logo={logo}/>
        <Header.Title>
            <Header.Title.MainTitle>React-Olext</Header.Title.MainTitle>
            <Header.Title.SubTitle>Components for OpenLayers</Header.Title.SubTitle>
        </Header.Title>
        <Header.Content>
            <div>Pos:</div>
            <CurrentCoordinateText map={map} style={{color:"white", width:"160px"}}/>
            <div>Scale: 1/</div>
            <CurrentScaleText map={map} style={{color:"white", width:"100px"}}/>
        </Header.Content>
    </Header>
    {/* Map Component */}
    <MapWidget map={map} height='75%' width='100%'/>
</div>
```