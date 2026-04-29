import axios from 'axios';

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : '/api' 
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('rwa_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const authAPI    = {
  register: d     => api.post('/auth/register', d),
  login:    d     => api.post('/auth/login',    d),
};
export const vehiclesAPI = {
  getAll:   p     => api.get('/vehicles', { params: p }),
  getById:  id    => api.get(`/vehicles/${id}`),
  create:   d     => api.post('/admin/catalog', d),
  update:   (id,d)=> api.put(`/admin/catalog/${id}`, d),
  delete:   id    => api.delete(`/admin/catalog/${id}`),
};
export const testAPI = {
  process: (respuestas, id_usuario = null) =>
    api.post('/test/process', { respuestas, id_usuario }),
};
export const garageAPI = {
  get:    ()  => api.get('/user/garage'),
  add:    id  => api.post('/user/garage', { id_vehiculo: id }),
  remove: id  => api.delete(`/user/garage/${id}`),
};

export default api;