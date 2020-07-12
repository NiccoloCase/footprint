
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

export enum LocationType {
    Point = "Point"
}

export enum TokenScope {
    USER_CONFIRMATION = "USER_CONFIRMATION",
    FORGOT_PASSWORD = "FORGOT_PASSWORD"
}

export interface PaginationOptions {
    offset?: number;
    limit?: number;
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
    verfyUser(token: string): VerfyUserResponse | Promise<VerfyUserResponse>;
    addFootprint(title: string, coordinates: number[], body?: string, media?: string): Footprint | Promise<Footprint>;
    followUser(target: string): ProcessResult | Promise<ProcessResult>;
    unfollowUser(target: string): ProcessResult | Promise<ProcessResult>;
    sendConfirmationEmail(email: string): EmailResponse | Promise<EmailResponse>;
    forgotPassword(email: string): EmailResponse | Promise<EmailResponse>;
    changePasswordWithToken(token: string, newPassword: string): ProcessResult | Promise<ProcessResult>;
}

export interface EmailResponse {
    recipient?: string;
    success: boolean;
}

export interface Footprint {
    id: string;
    authorId: string;
    author: User;
    title: string;
    body?: string;
    media?: string;
    location: Location;
    created_at: Date;
}

export interface IQuery {
    getFootprintById(id: string): Footprint | Promise<Footprint>;
    getNearFootprints(lng: number, lat: number, minDistance?: number, maxDistance?: number): Footprint[] | Promise<Footprint[]>;
    getFollowers(userId: string, pagination?: PaginationOptions): User[] | Promise<User[]>;
    getFollowing(userId: string, pagination?: PaginationOptions): User[] | Promise<User[]>;
    whoami(): User | Promise<User>;
    isEmailAlreadyUsed(email: string): boolean | Promise<boolean>;
    isUsernameAlreadyUsed(username: string): boolean | Promise<boolean>;
    getUserById(id: string): User | Promise<User>;
}

export interface Friendship {
    id: string;
    target: string;
    user: string;
}

export interface ProcessResult {
    success: boolean;
}

export interface Location {
    type: LocationType;
    coordinates: number[];
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
    followersCount: number;
    followingCount: number;
    email?: string;
    authType?: AuthType;
    googleID?: string;
}
