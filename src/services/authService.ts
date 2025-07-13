// services/authService.ts - Mise à jour

import { User, LoginRequest, ApiResponse, UserCompany, PasswordChangeRequest, ProfileUpdateRequest } from '@/types/models';
import { apiService } from './api';

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';
  private static readonly COMPANY_KEY = 'current_company';

  /**
   * Connexion utilisateur
   */
  static async login(credentials: LoginRequest): Promise<User> {
    const response = await apiService.post<ApiResponse<User>>('/auth/login', credentials);

    // Sauvegarder toutes les données utilisateur
    this.saveUserData(response.data);

    return response.data;
  }

  /**
   * Récupère l'utilisateur courant avec ses compagnies
   */
  static async getCurrentUser(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/me/profil');

    // Mettre à jour les données utilisateur
    this.updateUserData(response.data);

    return response.data;
  }

  /**
   * Déconnexion
   */
  static async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout', {});
    } finally {
      this.clearAllData();
    }
  }

  /**
   * Sauvegarde toutes les données utilisateur
   */
  private static saveUserData(user: User): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // Sélectionner la première company par défaut
    if (user.companies && user.companies.length > 0) {
      this.setCurrentCompany(user.companies[0]);
    }
  }

  /**
   * Met à jour les données utilisateur existantes
   */
  private static updateUserData(user: User): void {
    // Conserver le token existant si pas fourni dans la réponse
    const existingToken = this.getToken();
    if (existingToken && !user.token) {
      user.token = existingToken;
    }

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // Mettre à jour la company courante si elle existe toujours
    const currentCompany = this.getCurrentCompany();
    if (currentCompany) {
      const updatedCompany = user.companies.find(c => c.id === currentCompany.id);
      if (updatedCompany) {
        this.setCurrentCompany(updatedCompany);
      } else if (user.companies.length > 0) {
        this.setCurrentCompany(user.companies[0]);
      }
    } else if (user.companies.length > 0) {
      this.setCurrentCompany(user.companies[0]);
    }
  }

  /**
   * Supprime toutes les données
   */
  private static clearAllData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.COMPANY_KEY);
  }

  /**
   * Récupère le token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupère les données utilisateur stockées
   */
  static getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Vérifie si connecté
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  /**
   * Définit la company courante
   */
  static setCurrentCompany(company: UserCompany): void {
    localStorage.setItem(this.COMPANY_KEY, JSON.stringify(company));
  }

  /**
   * Récupère la company courante
   */
  static getCurrentCompany(): UserCompany | null {
    const companyData = localStorage.getItem(this.COMPANY_KEY);
    return companyData ? JSON.parse(companyData) : null;
  }

  /**
   * Vérifie si l'utilisateur est admin de la compagnie courante
   */
  static isCurrentCompanyAdmin(): boolean {
    const currentCompany = this.getCurrentCompany();
    return currentCompany?.role === 'admin' || currentCompany?.role === 'owner';
  }

  /**
   * Récupère le rôle dans la compagnie courante
   */
  static getCurrentCompanyRole(): string {
    const currentCompany = this.getCurrentCompany();
    return currentCompany?.role || 'member';
  }

  // Méthodes deprecated - gardées pour compatibilité
  static saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    this.clearAllData();
  }

  /**
 * Met à jour le profil utilisateur
 */
  static async updateProfile(profileData: ProfileUpdateRequest): Promise<User> {
    const formData = new FormData();

    formData.append('first_name', profileData.first_name);
    formData.append('last_name', profileData.last_name);
    formData.append('telephone', profileData.telephone);
    formData.append('_method', 'PUT');

    if (profileData._avatar) {
      formData.append('_avatar', profileData._avatar);
    }

    const response = await apiService.postFormData<ApiResponse<User>>('/me/profil', formData);

    // Mettre à jour les données utilisateur stockées
    this.updateUserData(response.data);

    return response.data;
  }

  /**
   * Change le mot de passe utilisateur
   */
  static async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    const formData = new FormData();

    formData.append('current_password', passwordData.current_password);
    formData.append('password', passwordData.password);
    formData.append('password_confirmation', passwordData.password_confirmation);

    await apiService.postFormData('/me/change-password', formData);
  }
}