import { http } from '@/lib/http'
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserSearchCriteria,
  UserUpdateProfileRequest,
} from '@/types/user'

const USER_PATH = '/users'

export const userService = {
  // --- Standard CRUD ---
  createUser: (data: UserCreateRequest) => {
    return http.post<IBackendRes<User>>(`${USER_PATH}`, data)
  },

  updateUser: (id: number | string, data: UserUpdateRequest) => {
    return http.put<IBackendRes<User>>(`${USER_PATH}/${id}`, data)
  },

  getUserById: (id: number | string) => {
    return http.get<IBackendRes<User>>(`${USER_PATH}/${id}`)
  },

  // --- Deletion & Restoration ---
  softDeleteUser: (id: number | string) => {
    return http.delete<IBackendRes<string>>(`${USER_PATH}/${id}`)
  },

  restoreUser: (id: number | string) => {
    return http.patch<IBackendRes<string>>(`${USER_PATH}/${id}/restore`)
  },

  hardDeleteUser: (id: number | string) => {
    return http.delete<IBackendRes<string>>(`${USER_PATH}/${id}/hard`)
  },

  // --- Lists & Search ---
  searchUsers: (params?: UserSearchCriteria) => {
    return http.get<IBackendRes<User[]>>(`${USER_PATH}`, { params })
  },

  getDeletedUsers: (params?: UserSearchCriteria) => {
    return http.get<IBackendRes<User[]>>(`${USER_PATH}/deleted`, { params })
  },

  getShippers: (params?: { page: number; size: number }) => {
    return http.get<IBackendRes<User[]>>(`${USER_PATH}/shippers`, { params })
  },

  // --- Profile & Current User ---
  getMyInfo: () => {
    return http.get<IBackendRes<User>>(`${USER_PATH}/me`)
  },

  updateMyAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return http.patch<IBackendRes<User>>(`${USER_PATH}/me/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateMyInfo: (data: UserUpdateProfileRequest) => {
    return http.patch<IBackendRes<User>>(`${USER_PATH}/me/info`, data)
  },

  // --- Admin actions on User Avatar ---
  updateUserAvatarByAdmin: (id: number | string, file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return http.patch<IBackendRes<User>>(`${USER_PATH}/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // --- Batch Operations (Optional but good to have) ---
  softDeleteUsersBatch: (ids: number[]) => {
    return http.delete<IBackendRes<any>>(`${USER_PATH}/batch`, { data: ids })
  },

  restoreUsersBatch: (ids: number[]) => {
    return http.patch<IBackendRes<any>>(`${USER_PATH}/batch/restore`, ids)
  },

  hardDeleteUsersBatch: (ids: number[]) => {
    return http.delete<IBackendRes<any>>(`${USER_PATH}/batch/hard`, { data: ids })
  },
}
