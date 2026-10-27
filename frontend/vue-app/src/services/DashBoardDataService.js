import http from '../http-common'

class DashboardDataService {
  create(data) {
    return http.post('/dashboards', data)
  }

  join(code) {
    return http.post('/dashboards/join', { code })
  }

  get(id) {
    return http.get(`/dashboards/${id}`)
  }
}

export default new DashboardDataService()