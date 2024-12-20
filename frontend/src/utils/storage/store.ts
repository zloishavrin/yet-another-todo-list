import { makeAutoObservable } from 'mobx';
import APIService from '../api/service';

export default class Store {

    token : string | null = localStorage.getItem('token');
    isAuth : boolean = this.token ? true : false;
    isLoading : boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(login: string, password: string) {
        this.setLoading(true);
        try {
            const responce = await APIService.login(login, password);
            localStorage.setItem('token', responce.data.token);
            this.setToken(responce.data.token);
            this.setAuth(true);
        }
        catch(error) {
            this.setAuth(false);
            return Promise.reject(error);
        }
        finally {
            this.setLoading(false);
        }
    }

    async logout() {
        this.setLoading(true)
        try {
            localStorage.removeItem('token');
            this.setToken(null);
            this.setAuth(false);
        }
        catch(error) {
            this.setAuth(false);
            return Promise.reject(error);
        }
        finally {
            this.setLoading(false);
        }
    }

    async registration(login: string, password: string) {
        this.setLoading(true);
        try {
            const responce = await APIService.registration(login, password);
            localStorage.setItem('token', responce.data.token);
            this.setToken(responce.data.token);
            this.setAuth(true);
        }
        catch(error) {
            this.setAuth(false);
            return Promise.reject(error);
        }
        finally {
            this.setLoading(false);
        }
    }

}