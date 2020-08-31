import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { Button } from '@material-ui/core'
import PageHeader from '../common/PageHeader'
import { UserStoreContext } from '../../stores/UserStore'
import UserService from '../../services/user'
import FormSelect from '../common/form/FormSelect'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    form: {
        margin: 'auto',
        paddingTop: '100px',
        width: '200px'
    },
    loginButton: {
        marginTop: '24px'
    }
}))

export default function Login() {
    const classes = useStyles()
    const userStore = useContext(UserStoreContext)

    const [userId, setUserId] = useState('')
    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState({})
    const [toDashboard, setToDashboard] = useState(false)

    // Retrieve the list of users
    const getUsers = useCallback(() => {
        UserService.getUsers().then(users => {
            setUsers(users)
        })
    }, [])

    // Retrieve list of users on mount
    useEffect(() => {
        getUsers()
    }, [getUsers])

    // Validate a form field
    const validateField = (name, value) => {
        if (value === '') {
            setErrors({ ...errors, [name]: 'Value is required' })
            return false
        }
        return true
    }

    // Update state when form values change
    const handleChange = (event) => {
        setUserId(event.target.value)
        validateField(event.target.name, event.target.value)
    }

    // Login the user
    const handleLogin = () => {
        if (validateField('userId', userId)) {            
            userStore.login(userId).then(() => {               
                setToDashboard(true)
            })
        }       
    }

    return (
        <div>
            <PageHeader pageTitle="Login" />

            <div>
                <form className={classes.form} noValidate autoComplete="off">
                    <FormSelect id="userId" value={userId} label="User ID"
                        onChange={handleChange} selectList={users} valueProp="id" labelProp="id"
                        error={Boolean(errors.userId)} helperText={errors.userId} />
                    <Button className={classes.loginButton} size="small" variant="contained"
                        onClick={handleLogin} color="primary">
                        Login
                    </Button>
                </form>
            </div>

            { toDashboard && (<Redirect to='/dashboard' />) }              
        </div>
    )
}