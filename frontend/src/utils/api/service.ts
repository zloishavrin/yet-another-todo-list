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

  static async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return $api.post('/storage/upload', formData);
  }

  static async addArticleWithoutImage(title: string, description: string) {
    return $api.put('/api/article/new', {
      title,
      description
    });
  }

  static async addArticleWithImage(title: string, description: string, imageId: string) {
    return $api.put('/api/article/new', {
      title,
      description,
      imageId
    });
  }

  static async getAllArticles() {
    return $api.get('/api/article/all');
  }

  static async deleteArticle(id: string) {
    return $api.delete(`/api/article/${id}`);
  }

  static async completeArticle(id: string) {
    return $api.patch(`/api/article/complete/${id}`);
  }

  static async changeArticle(id: string, title: string, description: string) {
    return $api.patch(`/api/article/${id}`, {
      title,
      description
    })
  }

  static async getMe() {
    return $api.get('/api/user/me');
  }

}