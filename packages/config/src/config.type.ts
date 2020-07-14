export interface IConfig {
  /** Nome dell'applicazione */
  APP_NAME: string;
  /** Se l'istanza è in produzione */
  IS_PRODUCTION: boolean;
  /** Token di accesso per l'API di Mapbox */
  MAPBOX_ACCESS_TOKEN: string;
  server: {
    /** Porta del server */
    PORT: number;
    /** URL dell'API */
    API_URL: string;
  };
  database: {
    /** URI di conessione al server */
    URI: string;
  };
  webApp: {
    /** Dominio della webapp */
    DOMAIN: string;
  };
  /** Autorizzazione tramite google */
  googleOAuth: {
    WEB_CLIENT_ID: string;
    WEB_CLIENT_SECRET: string;
  };
  /** Autenticazione locale */
  auth: {
    /** Chiave segreta dei JWT di accesso */
    ACCESS_TOKEN_SECRET: string;
    /** Durata dei token di accesso  */
    ACCESS_TOKEN_EXPIRATION: number;
    /** Chiave segreta dei token di aggiornamento */
    REFRESH_TOKEN_SECRET: string;
    /** Durata dei token di aggiornamento */
    REFRESH_TOKEN_EXPIRATION: number;
  };
  /** Servizio per spedire email */
  emailService: {
    HOST: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
    SENDER: string;
  };
  /** Storge di immagini e video */
  cloudinary: {
    API_KEY: string;
    API_SECRET: string;
    UPLOAD_PRESENT: string;
    CLOUD_NAME: string;
  };
}
