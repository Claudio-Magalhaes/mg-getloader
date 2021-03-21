import React from 'react'

const index = (props) => {
  const progressError = props.progressError
  const progressValue = props.progressValue

  return (
    <div className='getloader-default-progressBar'>
      <div
        className={`progress-value ${progressError}`}
        style={{ width: `${progressValue}%` }}
      />
    </div>
  )
}

export default index
