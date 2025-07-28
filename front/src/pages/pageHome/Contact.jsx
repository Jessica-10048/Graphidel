import React from 'react'

const Contact = () => {
  return (
    <section className='contact-form'>
    <form className='form-card'>
      <h1>Contact form</h1>
      <div>
      <label name='name' htmlFor="">Name : </label>
      <input name='name' type="text" />
      </div>
      <div>
      <label htmlFor="">Email : </label>
      <input type="email" />
      </div>
      </form>
      </section>
  )
}

export default Contact