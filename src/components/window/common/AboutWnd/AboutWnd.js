import Window from '../../base/Window/Window';
import './AboutWnd.css';

const AboutWnd = ({
    title="About",
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
            </div>
      </Window>
    );
};

export default AboutWnd;

