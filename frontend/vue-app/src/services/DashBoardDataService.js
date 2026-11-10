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

  // AJOUTER CETTE MÉTHODE :
  getMembers(dashboardId) {
    return http.get(`/dashboards/${dashboardId}/users`)
  }
}

export default new DashboardDataService()