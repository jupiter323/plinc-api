/* eslint-disable import/no-extraneous-dependencies */

const { config, CognitoIdentityServiceProvider, CognitoIdentityCredentials } = require('aws-sdk');
const faker = require('faker');

const ADMIN_CREATE_USER = 'adminCreateUser';
const ADMIN_DELETE_USER = 'adminDeleteUser';
const ADMIN_INITIATE_AUTH = 'adminInitiateAuth';
const RESPOND_TO_AUTH_CHALLENGE = 'respondToAuthChallenge';

const {
  AWS_REGION,
  USER_POOL_ID: UserPoolId,
  IDENTITY_POOL_ID: IdentityPoolId,
  CLIENT_ID: ClientId,
} = process.env;

config.update({ region: AWS_REGION });

const generator = () => ({
  username: faker.internet.userName(),
  adminPassword: faker.internet.password(null, null, null, 'A1@'),
  password: faker.internet.password(null, null, null, 'A1@'),
  userAttributes: [
    {
      Name: 'phone_number',
      Value: '+4401234567899',
    },
    {
      Name: 'email',
      Value: faker.internet.email(),
    },
  ],
});

const provider = new CognitoIdentityServiceProvider({ region: AWS_REGION });

const client = (action, params) => {
  return provider[action](params).promise();
};

const createUser = ({
  username: Username,
  adminPassword: TemporaryPassword,
  userAttributes: UserAttributes,
}) => client(ADMIN_CREATE_USER, { UserPoolId, Username, TemporaryPassword, UserAttributes });

const deleteUser = ({ Username }) => client(ADMIN_DELETE_USER, { UserPoolId, Username });

const initiateAuth = ({ username, adminPassword }) => {
  return client(ADMIN_INITIATE_AUTH, {
    ClientId,
    UserPoolId,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: adminPassword,
    },
  });
};

const authChallenge = (Session, { username, password }) =>
  client(RESPOND_TO_AUTH_CHALLENGE, {
    ClientId,
    Session,
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: password,
    },
  });

const federatedAccess = (token) =>
  new Promise((resolve, reject) => {
    const credentials = new CognitoIdentityCredentials({
      IdentityPoolId,
      Logins: {
        [`cognito-idp.${AWS_REGION}.amazonaws.com/${UserPoolId}`]: token,
      },
    });
    credentials.refresh((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(credentials);
      }
    });
  });

const generateUser = async () => {
  const user = generator();
  await createUser(user);
  const { Session } = await initiateAuth(user);
  const data = await authChallenge(Session, user);
  const {
    AuthenticationResult: { IdToken },
  } = data;
  const credentials = await federatedAccess(IdToken);
  const { accessKeyId, secretAccessKey, sessionToken } = credentials;
  return {
    user,
    token: IdToken,
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken,
    },
    signed: {
      aws: {
        key: accessKeyId,
        secret: secretAccessKey,
        session: sessionToken,
        sign_version: 4,
      },
    },
  };
};

module.exports = {
  federatedAccess,
  generateUser,
  deleteUser,
};
