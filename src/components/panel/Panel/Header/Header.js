import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './Header.css'

/**
 * Header Component for the Panel Component.
 * Normally, this component is not used directly,
 * but used by the Panel Component.
 *
 */
const Header = ({
    collapsible = true,
    preTools,
    postTools,
    title,
    toggleCollapse,
    onMouseOver,
    onMouseOut,
    onClose,
    style
}) => {

    return ( 
        <div className = "rolext-panel-header"
            onMouseOver = { onMouseOver }
            onMouseOut = { onMouseOut }
            style = { style } 
        >
        { title } 
        <div style = {
            { flex: 1 } } > </div> { preTools } {
            collapsible &&
                <
                DownOutlined style = {
                    { height: "100%" } }
            className = "rolext-panel-header-collapse-tool rolext-panel-header-tool"
            onClick = { toggleCollapse }
            />
        } {
            onClose &&
                <
                CloseOutlined style = {
                    { height: "100%" } }
            className = "rolext-panel-header-collapse-tool rolext-panel-header-tool"
            onClick = { onClose }
            />
        } { postTools } 
        </div>
    );
};

Header.propTypes = {
    /**
     * If collapsible is true, the header will display 
     * a collapse/expand control that calls the callback
     * function passed in as the toggleCollapse property.
     */
    collapsible: PropTypes.bool,

    /**
     * Arbitrary tools, any element or React component you’d like, 
     * to be shown before the collapse/expand control.
     */
    preTools: PropTypes.node,

    /**
     * Arbitrary tools, any element or React component you’d like, 
     * to be shown in end, after the close control.
     */
    postTools: PropTypes.node,


    /**
     * a title text string
     */
    title: PropTypes.string.isRequired,

    /**
     * A callback function to be called once the
     * user clicks on the expand/collapse control.
     */
    toggleCollapse: PropTypes.func,

    /**
     * A callback function to be called once the
     * mouse is over the Header component.
     */
    onMouseOver: PropTypes.func,

    /**
     * A callback function to be called once the
     * mouse is moved out of the Header component.
     */
    onMouseOut: PropTypes.func,

    /**
     * A callback function to be called once the
     * user clicks in the close control.
     */
    onClose: PropTypes.func,

    /**
     * A CSS Style to render the Header
     */
    style: PropTypes.object
};

export default Header;