import Window from '../../base/Window/Window';
import './AboutWnd.css';

const AboutWnd = ({
    title="About",
    content="",
    visible=false,
    onOk,
    ...otherProps
}) => {
    return (
        <Window
            title={title}
            collapsible
            onOk={onOk}
            visible={visible}
            {...otherProps}
            //style={{width: 500, height: 500}}
        >
            <div className="rolext-about-wnd">
                <h1>React-OlExt 0.1 Beta</h1>
                <h2>Components for Building Web Map Applications</h2>
                <br/>
                <ul>
                    <li>
                        <label><a rel="noreferrer" href='https://mapuiexts.github.io/react-olext.github.io/en/v0.1/apidoc/' target='_blank' >API Docs</a></label>         
                    </li>
                    <li>
                        <label><a rel="noreferrer" href='https://github.com/mapuiexts/React-OlExt' target='_blank' >Source Code</a></label>
                    </li>
                </ul>
                <div>
                    <p>{content}</p>
                </div>
            </div>
      </Window>
    );
};

export default AboutWnd;

