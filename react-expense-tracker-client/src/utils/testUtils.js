import React from 'react'
import { render } from '@testing-library/react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

const AllTheProviders = ({ children }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div style={{height: '1000px', width: '1000px'}}>
        {children}
      </div>
    </MuiPickersUtilsProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }  
