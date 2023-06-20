enum ExceptionStatus {
  internalError = 'Internal Server Error',
  errorNonMapped = 'Non Mapped Error',
  unexpectedError = 'Unexpected Error',
  notFound = 'Not Found',
  invalidRequest = 'Invalid Request',
  timedOut = 'Connection Timed Out.',
  serviceUnavailable = 'Service Unavailable',
  invalidToken = 'Invalid Token',
  invalidHeaders = 'Request without necessary headers',
  invalidAuthorization = 'Authorization token needs to be a Bearer token',
  alreadySubscribed = 'User is already subscribed to the mission'
}
export default ExceptionStatus
