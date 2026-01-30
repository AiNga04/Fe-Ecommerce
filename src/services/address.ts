import { http } from '@/lib/http'
import { Address, AddressRequest } from '@/types/address'

const ADDRESS_PATH = '/addresses'

export const addressService = {
  getMyAddresses: () => {
    return http.get<IBackendRes<Address[]>>(`${ADDRESS_PATH}`)
  },

  createAddress: (data: AddressRequest) => {
    return http.post<IBackendRes<Address>>(`${ADDRESS_PATH}`, data)
  },

  updateAddress: (id: number, data: AddressRequest) => {
    return http.put<IBackendRes<Address>>(`${ADDRESS_PATH}/${id}`, data)
  },

  deleteAddress: (id: number) => {
    return http.delete<IBackendRes<void>>(`${ADDRESS_PATH}/${id}`)
  },

  setDefault: (id: number) => {
    return http.patch<IBackendRes<void>>(`${ADDRESS_PATH}/${id}/default`, {})
  },
}
