/**
 * Digital Subsidy & Grant Administration Platform - Unified REST API Client
 * Connects frontend directly to Spring Boot backend REST endpoints (/api / http://localhost:8080/api)
 * with robust error handling, token management, and graceful local fallback when needed.
 */

const API_BASE_URL = typeof window !== 'undefined' && (window.location.port === '8080' || window.location.pathname.startsWith('/api'))
  ? '/api'
  : 'http://localhost:8080/api';

class ApiService {
  static getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('dsga_jwt_token');
  }

  static setToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('dsga_jwt_token', token);
    } else {
      localStorage.removeItem('dsga_jwt_token');
    }
  }

  static getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('dsga_refresh_token');
  }

  static setRefreshToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('dsga_refresh_token', token);
    } else {
      localStorage.removeItem('dsga_refresh_token');
    }
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = options.headers || {};

    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `Request failed with status ${response.status}` };
        }
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      // If no content returned (204 No Content)
      if (response.status === 204) return null;
      return await response.json();
    } catch (err) {
      console.warn(`[DSGA API] Endpoint call ${options.method || 'GET'} ${endpoint} failed: ${err.message}`);
      throw err;
    }
  }

  // --- HEALTH & STATUS ---
  static async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/schemes?page=0&size=1`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- AUTHENTICATION ---
  static async login(email, password) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password: String(password || '') })
    });
    if (data?.accessToken) {
      this.setToken(data.accessToken);
    }
    if (data?.refreshToken) {
      this.setRefreshToken(data.refreshToken);
    }
    return data;
  }

  static async register(citizenData) {
    const cleanEmail = String(citizenData.email || '').trim().toLowerCase();
    const cleanPhone = String(citizenData.mobile || citizenData.phone || '').replace(/\D/g, '');
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: String(citizenData.fullName || citizenData.name || '').trim(),
        email: cleanEmail,
        password: citizenData.password,
        phone: cleanPhone || '9876543210',
        district: citizenData.district || 'General',
        address: citizenData.address || citizenData.district || 'General'
      })
    });
    if (data?.accessToken) {
      this.setToken(data.accessToken);
    }
    if (data?.refreshToken) {
      this.setRefreshToken(data.refreshToken);
    }
    return data;
  }

  static async getProfile() {
    return this.request('/auth/me');
  }

  static async logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        });
      } catch (e) {
        console.warn('Logout API error:', e);
      }
    }
    this.setToken(null);
    this.setRefreshToken(null);
  }

  // --- SCHEMES ---
  static async getSchemes(page = 0, size = 50) {
    const res = await this.request(`/schemes?page=${page}&size=${size}`);
    return res?.content || res || [];
  }

  static async getSchemeById(id) {
    return this.request(`/schemes/${id}`);
  }

  static async createScheme(schemeData) {
    return this.request('/schemes', {
      method: 'POST',
      body: JSON.stringify(schemeData)
    });
  }

  static async updateScheme(id, schemeData) {
    return this.request(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schemeData)
    });
  }

  static async deactivateScheme(id) {
    return this.request(`/schemes/${id}`, {
      method: 'DELETE'
    });
  }

  static async deleteScheme(id) {
    return this.request(`/schemes/${id}/remove`, {
      method: 'DELETE'
    });
  }

  // --- USER & OFFICER MANAGEMENT (CHIEF ADMINISTRATOR) ---
  static async getUsers() {
    return this.request('/admin/users');
  }

  static async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  static async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  // --- APPLICATIONS ---
  static async getApplications(status = '', page = 0, size = 50) {
    const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}&page=${page}&size=${size}` : `?page=${page}&size=${size}`;
    const res = await this.request(`/applications${query}`);
    return res?.content || res || [];
  }

  static async getMyApplications(applicantId, page = 0, size = 50) {
    const res = await this.request(`/applications/applicant/${applicantId}?page=${page}&size=${size}`);
    return res?.content || res || [];
  }

  static async getApplicationById(id) {
    return this.request(`/applications/${id}`);
  }

  static async submitApplication(applicationData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  }

  // --- VERIFICATIONS ---
  static async verifyApplication(verificationPayload) {
    return this.request('/verifications', {
      method: 'POST',
      body: JSON.stringify({
        applicationId: verificationPayload.applicationId,
        verifierId: verificationPayload.verifierId,
        verifierComments: verificationPayload.remarks || verificationPayload.verifierComments || 'Field verification completed',
        verificationScore: verificationPayload.verificationScore !== undefined ? verificationPayload.verificationScore : 95.0,
        verificationStatus: verificationPayload.status || verificationPayload.verificationStatus || 'VERIFIED'
      })
    });
  }

  static async getVerificationsByApplication(applicationId) {
    return this.request(`/verifications/application/${applicationId}`);
  }

  // --- APPROVALS & SANCTIONS ---
  static async approveSanction(approvalPayload) {
    return this.request('/approvals/approve', {
      method: 'POST',
      body: JSON.stringify({
        applicationId: approvalPayload.applicationId,
        authorityId: approvalPayload.authorityId || 3,
        approvedAmount: approvalPayload.approvedAmount,
        authorityComments: approvalPayload.remarks || approvalPayload.authorityComments || 'Grant sanction approved',
        decision: 'APPROVED'
      })
    });
  }

  static async rejectSanction(applicationId, remarks = '') {
    return this.request(`/approvals/reject/${applicationId}?remarks=${encodeURIComponent(remarks)}`, {
      method: 'POST'
    });
  }

  static async getApprovalsByApplication(applicationId) {
    return this.request(`/approvals/application/${applicationId}`);
  }

  // --- PAYMENTS & DBT ---
  static async processPayment(paymentPayload) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentPayload)
    });
  }

  static async getPaymentsByApplication(applicationId) {
    return this.request(`/payments/application/${applicationId}`);
  }

  // --- DOCUMENTS ---
  static async uploadDocument(docPayload) {
    return this.request('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(docPayload)
    });
  }

  static async getDocumentsByApplication(applicationId) {
    return this.request(`/documents/application/${applicationId}`);
  }

  // --- NOTIFICATIONS ---
  static async getNotifications(userId) {
    // Primary: Authenticated endpoint /notifications (scoped strictly by JWT token identity)
    try {
      return await this.request('/notifications');
    } catch (err) {
      if (userId) {
        const numId = typeof userId === 'number' ? userId : Number(String(userId).replace(/\D/g, ''));
        if (numId) return await this.request(`/notifications/user/${numId}`);
      }
      throw err;
    }
  }

  static async getUnreadNotificationCount() {
    return this.request('/notifications/unread-count');
  }

  static async sendNotification(userId, title, message, type = 'INFO') {
    const numId = typeof userId === 'number' ? userId : Number(String(userId).replace(/\D/g, ''));
    return this.request(`/notifications/user/${numId}?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&type=${encodeURIComponent(type)}`, {
      method: 'POST'
    });
  }

  static async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  static async markAllNotificationsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PATCH'
    });
  }

  // --- FUNDS ---
  static async getFundByScheme(schemeId) {
    return this.request(`/funds/scheme/${schemeId}`);
  }

  static async allocateFund(schemeId, amount) {
    return this.request(`/funds/allocate/${schemeId}?amount=${amount}`, {
      method: 'POST'
    });
  }

  // --- AUDIT LOGS ---
  static async getAuditLogs(page = 0, size = 50) {
    const res = await this.request(`/audit-logs?page=${page}&size=${size}`);
    return res?.content || res || [];
  }
}

export default ApiService;
