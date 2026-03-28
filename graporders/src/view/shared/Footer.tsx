import React from 'react'
import { i18n } from '../../i18n'

function Footer() {
  return (
    <div style={{color:'black' , fontSize:24}}>{i18n('footer.copyright', new Date().getFullYear())}</div>
  )
}

export default Footer
