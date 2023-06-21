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
  alreadySubscribed = 'User already subscribed or completed the mission',
  cantCompleteMission = 'User not participating or already completed this mission',
  alreadyClaimed = 'User already claimed this reward',
  cantHandReward = 'User did not claim this reward',
  insufficientBalance = 'User does not have sufficient balance to claim this reward'
}
export default ExceptionStatus
