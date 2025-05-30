// Este archivo se conectará al backend cuando esté disponible
import axios from './axios'

export const loginApi = async (rut: string, password: string) => {
  const res = await axios.post('/auth/login', { rut, password })
  return res.data // { token, usuario }
}
