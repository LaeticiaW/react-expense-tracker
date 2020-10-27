import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import PropTypes from 'types'

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

const TableFilter = React.memo(({renderInputs, renderActions}) => {
  const classes = useStyles()
    
  return (         
        <Toolbar className={classes.toolbar} role="toolbar">  
            <div className={classes.leftItems}>
                {renderInputs()}   
            </div>                     
            <div className={classes.rightItems}>
                {renderActions ? renderActions() : ''}
            </div>                   
          </Toolbar>
        
  )
})

// Prop Types
TableFilter.propTypes = {
    renderInputs: PropTypes.func.isRequired,
    renderActions: PropTypes.func
}

export default TableFilter
