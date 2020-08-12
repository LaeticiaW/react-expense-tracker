import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import NavDrawer from './NavDrawer'

export default function AppHeader() {
  
  return (    
      <header>
        <AppBar position="fixed" className="app-header">       
          <Toolbar>               
            <NavDrawer/>
            <h3 className="app-title">Expense Tracker</h3>      
          </Toolbar>
        </AppBar>
      </header>    
  )
}
