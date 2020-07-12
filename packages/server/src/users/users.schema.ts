import { Schema, Document, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthType } from '../graphql';
const mongooseHidden = require('mongoose-hidden')();

export interface IUser {
  id: string;
  username: string;
  email: string;
  authType: AuthType;
  refreshTokenVersion?: number;
  localPassword?: string;
  isVerified?: boolean;
  googleID?: string;
  profileImage?: string;
  created_at?: string;
  followersCount: number;
  followingCount: number;

  /** Compara la password dell'utente con la password passata */
  comparePassword: (password: string) => Promise<boolean>;
}

export type IUserModel = Document & IUser;

// SCHEMA DEL DATABASE
export const UserSchema = new Schema({
  // Username
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Email
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  // Metodo utilizzato per la creazione dell'account
  authType: {
    type: String,
    required: true,
    enum: ['LOCAL', 'GOOGLE'],
  },
  // Versione dei token di aggiornamento
  // Cambia ogni volta che i token sono revocati
  refreshTokenVersion: { type: Number, default: 0 },
  // Password dell'account (se locale)
  localPassword: {
    type: String,
    hide: true,
    required: function(this: IUser) {
      return this.authType === AuthType.LOCAL;
    },
  },
  // Se è stata verificata l'email
  // Campo richiesto solo se l'utente si registrato in locale
  isVerified: {
    type: Boolean,
    required: function(this: IUser) {
      return this.authType === AuthType.LOCAL;
    },
  },
  // ID Google (richiesto solo se l'utente ha eseguito l'acesso con google)
  googleID: { type: String },
  // URL dell'immagine del profilo
  profileImage: { type: String, required: false },
  // Data di apertura del profilo
  created_at: { type: Date, default: Date.now },
  // Numero di followers
  followersCount: { type: Number, default: 0 },
  // Numero di utenti seguiti
  followingCount: { type: Number, default: 0 },
});

// Index
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ googleID: 1 });

// Plugin
UserSchema.plugin(mongooseHidden);

// Salva l'hash della password al posto del semplice testo
UserSchema.pre('save', async function(
  this: IUserModel,
  next: HookNextFunction,
) {
  // genera l'hash della password solo se è stata modificata o è nuova
  if (!this.localPassword && !this.isModified('localPassword')) return next();

  try {
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(this.localPassword, salt);
    this.localPassword = hash;
  } catch (err) {
    return next(err);
  }
});

/**
 * Compara la password dell'utente con la password passata
 * @param password
 */
UserSchema.methods.comparePassword = async function(
  this: IUserModel,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.localPassword);
};

/* UserSchema.methods.toJSON = function(this: IUserModel) {
  var obj: IUser = this.toObject();
  delete obj.localPassword;
  return obj;
};
 */
