
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum AuthType {
    LOCAL = "LOCAL",
    GOOGLE = "GOOGLE"
}

export interface AuthPayload {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface GoogleProfile {
    id: string;
    name: string;
    email: string;
    picture: string;
}

export interface GoogleAuthResult {
    isRegistrationRequired: boolean;
    tokens?: AuthPayload;
    googleProfile?: GoogleProfile;
}

export interface IMutation {
    signup(username: string, email: string, password: string): ProcessResult | Promise<ProcessResult>;
    signupWithGoogle(username: string): GoogleAuthResult | Promise<GoogleAuthResult>;
    login(email: string, password: string): AuthPayload | Promise<AuthPayload>;
    loginWithGoogle(): GoogleAuthResult | Promise<GoogleAuthResult>;
}

export interface ProcessResult {
    success: boolean;
}

export interface User {
    id: string;
    profileImage: string;
    username: string;
    email?: string;
    authType?: AuthType;
    googleID?: string;
}

export interface IQuery {
    whoami(): User | Promise<User>;
    isEmailAlreadyUsed(email: string): boolean | Promise<boolean>;
    isUsernameAlreadyUsed(username: string): boolean | Promise<boolean>;
    getUserById(id: string): User | Promise<User>;
}
