import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export interface PredictionResponse {
  [key: string]: any
}

export const predictBatch = async (files: File[]): Promise<PredictionResponse> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await api.post<PredictionResponse>('/predict/batch', formData)
  return response.data
}

