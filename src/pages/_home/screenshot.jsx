import React, { useCallback, useRef, useState } from 'react'
import './screenshot.less'

export default function () {

  const containerRef = useRef(null)

  const [offsetX, setOffsetX] = useState(310);

  const handleMouseMove = useCallback((event) => {
    const { offsetX } = event.nativeEvent;
    setOffsetX(offsetX);
  },[setOffsetX])

  return (
    <div className='d-flex justify-content-end'>
      <div className='screenshot' ref={containerRef} onMouseMove={(e) => handleMouseMove(e)}>
      <img style={{ 'clip': `rect(auto, ${offsetX}px, auto, auto)` }} className="overflow-hidden img-height" src="/home/dark.png" alt="" ></img>
      <div className="overflow-hidden" >
        <img src="/home/light.png" alt="" className='img-height' />
      </div>
      {/* <div className='screenshot-line-wrap' ref={lineRef} style={{ left: offsetX+'px' }} >
        <div className='screenshot-line'></div>
      </div> */}
    </div>
    </div>
  );
}
