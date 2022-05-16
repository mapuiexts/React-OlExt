<p>Click in the About Button to see the result:</p>

```js
import {useMemo} from 'react';
import AboutButton from './AboutButton';

const AboutButtonExample = () => {
    const content = useMemo(() => {
        return(
            <div>
                <p><strong>My About Button Example</strong></p>
                <p style={{color:"cyan"}}>Please, check more in the documentation about this amazing library!!!</p>
            </div>
        );
    });
    return(
        <AboutButton type="primary" content={content}> About</AboutButton>
    );
}

<AboutButtonExample/>
```