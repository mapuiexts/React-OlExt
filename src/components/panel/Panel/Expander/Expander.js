import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Expander.css';


/**
 * Expander component used to collapse and expand the panel body.
 * Normally this component will not be used directly, but
 * used internally by the Panel component. But you can
 * use it, if you need to develop a collapsible component.
 */
const Expander = ({
  expanded = true,
  className = 'rolext-panel-expander-wrap',
  style = {},
  ...otherProps
}) => {

  const divEl = useRef(null);


  const [height, setHeight] = useState(0);


  /**
   * Effect to update the height of the component
   */
  useEffect(() => {
    if(!expanded) {
      setHeight(0);
    }
    else {
      const newHeight = divEl.current.scrollHeight + 5;
      if(newHeight > height)
        setHeight(divEl.current.scrollHeight + 5);
    }

  }, [expanded, height]);


  return (
    <div
      ref={divEl}
      className={className}
      style = {{...style, height} }
    >
      {otherProps.children}
    </div>
  );
};

Expander.propTypes = {
  /**
   * The expanded prop is set to true by default. 
   * Passing in expanded as false will collapse the element.
   */
  expanded: PropTypes.bool
}

export default Expander;



