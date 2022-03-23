<p>This Example shows the creation of a <i>Panel Control</i>:</p>
<ul>
    <li>The panel is a container component</li>
    <li>Click in the "down/up arrow" to expand/collapse the panel</li>
    <li>The panel can be collapsed and/or closable</li>
    <li>The <i>Window</i> component uses the Panel to provide the child components</li>
</ul>

```js
import Panel from './Panel';

const PanelExample = (props) => {
    return(
        <>
                <Panel title="Better JS Framework" style={{width: 500}} expanded={props.expanded} titleStyle={{ width: '100%', cursor: 'move'}}>
                    <div>
                        <strong>{props.value}</strong>
                        {props.showIcon &&
                            <>
                                <div style={{position:'relative', paddingBottom: 'calc(79.52% + 44px)'}}>
                                    <iframe src='https://gfycat.com/ifr/ImaginativeAdoredBluemorphobutterfly' 
                                            frameborder='0' scrolling='no' width='100%' height='100%'     
                                            style={{position:'absolute', top:0, left:0}} allowfullscreen>
                                    </iframe>
                                </div>
                                <p><a href="https://gfycat.com/discover/snow-man-gifs">from Snow Man GIFs</a></p>
                            </>
                        }
                    </div>
                </Panel>
        </>
    );
};

<>
    <PanelExample value="Vue is better than React!!!!"/>
    <PanelExample value="WTF??? React is better than Vue" expanded={false} />
    <PanelExample value="But belgian beers are better than React, Vue, Angular, Svelte ..." expanded={false} showIcon />
</>

```