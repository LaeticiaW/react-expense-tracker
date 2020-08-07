import * as React from 'react'
import TableCell from '@material-ui/core/TableCell'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    cell: {
      whiteSpace: 'nowrap',
      textAlign: 'center',
      fontSize: '16px'      
    }
}))

export default React.memo(function ActionCell(props) {
  const classes = useStyles()

  return (
    <TableCell {...props} className={classes.cell} >      
      {props.children}      
    </TableCell>
  )
})
