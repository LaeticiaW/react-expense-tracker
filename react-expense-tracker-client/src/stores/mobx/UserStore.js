import { observable, action, decorate, computed } from 'mobx'
import { createContext } from 'react'
import UserService from '../../services/user'

class UserStore {
    // Store data
    currentUser = {
        id: '',
        firstName: '',
        lastName: ''
    }
    loggedInUserId = localStorage.getItem('etLoginToken')
    isUserInitialized = false

    // On app startup, this will retrieve the user data
    getCurrentUser() {        
        let userId = localStorage.getItem('etLoginToken')
        if (userId) {
            UserService.getUser(userId).then(user => {                             
                this.currentUser = user
                this.isUserInitialized = true
            }).catch(error => {  
                this.isUserInitialized = true                            
            })
        } else {         
            this.isUserInitialized = true 
        }                
    }

    // Login the user
    login(userId) {        
        return UserService.getUser(userId).then(user => {           
            localStorage.setItem('etLoginToken', user.id)
            this.currentUser = user
            this.loggedInUserId=user.id           
        })
    }

    // Logout the user
    logout() {
        localStorage.removeItem('etLoginToken')
        this.currentUser = null
        this.loggedInUserId = null
    }

    // Returns the first letter of the current user's userId
    get userLetter() {       
        return this.currentUser && this.currentUser.id ? this.currentUser.id.substr(0, 1).toUpperCase() : ''       
    } 
    
    // Returns the user name (first and last)
    get userName() {
        return this.currentUser && this.currentUser.id ? this.currentUser.firstName + this.currentUser.lastName : '' 
    }
}

decorate(UserStore, {
    currentUser: observable,
    loggedInUserId: observable,  
    isUserInitialized: observable,
    getCurrentUser: action, 
    login: action,
    logout: action,
    setIsUserInitialized: action,
    userLetter: computed,
    userName: computed
})

export const UserStoreContext = createContext(new UserStore())