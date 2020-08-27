import axios from 'axios'

export default {
    userUrl: 'http://localhost:3000/user/',

    /*
     * Retrieve the user list
     */
    getUsers() {
        return axios.get(this.userUrl).then(response => response.data)
            .catch((error) => {
                console.error('ExpenseService.getExpenses error:', error.response ? error.response : error)
                return Promise.reject(error.response)
            })
    },
    /*
     * Retrieve a specific user by user id
     * @param {number} userId - user id
     */
    getUser(userId) {
        return axios.get(this.userUrl + userId).then(response => response.data)
            .catch((error) => {
                console.error('UserService.getUser error:', error.response ? error.response : error)
                return Promise.reject(error.response)
            })
    }
}
