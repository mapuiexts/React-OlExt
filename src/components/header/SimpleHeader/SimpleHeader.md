<p>This Example shows the SimpleHeader Component located in the top of the map</p>


```js
import {createDefaultMap} from '../../../util/map';
import MapWidget from '../../widget/map/MapWidget/MapWidget';
import SimpleHeader from './SimpleHeader';
import logo from '../../../assets/images/react-olext_logo.svg';

//Create Map
const map = createDefaultMap();

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    {/* The SimpleHeader Component */}
    <SimpleHeader map={map} 
                  style={{height:'15%', background:'linear-gradient(.25turn, black, red)'}} 
                  logo={logo}
                  mainTitle={<div style={{color:'yellow'}}>My App</div>}
                  subTitle="Help Share React-Olext"
    />
    {/* Map Control Component */}
    <MapWidget map={map} height='75%' width='100%'/>
</div>
```