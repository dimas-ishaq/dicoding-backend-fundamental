class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this.authenticationService = authenticationService;
    this.userService = userService;
    this.tokenManager = tokenManager;
    this.validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);

  }

  async postAuthenticationHandler(request, h) {
    this.validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this.userService.verifyUserCredential(username, password);

    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });

    await this.authenticationService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    }
    );

    response.code(201);
    return response;
  }


  async putAuthenticationHandler(request, h) {
    this.validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this.authenticationService.verifyRefreshToken(refreshToken);
    const { id } = this.tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.tokenManager.generateAccessToken({ id });
    const response = h.response({
      status: 'success',
      data: {
        accessToken: accessToken
      }
    })
    response.code(200);
    return response;

  }
  async deleteAuthenticationHandler(request, h) {
    this.validator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this.authenticationService.verifyRefreshToken(refreshToken);
    await this.authenticationService.deleteRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    })
    response.code(200);
    return response;

  }
}

module.exports = AuthenticationHandler;