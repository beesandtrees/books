import React from 'react'

const BookImage = props => {
  if(props.imageURL) {
    return (
      <img src={props.imageURL} alt={props.title} />
    )
  } else {
    return (
      <span></span>
    )    
  }
}

export default Image;