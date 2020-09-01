import { Schema, Document, HookNextFunction, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthType } from '../graphql';
import {
  PointSchema,
  ScopedDocsPlugin,
  ScopedDocsModel,
  ScopedDocsSchema,
} from '../shared/mongoose';
import { assetURLs } from '@footprint/common';
import { UsersService } from './users.service';

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
  footprintsCount: number;
}

export type IUserDocument = Document &
  IUser &
  ScopedDocsModel<IUser> & {
    /** Compara la password dell'utente con la password passata */
    comparePassword: (password: string) => Promise<boolean>;
  };

export type IUserModel = Model<IUserDocument> & ScopedDocsSchema<IUser>;

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
    scope: 'private',
  },
  // Metodo utilizzato per la creazione dell'account
  authType: {
    type: String,
    required: true,
    enum: ['LOCAL', 'GOOGLE'],
    scope: 'private',
  },
  // Versione dei token di aggiornamento
  // Cambia ogni volta che i token sono revocati
  refreshTokenVersion: {
    type: Number,
    default: 0,
    hide: true,
  },
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
  // Posizione geografica dell'utente
  location: {
    type: PointSchema,
    required: true,
  },
  googleID: { type: String, scope: 'private' },
  // URL dell'immagine del profilo
  profileImage: {
    type: String,
    required: false,
    default: assetURLs.blankAvatar,
  },
  // Data di apertura del profilo
  created_at: { type: Date, default: Date.now },
  // Numero di followers
  followersCount: { type: Number, default: 0 },
  // Numero di utenti seguiti
  followingCount: { type: Number, default: 0 },
  // Numero di footprint
  footprintsCount: { type: Number, default: 0 },
});

// Index
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ googleID: 1 });

// Plugin
UserSchema.plugin(mongooseHidden);
UserSchema.plugin(ScopedDocsPlugin<IUser>());

// Salva l'hash della password al posto del semplice testo
UserSchema.pre('save', async function(
  this: IUserDocument,
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
  this: IUserDocument,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.localPassword);
};
