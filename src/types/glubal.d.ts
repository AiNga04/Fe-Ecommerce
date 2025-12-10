declare global {
  interface IBackendRes<T> {
    statusCode: string
    message: string
    success: boolean
    data?: T
  }
}

export type { IBackendRes }
