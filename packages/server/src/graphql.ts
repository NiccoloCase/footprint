
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum TokenScope {
    USER_CONFIRMATION = "USER_CONFIRMATION",
    FORGOT_PASSWORD = "FORGOT_PASSWORD"
}

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

export interface VerfyUserResponse {
    success: boolean;
    tokens?: AuthPayload;
}

export interface IMutation {
    signup(username: string, email: string, password: string): EmailResponse | Promise<EmailResponse>;
    signupWithGoogle(username: string): GoogleAuthResult | Promise<GoogleAuthResult>;
    login(email: string, password: string): AuthPayload | Promise<AuthPayload>;
    loginWithGoogle(): GoogleAuthResult | Promise<GoogleAuthResult>;
    verfyUser(token?: string): VerfyUserResponse | Promise<VerfyUserResponse>;
    sendConfirmationEmail(email: string): EmailResponse | Promise<EmailResponse>;
}

export interface EmailResponse {
    recipient?: string;
    success: boolean;
}

export interface ProcessResult {
    success: boolean;
}

export interface Token {
    id: string;
    userId: string;
    scope: TokenScope;
}

export interface TokenGenerationResult {
    email: string;
    tokenDigits: number;
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
