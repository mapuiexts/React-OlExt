import SplitPane from 'react-split-pane';
import './BorderLayout.css';


const BorderLayout = (props) => {
    return <SplitPane {...props}>{props.children}</SplitPane>
};

export default BorderLayout;