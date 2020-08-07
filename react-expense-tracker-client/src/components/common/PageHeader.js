import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        padding: '0px 8px 8px 0px'
    }
  }))

export default React.memo(function PageHeader({pageTitle}) {
    const classes = useStyles()
   
    return (
        <div className={classes.pageTitle}>{pageTitle}</div>
    )
}, (prevProps, nextProps) => {
    return prevProps.pageTitle === nextProps.pageTitle
})