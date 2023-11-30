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
  unauthorizedClient = 'Unauthorized client',
  forbiddenResource = 'User does not have access to this resource',
  accountExists = 'There\'s already an account with this registration',
  invalidCredentials = 'Invalid credentials',
  alreadySubscribed = 'User already subscribed or completed the mission',
  cantCompleteMission = 'User not participating or already completed this mission',
  rewardUnavailable = 'This reward is not available anymore or was already claimed by this user',
  rewardAlreadyInactive = 'This reward is already inactive',
  cantHandOrCancelReward = 'User did not claim this reward',
  insufficientBalance = 'User does not have sufficient balance to claim this reward',
  invalidExpirationDate = 'The expiration date must be greater than the one set before',
  cantEnableUser = 'Cannot enable this User',
  cantDisableUser = 'Cannot disable this User',
  cantGiveAdminPrivileges = 'Cannot give Admin Privileges to this User',
  cantRevokeAdminPrivileges = 'Cannot revoke Admin Privileges from this User'
}
export default ExceptionStatus
