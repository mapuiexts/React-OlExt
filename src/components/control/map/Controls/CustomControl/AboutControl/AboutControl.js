import {QuestionOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import CustomControl from '../CustomControl';
import AboutButton from '../../../../../button/common/AboutButton/AboutButton';
import './AboutControl.css';

/**
 * <p>
 *  A control is a visible widget with a DOM element in a fixed 
 *  position on the screen. They can involve user input (buttons), 
 *  or be informational only; the position is determined using CSS. 
 *  By default these are placed in the container with CSS class name
 *  ol-overlaycontainer-stopevent, but can use any outside DOM element.
 * </p>
 * The About Button control will show the <i>About Button component</i> 
 * in the OpenLayers Map's viewport .
 * 
 * @visibleName About Button Control
 */
const AboutControl = ({
    map,
    content = null,
    icon= <QuestionOutlined/>,
    shape="circle",
    options = {
        target: undefined,
        className: 'rolext-about-control'
    },
    children,
    ...otherProps
}) => {
    return (
        <CustomControl map={map} options={options}>
            <AboutButton type="primary" content={content} shape={shape} icon= {icon}  {...otherProps}>
                {children}
            </AboutButton>
        </CustomControl>
    );

};

AboutControl.propTypes = {
    /**
     * The OpenLayers ol/Map container for the component.
     */
     map: PropTypes.instanceOf(Map),

     /**
      * The button's shape
      */
     shape: PropTypes.oneOf(['default', 'circle', 'round']),

     /**
      * The icon component of button
      */
     icon: PropTypes.node,

     /**
      * The options for the component to specify the css class name. 
      */
     options: PropTypes.object
};

export default AboutControl;