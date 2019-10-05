import auth0 from 'auth0-js';
import IUser from '@/model/IUser';

const appDomain = process.env.VUE_APP_AUTH0_DOMAIN;
const clientID = process.env.VUE_APP_AUTH0_API_AUDIENCE;
const isDevelopMode = process.env.NODE_ENV === 'develop';
const redirectUri = isDevelopMode
  ? 'http://localhost:8080'
  : `https://${process.env.VUE_APP_AUTH_DOMAIN}`;

const nullUser: IUser = {
  Id: '',
  Email: '',
  displayName: 'Anonymous',
  photoURL: null
};

export class Auth0Client {
  private _auth0Client: auth0.WebAuth;
  private _idToken: string | null = null;
  private _profile: IUser = nullUser;

  constructor() {
    this._auth0Client = new auth0.WebAuth({
      domain: appDomain,
      audience: `https://${appDomain}/userinfo`,
      clientID,
      redirectUri,
      responseType: 'token id_token',
      scope: 'openid profile email'
    });
    // TODO: ここでSSOの認証状態を確認して SignIn.vue に遷移しないようにする
  }

  get idToken() {
    return this._idToken;
  }

  get profile() {
    return this._profile;
  }

  get isSignIn() {
    return this._idToken !== null;
  }

  handleCallback() {
    return new Promise((resolve, reject) => {
      this._auth0Client.parseHash(async (err, authResult) => {
        window.location.hash = '';
        if (err) {
          return reject(err);
        }

        if (!authResult || !authResult.idToken) {
          // not an authentication request
          return resolve(false);
        }
        this._idToken = authResult.idToken;
        const user = authResult.idTokenPayload;
        this._profile = {
          Id: user.sub,
          Email: user.email,
          displayName: user.name,
          photoURL: user.picture
        } as IUser;

        return resolve(true);
      });
    });
  }

  signIn(redirectPath: string) {
    console.log(redirectUri, redirectPath);
    this._auth0Client.authorize({
      redirectUri: `${redirectUri}${redirectPath}`
    });
  }

  signOut() {
    this._idToken = null;
    this._profile = nullUser;
    this._auth0Client.logout({
      clientID,
      federated: false,
      returnTo: redirectUri
    });
  }
}

export const auth0Client = new Auth0Client();
