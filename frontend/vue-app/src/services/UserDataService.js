import http from '../http-common'

class UserDataService {
  create(data) {
    return http.post('/user', data)
  }

  postLogin(data) {
    return http.post('/user/login', data)
  }

  getAuth() {
    return http.get('/user/auth')
  }

  getLogout() {
    return http.get('/user/logout')
  }

  update(id, data) {
    return http.put(`/user/${id}`, data)
  }
}

export default new UserDataService()