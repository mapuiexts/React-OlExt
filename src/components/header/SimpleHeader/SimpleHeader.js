import PropTypes from 'prop-types';
import {Map as olMap} from 'ol';
import Header from '../Header/Header';
import app_logo from '../../../assets/images/react-olext_logo.svg';
import CurrentCoordinateText from '../../text/coordinate/CurrentCoordinateText/CurrentCoordinateText';
import CurrentScaleText from '../../text/scale/CurrentScaleText/CurrentScaleText';
import useWindowSize from '../../../hooks/ui/useWindowSize';
import {convertRemToPixels} from '../../../core/deviceUnits';
import {API_DOC_LINK} from '../../../core/constants';

/**
 * <p>
 *  A simple Header for the application with a logo, title, subtitle, 
 *  current coordinate and current scale
 * </p>
 * <p>
 *  To build a custom header, check the <i>Header</i> component.
 * </p>
 *
 */
const SimpleHeader = ({
    map,
    style,
    logo = app_logo,
    mainTitle = (<a href={API_DOC_LINK} target="_blank" 
                    rel="noopener noreferrer" title="React-Olext API Doc"
                 >
                    React-Olext
                 </a>),
    subTitle='Components for OpenLayers',
    breakpoint=convertRemToPixels(40),
    ...otherProps
}) => {
    const { width } = useWindowSize();
    const logoHeight = style && style.height ? style.height : undefined;
    const styleMainTitle = width <= breakpoint ? {fontSize:'1.5rem'} : null;

    return(
        <Header style={style} {...otherProps}>
        <Header.Logo logo={logo} height={logoHeight}/>
        <Header.Title>
            <Header.Title.MainTitle style={styleMainTitle}>{mainTitle}</Header.Title.MainTitle>
            { width > breakpoint &&
                <Header.Title.SubTitle>{subTitle}</Header.Title.SubTitle>
            }
        </Header.Title>
        { width > breakpoint &&
        <Header.Content>
            <div className="rolext-header-content-label">Pos:</div>
            <CurrentCoordinateText map={map} className="rolext-header-content-value" style={{width:"10rem"}}/>
            <div className="rolext-header-content-label">Scale: 1/</div>
            <CurrentScaleText map={map} className="rolext-header-content-value" style={{width:"4rem"}}/>
        </Header.Content>
        }

    </Header>
    );
};

SimpleHeader.propTypes = {

    /**
     * The OpenLayers ol/Map
     */
    map: PropTypes.instanceOf(olMap).isRequired,

    /**
     * The logo to be shown in the Header.
     * The default is the React-Olext Logo in
     * SVG format.
     */
    logo: PropTypes.any,

    /**
     * A CSS Style to render the Header
     */
    style:PropTypes.object,

    /**
     * The main title to be shown in the Header
     */
    mainTitle: PropTypes.node,

    /**
     * The subtitle to be shown in the Header
     */
    subTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),

    /**
     * If the window size is less than or equal to the breakpoint, 
     * the header will not show the content (position and scale)
     */
    breakpoint: PropTypes.number

};

export default SimpleHeader;