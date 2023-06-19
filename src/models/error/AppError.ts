class AppError {
  public readonly message: string | object;

  public readonly status: number;

  constructor (message: string | object, status: number) {
    this.message = message
    this.status = status
  }
}

export default AppError
