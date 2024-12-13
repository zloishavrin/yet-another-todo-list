import $api from "./api";

export default class APIService {

  static async login(login: string, password: string) {
    return $api.post('/api/auth/login', {
      login,
      password
    });
  }

  static async registration(login: string, password: string) {
    return $api.put('/api/auth/registration', {
      login,
      password
    });
  }

}