import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'types'

const useStyles = makeStyles(theme => ({
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        padding: '0px 8px 8px 0px',
        margin: '0px'
    }
  }))

const PageHeader = React.memo(({pageTitle}) => {
    const classes = useStyles()
   
    return (
        <h2 className={classes.pageTitle}>{pageTitle}</h2>
    )
})

// Prop Types
PageHeader.propTypes = {
    pageTitle: PropTypes.string.isRequired
}

export default PageHeader