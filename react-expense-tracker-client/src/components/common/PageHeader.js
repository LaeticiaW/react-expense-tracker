import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        padding: '0px 8px 8px 0px',
        margin: '0px'
    }
  }))

export default React.memo(function PageHeader({pageTitle}) {
    const classes = useStyles()
   
    return (
        <h2 className={classes.pageTitle}>{pageTitle}</h2>
    )
})