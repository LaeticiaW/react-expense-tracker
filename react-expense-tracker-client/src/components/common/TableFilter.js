import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles(theme => ({   
    toolbar: {
        display: 'flex',
        alignItems: 'space-between',
        backgroundColor: '#d8ebf7',       
        borderRadius: '5px',
        marginBottom: '16px'  
    },   
    rightItems: {
        marginLeft: 'auto'
    }
}))

export default React.memo(function TableFilter({renderInputs, renderActions}) {
  const classes = useStyles()
    
  return (         
        <Toolbar className={classes.toolbar}>  
            <div className={classes.leftItems}>
                {renderInputs()}   
            </div>                     
            <div className={classes.rightItems}>
                {renderActions ? renderActions() : ''}
            </div>                   
          </Toolbar>
        
  )
})
