import { http } from '@/lib/http'
import { User, UserUpdateRequest } from '@/types/user'

const USER_PATH = '/users'

export const userService = {
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

  updateUser: (id: number, data: UserUpdateRequest) => {
    return http.put<IBackendRes<User>>(`${USER_PATH}/${id}`, data)
  },
  updateMyInfo: (data: UserUpdateRequest) => {
    return http.patch<IBackendRes<User>>(`${USER_PATH}/me/info`, data)
  },
  getUsers: (params?: any) => {
    return http.get<IBackendRes<User[]>>(`${USER_PATH}`, { params })
  },
}
