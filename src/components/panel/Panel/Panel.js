import React, {useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Expander from './Expander/Expander';
import './Panel.css';

/**
 * The Panel Component.
 */
const Panel = ({
  expanded = true,
  collapsible = true,
  expandDir, 
  preTools,
  postTools, 
  style = null, 
  title,
  onTitleMouseOver,
  onTitleMouseOut,
  titleStyle,
  onClose = null,
  ...otherProps
}) => {

  const [internalExpanded, setInternalExpanded] = useState(expanded);

  const toggleCollapse = useCallback(() => {
    setInternalExpanded(prevInternalExpanded => {
      return !prevInternalExpanded;
    });
  },[]);

const showHeader = title.length || collapsible;
const className = `rolext-panel${internalExpanded ? ' rolext-panel-expanded' : ''}`;

return (
  <div className={className} style={style}>
    {showHeader &&
      <Header
        title={title}
        collapsible={collapsible}
        toggleCollapse={toggleCollapse}
        preTools={preTools}
        postTools={postTools}
        onClose={onClose}
        onMouseOver={onTitleMouseOver}
        onMouseOut={onTitleMouseOut}
        style={titleStyle}
      />
    }
    {/* <Expander expanded={internalExpanded} expandDir={expandDir} render={() => (
      <div className="rolext-panel-body-el">
        {otherProps.children}
      </div>
    )} /> */}
    <Expander expanded={internalExpanded} expandDir={expandDir}>
      <div className="rolext-panel-body-el">
        {otherProps.children}
      </div>
    </Expander>
  </div>
);

};

Panel.propTypes = {

  /**
   * Set to true by default. 
   * Passing expanded as false will show the 
   * component collapsed.
   */
  expanded:PropTypes.bool,
  /**
   * If collapsible is true, the panel header will display 
   * a collapse/expand control to collapse/expand the panel.
   */
  collapsible:PropTypes.bool,

  /**
   * Not used currently.
   * To be used in the future to allow to expand in a horizontal
   * direction.
   * @ignore
   */
  expandDir: PropTypes.string,

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
   * A CSS Style to render the Panel
   */
  style:PropTypes.object,

  /**
   * a title to be shown
   */
  title: PropTypes.node.isRequired,

  /**
   * A callback function to be called once the
   * mouse is over the Header component.
   */
  onTitleMouseOver: PropTypes.func,

   /**
   * A callback function to be called once the
   * mouse is moved out of the Header component.
   */
  onTitleMouseOut: PropTypes.func,

  /**
   * A CSS Style to render the Title
   */
  titleStyle:PropTypes.object,

  /**
   * A callback function to be called once the
   * user clicks in the close control.
   * If null, the close control will not be 
   * shown.
   */
  onClose: PropTypes.func
};

export default Panel;