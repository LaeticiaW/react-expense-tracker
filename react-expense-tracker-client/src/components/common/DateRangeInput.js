import React, { useState } from 'react'
import { DatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    dateRangeContainer: {
        display: 'inline-block',
        width: '234px',
        whiteSpace: 'no-wrap'
    },
    datePicker: {
        marginTop: '8px',
        marginRight: '16px',
        width: '100px',
        minWidth: '100px',
        backgroundColor: '#ffffff',
        borderRadius: '5px',

        '& input': {
            fontSize: '0.875rem !important'
        }

    }
}))

export default React.memo(function DateRangeInput({ startDate, endDate, handleDateChange }) {
    const classes = useStyles()

    const [startDt, setStartDt] = useState(startDate || moment().startOf('year').format('YYYY-MM-DD'))
    const [endDt, setEndDt] = useState(endDate || moment().endOf('day').format('YYYY-MM-DD'))
    const [startDtMs, setStartDtMs] = useState(moment(startDt).valueOf())
    const [endDtMs, setEndDtMs] = useState(moment(endDt).valueOf())

    const handleChange = (startDateMs, endDateMs) => {
        let start = moment(startDateMs).format('YYYY-MM-DD')
        let end = moment(endDateMs).format('YYYY-MM-DD')

        setStartDt(start)
        setStartDtMs(startDateMs)
        setEndDt(end)
        setEndDtMs(endDateMs)

        handleDateChange(start, startDateMs, end, endDateMs)
    }

    return (
        <div className={classes.dateRangeContainer}>
            <DatePicker value={startDt} onChange={date => handleChange(date, endDtMs)}
                className={classes.datePicker}
                label="Start Date" format="YYYY-MM-DD"
                inputVariant="outlined"
                autoOk={true} allowKeyboardControl={true}
                InputProps={{ margin: 'dense' }}
            />

            <DatePicker value={endDt} onChange={date => handleChange(startDtMs, date)}
                className={classes.datePicker}
                label="End Date" format="YYYY-MM-DD"
                inputVariant="outlined"
                autoOk={true} allowKeyboardControl={true}
                InputProps={{ margin: 'dense' }}
            />
        </div>
    )
}, (prevProps, nextProps) => {
    return (prevProps.startDate === nextProps.startDate && prevProps.endDate === nextProps.endDate)
})