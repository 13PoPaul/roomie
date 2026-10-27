import http from '../http-common'

class RoomDataService {
  create(data) {
    return http.post('/rooms', data)
  }

  join(code) {
    return http.post('/rooms/join', { code })
  }

  get(id) {
    return http.get(`/rooms/${id}`)
  }
}

export default new RoomDataService()