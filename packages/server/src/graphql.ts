
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

export interface NearToInput {
    lng: number;
    lat: number;
    minDistance?: number;
    maxDistance?: number;
}

export interface PointLocation {
    coordinates: number[];
    locationName: string;
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
    signup(email: string, password: string, username: string, location: PointLocation, profileImage?: string): EmailResponse | Promise<EmailResponse>;
    signupWithGoogle(username: string, location: PointLocation, profileImage?: string): GoogleAuthResult | Promise<GoogleAuthResult>;
    login(email: string, password: string): AuthPayload | Promise<AuthPayload>;
    loginWithGoogle(): GoogleAuthResult | Promise<GoogleAuthResult>;
    verfyUser(token: string): VerfyUserResponse | Promise<VerfyUserResponse>;
    postComment(contentId: string, text: string): Comment | Promise<Comment>;
    delateComment(contentId: string, id: string): ProcessResult | Promise<ProcessResult>;
    addFootprint(title: string, coordinates: number[], locationName: string, media: string, body?: string): Footprint | Promise<Footprint>;
    followUser(target: string): ProcessResult | Promise<ProcessResult>;
    unfollowUser(target: string): ProcessResult | Promise<ProcessResult>;
    addLikeToFootprint(footprintId: string): ProcessResult | Promise<ProcessResult>;
    removeFootprintLike(footprintId: string): ProcessResult | Promise<ProcessResult>;
    markFeedItemAsSeen(id: string): ProcessResult | Promise<ProcessResult>;
    sendConfirmationEmail(email: string): EmailResponse | Promise<EmailResponse>;
    forgotPassword(email: string): EmailResponse | Promise<EmailResponse>;
    changePasswordWithToken(token: string, newPassword: string): ProcessResult | Promise<ProcessResult>;
    editProfile(username?: string, email?: string, profileImage?: string, location?: PointLocation): EditProfileResult | Promise<EditProfileResult>;
}

export interface Comment {
    id: string;
    text: string;
    authorId: string;
    author: User;
    createdAt: Date;
}

export interface IQuery {
    getComments(contentId: string, page?: number): Comment[] | Promise<Comment[]>;
    getFootprintById(id: string): Footprint | Promise<Footprint>;
    getNearFootprints(lng: number, lat: number, minDistance?: number, maxDistance?: number): Footprint[] | Promise<Footprint[]>;
    getFootprintsByUser(userId: string): Footprint[] | Promise<Footprint[]>;
    getFollowers(userId: string, pagination?: PaginationOptions): User[] | Promise<User[]>;
    getFollowing(userId: string, pagination?: PaginationOptions): User[] | Promise<User[]>;
    getLikes(footprintId: string, page?: number): User[] | Promise<User[]>;
    getNewsFeed(pagination?: PaginationOptions): NewsFeedItem[] | Promise<NewsFeedItem[]>;
    whoami(): User | Promise<User>;
    isEmailAlreadyUsed(email: string): boolean | Promise<boolean>;
    isUsernameAlreadyUsed(username: string): boolean | Promise<boolean>;
    getUserById(id: string): User | Promise<User>;
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
    likesCount: number;
}

export interface Friendship {
    id: string;
    target: string;
    user: string;
}

export interface NewsFeedItem {
    id: string;
    ownerId: string;
    footprint: Footprint;
    createdAt: Date;
    isSeen: boolean;
}

export interface ProcessResult {
    success: boolean;
}

export interface Location {
    type: LocationType;
    coordinates: number[];
    locationName: string;
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
    footprintsCount: number;
    location: Location;
    followers: User[];
    following: User[];
    isFollowed?: boolean;
    email?: string;
    authType?: AuthType;
    googleID?: string;
}

export interface EditProfileResult {
    success: boolean;
    isEmailConfirmationRequired: boolean;
}
