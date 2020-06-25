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
  googleOAuth: {
    WEB_CLIENT_ID: string;
  };
}
