import React from 'react'

const preLoader = (props) => {
  let styles = {}

  if (props.style) {
    styles = props.style
  }

  return (
    <div style={{ ...styles }} className='getLoader-defaultLoader'>
      <svg className='spinner' viewBox='0 0 50 50'>
        <circle
          className='path'
          cx='25'
          cy='25'
          r='20'
          fill='none'
          strokeWidth='5'
        />
      </svg>
    </div>
  )
}

export default preLoader
