// API CLIENT FOR SMARTSPEND

const API_BASE = '/api';

export const setToken = (token) => {
    localStorage.setItem('auth_token', token);
};

export const getToken = () => {
    return localStorage.getItem('auth_token');
};

export const setUserName = (name) => {
    localStorage.setItem('user_name', name);
};

export const getUserName = () => {
    return localStorage.getItem('user_name') || 'User';
};

export const clearToken = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
};

export const isAuthenticated = () => {
    return !!getToken();
};

export async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    // Setup headers
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    const token = getToken();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    
    const fetchOptions = {
        ...options,
        headers
    };
    
    try {
        const response = await fetch(url, fetchOptions);
        
        // Handle 401 Unauthorized globally by clearing tokens and forcing login page
        if (response.status === 401 && endpoint !== '/login' && endpoint !== '/signup') {
            clearToken();
            window.dispatchEvent(new CustomEvent('auth-required'));
            throw new Error('Unauthorized');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
}
