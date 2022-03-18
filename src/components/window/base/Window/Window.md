<p>This Example shows the creation of a <i>Window Component</i>:</p>
<ul>
    <li>The Window is a draggable container component. So it can be dragged to a different position</li>
    <li>The Window uses the <i>Panel</i> component to store the child components</li>
    <li>The Window can be collapsed and/or closable:</li>
    <ul>
        <li>Click in the "down/up arrow" to expand/collapse the window panel</li>
        <li>As shown in the example below, the <i>onClose</i> callback must be implemented to close the window</li>
    </ul>
</ul>

```js
import {useState} from 'react';
import Window from './Window';
import {Button} from 'antd';

//the custom window component
const MyWindow = ({
    onClose,
    ...otherWndProps
}) => {
    return (
        <Window
            title= 'Best Window Ever'
            onClose={onClose}
            {...otherWndProps}
        >
            <div>
                <h2>React-OlExt Components for Building Web Map Applications</h2>
            </div>
      </Window>
    );
};

//the custom button component to show the window
const MyButton = () => {
    const [visibleWnd, setVisibleWnd] = useState(false);

    /**
     * Handler to close the custom Window once the close button
     * on this window is clicked
     */
    const onCloseWindow = () => {
        setVisibleWnd(false);
    };

    /**
     * Handler to show the custom Window once the button is Clicked
     */
    const onShowWindow = () => {
        setVisibleWnd(true);
    };

    return (
        <>
            <Button onClick={onShowWindow} type="primary">Show Window...</Button>
            {visibleWnd && <MyWindow onClose={onCloseWindow} visible={visibleWnd}/>}
        </>
    );
};

<MyButton/>
```