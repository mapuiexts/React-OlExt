<p>Example to show the usage of <i>Get Projection AutoComplete</i>:</p>
<ul>
    <li>
        The initial value is the belgium lambert projection (code 31370) 
        specified in the parameter <i>defaultValue</i> for the component
        <i>GetProjectionAutoComplete</i>
    </li>
    <li>Enter, for instance, a projection code, like "4326"</li>
    <li>The component will show the <i>projection name</i> "WGS 84"</li>
    <li>Select the projection name "WGS 84"</li>
    <li>The projection details for the selected projection
        will be shown in the text area through the implementation
        of the <i>onSelectProjection</i> handler.
    </li>

</ul>


```js
import {useState} from 'react';
import {Input} from 'antd';
import GetProjectionAutoComplete from './GetProjectionAutoComplete';


const GetProjectionAutoCompleteExample = () => {
    const onSelectProjection = (value, projObj, proj) => {
        console.log('Selected Projection Object', projObj);
        console.log('Selected ol/Projection', proj);
        setProjection(projObj);
    };

     const onClearProjection = () => {
        console.log('Projection cleared');
        setProjection(null);
    };

    const [projection, setProjection ] = useState(null);

    return (
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <GetProjectionAutoComplete 
                style={{width:'20%'}} 
                onSelectProjection = {onSelectProjection}
                onClearProjection = {onClearProjection}
                defaultValue="31370"
            />
            <Input.TextArea 
                style={{height:'80%'}}
                value={projection ? JSON.stringify(projection, null, '\t') : null}
            />

        </div>
    );
};
<GetProjectionAutoCompleteExample/>

```