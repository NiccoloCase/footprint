import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export enum AuthType {
  Local = 'LOCAL',
  Google = 'GOOGLE'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  expiresIn: Scalars['Int'];
};

export type GoogleProfile = {
  __typename?: 'GoogleProfile';
  id: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  picture: Scalars['String'];
};

export type GoogleAuthResult = {
  __typename?: 'GoogleAuthResult';
  isRegistrationRequired: Scalars['Boolean'];
  tokens?: Maybe<AuthPayload>;
  googleProfile?: Maybe<GoogleProfile>;
};

export type VerfyUserResponse = {
  __typename?: 'VerfyUserResponse';
  success: Scalars['Boolean'];
  tokens?: Maybe<AuthPayload>;
};

export type Mutation = {
  __typename?: 'Mutation';
  signup: EmailResponse;
  signupWithGoogle: GoogleAuthResult;
  login: AuthPayload;
  loginWithGoogle: GoogleAuthResult;
  verfyUser: VerfyUserResponse;
  postComment: Comment;
  delateComment: ProcessResult;
  addFootprint: Footprint;
  followUser: ProcessResult;
  unfollowUser: ProcessResult;
  addLikeToFootprint: ProcessResult;
  removeFootprintLike: ProcessResult;
  markFeedItemAsSeen: ProcessResult;
  sendConfirmationEmail: EmailResponse;
  forgotPassword: EmailResponse;
  changePasswordWithToken: ProcessResult;
  editProfile: EditProfileResult;
  editPassword: ProcessResult;
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  location: PointLocation;
  profileImage?: Maybe<Scalars['String']>;
};


export type MutationSignupWithGoogleArgs = {
  username: Scalars['String'];
  location: PointLocation;
  profileImage?: Maybe<Scalars['String']>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerfyUserArgs = {
  token: Scalars['String'];
};


export type MutationPostCommentArgs = {
  contentId: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationDelateCommentArgs = {
  contentId: Scalars['ID'];
  id: Scalars['ID'];
};


export type MutationAddFootprintArgs = {
  title: Scalars['String'];
  coordinates: Array<Scalars['Float']>;
  locationName: Scalars['String'];
  media: Scalars['String'];
  body?: Maybe<Scalars['String']>;
};


export type MutationFollowUserArgs = {
  target: Scalars['ID'];
};


export type MutationUnfollowUserArgs = {
  target: Scalars['ID'];
};


export type MutationAddLikeToFootprintArgs = {
  footprintId: Scalars['ID'];
};


export type MutationRemoveFootprintLikeArgs = {
  footprintId: Scalars['ID'];
};


export type MutationMarkFeedItemAsSeenArgs = {
  id: Scalars['ID'];
};


export type MutationSendConfirmationEmailArgs = {
  email: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordWithTokenArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationEditProfileArgs = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  location?: Maybe<PointLocation>;
};


export type MutationEditPasswordArgs = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['ID'];
  text: Scalars['String'];
  authorId: Scalars['ID'];
  author: User;
  createdAt: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  getComments: Array<Maybe<Comment>>;
  getFootprintById: Footprint;
  getNearFootprints: Array<Footprint>;
  getFootprintsByUser: Array<Footprint>;
  getFollowers: Array<User>;
  getFollowing: Array<User>;
  getLikes: Array<User>;
  getNewsFeed: Array<NewsFeedItem>;
  whoami: User;
  isEmailAlreadyUsed: Scalars['Boolean'];
  isUsernameAlreadyUsed: Scalars['Boolean'];
  getUserById: User;
  searchUser: Array<User>;
};


export type QueryGetCommentsArgs = {
  contentId: Scalars['ID'];
  page?: Maybe<Scalars['Int']>;
};


export type QueryGetFootprintByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetNearFootprintsArgs = {
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  minDistance?: Maybe<Scalars['Float']>;
  maxDistance?: Maybe<Scalars['Float']>;
};


export type QueryGetFootprintsByUserArgs = {
  userId: Scalars['ID'];
};


export type QueryGetFollowersArgs = {
  userId: Scalars['ID'];
  pagination?: Maybe<PaginationOptions>;
};


export type QueryGetFollowingArgs = {
  userId: Scalars['ID'];
  pagination?: Maybe<PaginationOptions>;
};


export type QueryGetLikesArgs = {
  footprintId: Scalars['ID'];
  page?: Maybe<Scalars['Int']>;
};


export type QueryGetNewsFeedArgs = {
  pagination?: Maybe<PaginationOptions>;
};


export type QueryIsEmailAlreadyUsedArgs = {
  email: Scalars['String'];
};


export type QueryIsUsernameAlreadyUsedArgs = {
  username: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID'];
};


export type QuerySearchUserArgs = {
  query: Scalars['String'];
  pagination?: Maybe<PaginationOptions>;
};

export type EmailResponse = {
  __typename?: 'EmailResponse';
  recipient?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Footprint = {
  __typename?: 'Footprint';
  id: Scalars['ID'];
  authorId: Scalars['ID'];
  author: User;
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['String']>;
  location: Location;
  created_at: Scalars['Date'];
  likesCount: Scalars['Int'];
};

export type Friendship = {
  __typename?: 'Friendship';
  id: Scalars['ID'];
  target: Scalars['String'];
  user: Scalars['String'];
};

export type NewsFeedItem = {
  __typename?: 'NewsFeedItem';
  id: Scalars['ID'];
  ownerId: Scalars['ID'];
  footprint: Footprint;
  createdAt: Scalars['Date'];
  isSeen: Scalars['Boolean'];
};

export type ProcessResult = {
  __typename?: 'ProcessResult';
  success: Scalars['Boolean'];
};


export type NearToInput = {
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  minDistance?: Maybe<Scalars['Float']>;
  maxDistance?: Maybe<Scalars['Float']>;
};

export enum LocationType {
  Point = 'Point'
}

export type Location = {
  __typename?: 'Location';
  type: LocationType;
  coordinates: Array<Scalars['Float']>;
  locationName: Scalars['String'];
};

export type PointLocation = {
  coordinates: Array<Scalars['Float']>;
  locationName: Scalars['String'];
};

export type PaginationOptions = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export enum TokenScope {
  UserConfirmation = 'USER_CONFIRMATION',
  ForgotPassword = 'FORGOT_PASSWORD'
}

export type Token = {
  __typename?: 'Token';
  id: Scalars['ID'];
  userId: Scalars['String'];
  scope: TokenScope;
};

export type TokenGenerationResult = {
  __typename?: 'TokenGenerationResult';
  email: Scalars['String'];
  tokenDigits: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  profileImage: Scalars['String'];
  username: Scalars['String'];
  followersCount: Scalars['Int'];
  followingCount: Scalars['Int'];
  footprintsCount: Scalars['Int'];
  location: Location;
  followers: Array<User>;
  following: Array<User>;
  isFollowed?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  authType?: Maybe<AuthType>;
  googleID?: Maybe<Scalars['String']>;
};


export type UserFollowersArgs = {
  pagination?: Maybe<PaginationOptions>;
};


export type UserFollowingArgs = {
  pagination?: Maybe<PaginationOptions>;
};


export type UserIsFollowedArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type EditProfileResult = {
  __typename?: 'EditProfileResult';
  success: Scalars['Boolean'];
  isEmailConfirmationRequired: Scalars['Boolean'];
};

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  location: PointLocation;
  profileImage?: Maybe<Scalars['String']>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'EmailResponse' }
    & Pick<EmailResponse, 'success'>
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AuthPayload' }
    & Pick<AuthPayload, 'accessToken' | 'refreshToken'>
  ) }
);

export type SignupWithGoogleMutationVariables = Exact<{
  username: Scalars['String'];
  location: PointLocation;
  profileImage?: Maybe<Scalars['String']>;
}>;


export type SignupWithGoogleMutation = (
  { __typename?: 'Mutation' }
  & { signupWithGoogle: (
    { __typename?: 'GoogleAuthResult' }
    & Pick<GoogleAuthResult, 'isRegistrationRequired'>
    & { googleProfile?: Maybe<(
      { __typename?: 'GoogleProfile' }
      & Pick<GoogleProfile, 'name' | 'id' | 'email' | 'picture'>
    )>, tokens?: Maybe<(
      { __typename?: 'AuthPayload' }
      & Pick<AuthPayload, 'accessToken' | 'refreshToken' | 'expiresIn'>
    )> }
  ) }
);

export type LoginWithGoogleMutationVariables = Exact<{ [key: string]: never; }>;


export type LoginWithGoogleMutation = (
  { __typename?: 'Mutation' }
  & { loginWithGoogle: (
    { __typename?: 'GoogleAuthResult' }
    & Pick<GoogleAuthResult, 'isRegistrationRequired'>
    & { googleProfile?: Maybe<(
      { __typename?: 'GoogleProfile' }
      & Pick<GoogleProfile, 'name' | 'id' | 'email' | 'picture'>
    )>, tokens?: Maybe<(
      { __typename?: 'AuthPayload' }
      & Pick<AuthPayload, 'accessToken' | 'refreshToken' | 'expiresIn'>
    )> }
  ) }
);

export type GetNearFootprintsQueryVariables = Exact<{
  lng: Scalars['Float'];
  lat: Scalars['Float'];
  maxDistance: Scalars['Float'];
}>;


export type GetNearFootprintsQuery = (
  { __typename?: 'Query' }
  & { getNearFootprints: Array<(
    { __typename?: 'Footprint' }
    & Pick<Footprint, 'id' | 'title' | 'media'>
    & { location: (
      { __typename?: 'Location' }
      & Pick<Location, 'coordinates' | 'locationName'>
    ), author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'profileImage'>
    ) }
  )> }
);

export type GetNewsFeedQueryVariables = Exact<{
  pagination?: Maybe<PaginationOptions>;
}>;


export type GetNewsFeedQuery = (
  { __typename?: 'Query' }
  & { getNewsFeed: Array<(
    { __typename?: 'NewsFeedItem' }
    & Pick<NewsFeedItem, 'id' | 'isSeen'>
    & { footprint: (
      { __typename?: 'Footprint' }
      & Pick<Footprint, 'id' | 'title' | 'media' | 'authorId'>
      & { location: (
        { __typename?: 'Location' }
        & Pick<Location, 'coordinates' | 'locationName'>
      ), author: (
        { __typename?: 'User' }
        & Pick<User, 'username' | 'profileImage'>
      ) }
    ) }
  )> }
);

export type GetFootprintsByUserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetFootprintsByUserQuery = (
  { __typename?: 'Query' }
  & { getFootprintsByUser: Array<(
    { __typename?: 'Footprint' }
    & Pick<Footprint, 'id' | 'title' | 'body' | 'media' | 'likesCount'>
    & { location: (
      { __typename?: 'Location' }
      & Pick<Location, 'coordinates' | 'locationName'>
    ) }
  )> }
);

export type GetFootprintsByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetFootprintsByIdQuery = (
  { __typename?: 'Query' }
  & { getFootprintById: (
    { __typename?: 'Footprint' }
    & Pick<Footprint, 'id' | 'title' | 'body' | 'media' | 'likesCount'>
    & { location: (
      { __typename?: 'Location' }
      & Pick<Location, 'coordinates' | 'locationName'>
    ), author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'profileImage'>
    ) }
  ) }
);

export type MarkFeedItemAsSeenMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MarkFeedItemAsSeenMutation = (
  { __typename?: 'Mutation' }
  & { markFeedItemAsSeen: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type RemoveFootprintLikeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveFootprintLikeMutation = (
  { __typename?: 'Mutation' }
  & { removeFootprintLike: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type AddLikeToFootprintMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AddLikeToFootprintMutation = (
  { __typename?: 'Mutation' }
  & { addLikeToFootprint: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type PostCommentMutationVariables = Exact<{
  contentId: Scalars['ID'];
  text: Scalars['String'];
}>;


export type PostCommentMutation = (
  { __typename?: 'Mutation' }
  & { postComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'text' | 'createdAt'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'profileImage'>
    ) }
  ) }
);

export type DelateCommentMutationVariables = Exact<{
  contentId: Scalars['ID'];
  id: Scalars['ID'];
}>;


export type DelateCommentMutation = (
  { __typename?: 'Mutation' }
  & { delateComment: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type GetCommentsQueryVariables = Exact<{
  contentId: Scalars['ID'];
  page?: Maybe<Scalars['Int']>;
}>;


export type GetCommentsQuery = (
  { __typename?: 'Query' }
  & { getComments: Array<Maybe<(
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'text' | 'createdAt'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'profileImage'>
    ) }
  )>> }
);

export type AddFootprintMutationVariables = Exact<{
  title: Scalars['String'];
  body: Scalars['String'];
  coordinates: Array<Scalars['Float']>;
  media: Scalars['String'];
  locationName: Scalars['String'];
}>;


export type AddFootprintMutation = (
  { __typename?: 'Mutation' }
  & { addFootprint: (
    { __typename?: 'Footprint' }
    & Pick<Footprint, 'id'>
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { whoami: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'authType' | 'profileImage' | 'followersCount' | 'followingCount' | 'footprintsCount'>
    & { location: (
      { __typename?: 'Location' }
      & Pick<Location, 'coordinates' | 'locationName'>
    ), followers: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'profileImage'>
    )> }
  ) }
);

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID'];
  isFollowedBy?: Maybe<Scalars['ID']>;
}>;


export type GetUserByIdQuery = (
  { __typename?: 'Query' }
  & { getUserById: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'profileImage' | 'isFollowed' | 'followersCount' | 'followingCount' | 'footprintsCount'>
    & { location: (
      { __typename?: 'Location' }
      & Pick<Location, 'coordinates' | 'locationName'>
    ), followers: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'profileImage'>
    )> }
  ) }
);

export type GetFollowersQueryVariables = Exact<{
  userId: Scalars['ID'];
  pagination?: Maybe<PaginationOptions>;
}>;


export type GetFollowersQuery = (
  { __typename?: 'Query' }
  & { getFollowers: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'profileImage'>
  )> }
);

export type GetFollowingQueryVariables = Exact<{
  userId: Scalars['ID'];
  pagination?: Maybe<PaginationOptions>;
}>;


export type GetFollowingQuery = (
  { __typename?: 'Query' }
  & { getFollowing: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'profileImage'>
  )> }
);

export type IsEmailAlreadyUsedQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type IsEmailAlreadyUsedQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isEmailAlreadyUsed'>
);

export type SearchUserQueryVariables = Exact<{
  query: Scalars['String'];
  pagination?: Maybe<PaginationOptions>;
}>;


export type SearchUserQuery = (
  { __typename?: 'Query' }
  & { searchUser: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'profileImage'>
  )> }
);

export type IsUsernameAlreadyUsedQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type IsUsernameAlreadyUsedQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isUsernameAlreadyUsed'>
);

export type SendConfirmationEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendConfirmationEmailMutation = (
  { __typename?: 'Mutation' }
  & { sendConfirmationEmail: (
    { __typename?: 'EmailResponse' }
    & Pick<EmailResponse, 'success' | 'recipient'>
  ) }
);

export type VerfyUserMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerfyUserMutation = (
  { __typename?: 'Mutation' }
  & { verfyUser: (
    { __typename?: 'VerfyUserResponse' }
    & Pick<VerfyUserResponse, 'success'>
    & { tokens?: Maybe<(
      { __typename?: 'AuthPayload' }
      & Pick<AuthPayload, 'accessToken' | 'refreshToken' | 'expiresIn'>
    )> }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { forgotPassword: (
    { __typename?: 'EmailResponse' }
    & Pick<EmailResponse, 'recipient' | 'success'>
  ) }
);

export type ChangePasswordWithTokenMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordWithTokenMutation = (
  { __typename?: 'Mutation' }
  & { changePasswordWithToken: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type FollowUserMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type FollowUserMutation = (
  { __typename?: 'Mutation' }
  & { followUser: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type UnfollowUserMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type UnfollowUserMutation = (
  { __typename?: 'Mutation' }
  & { unfollowUser: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);

export type EditProfileMutationVariables = Exact<{
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  location?: Maybe<PointLocation>;
  profileImage?: Maybe<Scalars['String']>;
}>;


export type EditProfileMutation = (
  { __typename?: 'Mutation' }
  & { editProfile: (
    { __typename?: 'EditProfileResult' }
    & Pick<EditProfileResult, 'success' | 'isEmailConfirmationRequired'>
  ) }
);

export type EditPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type EditPasswordMutation = (
  { __typename?: 'Mutation' }
  & { editPassword: (
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
  ) }
);


export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $location: PointLocation!, $profileImage: String) {
  signup(username: $username, email: $email, password: $password, location: $location, profileImage: $profileImage) {
    success
  }
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      location: // value for 'location'
 *      profileImage: // value for 'profileImage'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    refreshToken
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignupWithGoogleDocument = gql`
    mutation SignupWithGoogle($username: String!, $location: PointLocation!, $profileImage: String) {
  signupWithGoogle(username: $username, location: $location, profileImage: $profileImage) {
    isRegistrationRequired
    googleProfile {
      name
      id
      email
      picture
    }
    tokens {
      accessToken
      refreshToken
      expiresIn
    }
  }
}
    `;
export type SignupWithGoogleMutationFn = ApolloReactCommon.MutationFunction<SignupWithGoogleMutation, SignupWithGoogleMutationVariables>;

/**
 * __useSignupWithGoogleMutation__
 *
 * To run a mutation, you first call `useSignupWithGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupWithGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupWithGoogleMutation, { data, loading, error }] = useSignupWithGoogleMutation({
 *   variables: {
 *      username: // value for 'username'
 *      location: // value for 'location'
 *      profileImage: // value for 'profileImage'
 *   },
 * });
 */
export function useSignupWithGoogleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignupWithGoogleMutation, SignupWithGoogleMutationVariables>) {
        return ApolloReactHooks.useMutation<SignupWithGoogleMutation, SignupWithGoogleMutationVariables>(SignupWithGoogleDocument, baseOptions);
      }
export type SignupWithGoogleMutationHookResult = ReturnType<typeof useSignupWithGoogleMutation>;
export type SignupWithGoogleMutationResult = ApolloReactCommon.MutationResult<SignupWithGoogleMutation>;
export type SignupWithGoogleMutationOptions = ApolloReactCommon.BaseMutationOptions<SignupWithGoogleMutation, SignupWithGoogleMutationVariables>;
export const LoginWithGoogleDocument = gql`
    mutation LoginWithGoogle {
  loginWithGoogle {
    isRegistrationRequired
    googleProfile {
      name
      id
      email
      picture
    }
    tokens {
      accessToken
      refreshToken
      expiresIn
    }
  }
}
    `;
export type LoginWithGoogleMutationFn = ApolloReactCommon.MutationFunction<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;

/**
 * __useLoginWithGoogleMutation__
 *
 * To run a mutation, you first call `useLoginWithGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithGoogleMutation, { data, loading, error }] = useLoginWithGoogleMutation({
 *   variables: {
 *   },
 * });
 */
export function useLoginWithGoogleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>(LoginWithGoogleDocument, baseOptions);
      }
export type LoginWithGoogleMutationHookResult = ReturnType<typeof useLoginWithGoogleMutation>;
export type LoginWithGoogleMutationResult = ApolloReactCommon.MutationResult<LoginWithGoogleMutation>;
export type LoginWithGoogleMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;
export const GetNearFootprintsDocument = gql`
    query GetNearFootprints($lng: Float!, $lat: Float!, $maxDistance: Float!) {
  getNearFootprints(lng: $lng, lat: $lat, maxDistance: $maxDistance) {
    id
    title
    media
    location {
      coordinates
      locationName
    }
    author {
      id
      username
      profileImage
    }
  }
}
    `;

/**
 * __useGetNearFootprintsQuery__
 *
 * To run a query within a React component, call `useGetNearFootprintsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNearFootprintsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNearFootprintsQuery({
 *   variables: {
 *      lng: // value for 'lng'
 *      lat: // value for 'lat'
 *      maxDistance: // value for 'maxDistance'
 *   },
 * });
 */
export function useGetNearFootprintsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNearFootprintsQuery, GetNearFootprintsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetNearFootprintsQuery, GetNearFootprintsQueryVariables>(GetNearFootprintsDocument, baseOptions);
      }
export function useGetNearFootprintsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNearFootprintsQuery, GetNearFootprintsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetNearFootprintsQuery, GetNearFootprintsQueryVariables>(GetNearFootprintsDocument, baseOptions);
        }
export type GetNearFootprintsQueryHookResult = ReturnType<typeof useGetNearFootprintsQuery>;
export type GetNearFootprintsLazyQueryHookResult = ReturnType<typeof useGetNearFootprintsLazyQuery>;
export type GetNearFootprintsQueryResult = ApolloReactCommon.QueryResult<GetNearFootprintsQuery, GetNearFootprintsQueryVariables>;
export const GetNewsFeedDocument = gql`
    query GetNewsFeed($pagination: PaginationOptions) {
  getNewsFeed(pagination: $pagination) {
    id
    isSeen
    footprint {
      id
      title
      media
      location {
        coordinates
        locationName
      }
      authorId
      author {
        username
        profileImage
      }
    }
  }
}
    `;

/**
 * __useGetNewsFeedQuery__
 *
 * To run a query within a React component, call `useGetNewsFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNewsFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewsFeedQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetNewsFeedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNewsFeedQuery, GetNewsFeedQueryVariables>) {
        return ApolloReactHooks.useQuery<GetNewsFeedQuery, GetNewsFeedQueryVariables>(GetNewsFeedDocument, baseOptions);
      }
export function useGetNewsFeedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNewsFeedQuery, GetNewsFeedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetNewsFeedQuery, GetNewsFeedQueryVariables>(GetNewsFeedDocument, baseOptions);
        }
export type GetNewsFeedQueryHookResult = ReturnType<typeof useGetNewsFeedQuery>;
export type GetNewsFeedLazyQueryHookResult = ReturnType<typeof useGetNewsFeedLazyQuery>;
export type GetNewsFeedQueryResult = ApolloReactCommon.QueryResult<GetNewsFeedQuery, GetNewsFeedQueryVariables>;
export const GetFootprintsByUserDocument = gql`
    query GetFootprintsByUser($userId: ID!) {
  getFootprintsByUser(userId: $userId) {
    id
    title
    body
    media
    likesCount
    location {
      coordinates
      locationName
    }
  }
}
    `;

/**
 * __useGetFootprintsByUserQuery__
 *
 * To run a query within a React component, call `useGetFootprintsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFootprintsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFootprintsByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFootprintsByUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFootprintsByUserQuery, GetFootprintsByUserQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFootprintsByUserQuery, GetFootprintsByUserQueryVariables>(GetFootprintsByUserDocument, baseOptions);
      }
export function useGetFootprintsByUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFootprintsByUserQuery, GetFootprintsByUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFootprintsByUserQuery, GetFootprintsByUserQueryVariables>(GetFootprintsByUserDocument, baseOptions);
        }
export type GetFootprintsByUserQueryHookResult = ReturnType<typeof useGetFootprintsByUserQuery>;
export type GetFootprintsByUserLazyQueryHookResult = ReturnType<typeof useGetFootprintsByUserLazyQuery>;
export type GetFootprintsByUserQueryResult = ApolloReactCommon.QueryResult<GetFootprintsByUserQuery, GetFootprintsByUserQueryVariables>;
export const GetFootprintsByIdDocument = gql`
    query GetFootprintsById($id: ID!) {
  getFootprintById(id: $id) {
    id
    title
    body
    media
    likesCount
    location {
      coordinates
      locationName
    }
    author {
      id
      username
      profileImage
    }
  }
}
    `;

/**
 * __useGetFootprintsByIdQuery__
 *
 * To run a query within a React component, call `useGetFootprintsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFootprintsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFootprintsByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFootprintsByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFootprintsByIdQuery, GetFootprintsByIdQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFootprintsByIdQuery, GetFootprintsByIdQueryVariables>(GetFootprintsByIdDocument, baseOptions);
      }
export function useGetFootprintsByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFootprintsByIdQuery, GetFootprintsByIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFootprintsByIdQuery, GetFootprintsByIdQueryVariables>(GetFootprintsByIdDocument, baseOptions);
        }
export type GetFootprintsByIdQueryHookResult = ReturnType<typeof useGetFootprintsByIdQuery>;
export type GetFootprintsByIdLazyQueryHookResult = ReturnType<typeof useGetFootprintsByIdLazyQuery>;
export type GetFootprintsByIdQueryResult = ApolloReactCommon.QueryResult<GetFootprintsByIdQuery, GetFootprintsByIdQueryVariables>;
export const MarkFeedItemAsSeenDocument = gql`
    mutation MarkFeedItemAsSeen($id: ID!) {
  markFeedItemAsSeen(id: $id) {
    success
  }
}
    `;
export type MarkFeedItemAsSeenMutationFn = ApolloReactCommon.MutationFunction<MarkFeedItemAsSeenMutation, MarkFeedItemAsSeenMutationVariables>;

/**
 * __useMarkFeedItemAsSeenMutation__
 *
 * To run a mutation, you first call `useMarkFeedItemAsSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkFeedItemAsSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markFeedItemAsSeenMutation, { data, loading, error }] = useMarkFeedItemAsSeenMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkFeedItemAsSeenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MarkFeedItemAsSeenMutation, MarkFeedItemAsSeenMutationVariables>) {
        return ApolloReactHooks.useMutation<MarkFeedItemAsSeenMutation, MarkFeedItemAsSeenMutationVariables>(MarkFeedItemAsSeenDocument, baseOptions);
      }
export type MarkFeedItemAsSeenMutationHookResult = ReturnType<typeof useMarkFeedItemAsSeenMutation>;
export type MarkFeedItemAsSeenMutationResult = ApolloReactCommon.MutationResult<MarkFeedItemAsSeenMutation>;
export type MarkFeedItemAsSeenMutationOptions = ApolloReactCommon.BaseMutationOptions<MarkFeedItemAsSeenMutation, MarkFeedItemAsSeenMutationVariables>;
export const RemoveFootprintLikeDocument = gql`
    mutation RemoveFootprintLike($id: ID!) {
  removeFootprintLike(footprintId: $id) {
    success
  }
}
    `;
export type RemoveFootprintLikeMutationFn = ApolloReactCommon.MutationFunction<RemoveFootprintLikeMutation, RemoveFootprintLikeMutationVariables>;

/**
 * __useRemoveFootprintLikeMutation__
 *
 * To run a mutation, you first call `useRemoveFootprintLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFootprintLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFootprintLikeMutation, { data, loading, error }] = useRemoveFootprintLikeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveFootprintLikeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveFootprintLikeMutation, RemoveFootprintLikeMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveFootprintLikeMutation, RemoveFootprintLikeMutationVariables>(RemoveFootprintLikeDocument, baseOptions);
      }
export type RemoveFootprintLikeMutationHookResult = ReturnType<typeof useRemoveFootprintLikeMutation>;
export type RemoveFootprintLikeMutationResult = ApolloReactCommon.MutationResult<RemoveFootprintLikeMutation>;
export type RemoveFootprintLikeMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveFootprintLikeMutation, RemoveFootprintLikeMutationVariables>;
export const AddLikeToFootprintDocument = gql`
    mutation AddLikeToFootprint($id: ID!) {
  addLikeToFootprint(footprintId: $id) {
    success
  }
}
    `;
export type AddLikeToFootprintMutationFn = ApolloReactCommon.MutationFunction<AddLikeToFootprintMutation, AddLikeToFootprintMutationVariables>;

/**
 * __useAddLikeToFootprintMutation__
 *
 * To run a mutation, you first call `useAddLikeToFootprintMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLikeToFootprintMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLikeToFootprintMutation, { data, loading, error }] = useAddLikeToFootprintMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAddLikeToFootprintMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddLikeToFootprintMutation, AddLikeToFootprintMutationVariables>) {
        return ApolloReactHooks.useMutation<AddLikeToFootprintMutation, AddLikeToFootprintMutationVariables>(AddLikeToFootprintDocument, baseOptions);
      }
export type AddLikeToFootprintMutationHookResult = ReturnType<typeof useAddLikeToFootprintMutation>;
export type AddLikeToFootprintMutationResult = ApolloReactCommon.MutationResult<AddLikeToFootprintMutation>;
export type AddLikeToFootprintMutationOptions = ApolloReactCommon.BaseMutationOptions<AddLikeToFootprintMutation, AddLikeToFootprintMutationVariables>;
export const PostCommentDocument = gql`
    mutation PostComment($contentId: ID!, $text: String!) {
  postComment(contentId: $contentId, text: $text) {
    id
    text
    createdAt
    author {
      id
      username
      profileImage
    }
  }
}
    `;
export type PostCommentMutationFn = ApolloReactCommon.MutationFunction<PostCommentMutation, PostCommentMutationVariables>;

/**
 * __usePostCommentMutation__
 *
 * To run a mutation, you first call `usePostCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postCommentMutation, { data, loading, error }] = usePostCommentMutation({
 *   variables: {
 *      contentId: // value for 'contentId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function usePostCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PostCommentMutation, PostCommentMutationVariables>) {
        return ApolloReactHooks.useMutation<PostCommentMutation, PostCommentMutationVariables>(PostCommentDocument, baseOptions);
      }
export type PostCommentMutationHookResult = ReturnType<typeof usePostCommentMutation>;
export type PostCommentMutationResult = ApolloReactCommon.MutationResult<PostCommentMutation>;
export type PostCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<PostCommentMutation, PostCommentMutationVariables>;
export const DelateCommentDocument = gql`
    mutation DelateComment($contentId: ID!, $id: ID!) {
  delateComment(contentId: $contentId, id: $id) {
    success
  }
}
    `;
export type DelateCommentMutationFn = ApolloReactCommon.MutationFunction<DelateCommentMutation, DelateCommentMutationVariables>;

/**
 * __useDelateCommentMutation__
 *
 * To run a mutation, you first call `useDelateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delateCommentMutation, { data, loading, error }] = useDelateCommentMutation({
 *   variables: {
 *      contentId: // value for 'contentId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDelateCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DelateCommentMutation, DelateCommentMutationVariables>) {
        return ApolloReactHooks.useMutation<DelateCommentMutation, DelateCommentMutationVariables>(DelateCommentDocument, baseOptions);
      }
export type DelateCommentMutationHookResult = ReturnType<typeof useDelateCommentMutation>;
export type DelateCommentMutationResult = ApolloReactCommon.MutationResult<DelateCommentMutation>;
export type DelateCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<DelateCommentMutation, DelateCommentMutationVariables>;
export const GetCommentsDocument = gql`
    query GetComments($contentId: ID!, $page: Int) {
  getComments(contentId: $contentId, page: $page) {
    id
    text
    author {
      id
      username
      profileImage
    }
    createdAt
  }
}
    `;

/**
 * __useGetCommentsQuery__
 *
 * To run a query within a React component, call `useGetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsQuery({
 *   variables: {
 *      contentId: // value for 'contentId'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetCommentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, baseOptions);
      }
export function useGetCommentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, baseOptions);
        }
export type GetCommentsQueryHookResult = ReturnType<typeof useGetCommentsQuery>;
export type GetCommentsLazyQueryHookResult = ReturnType<typeof useGetCommentsLazyQuery>;
export type GetCommentsQueryResult = ApolloReactCommon.QueryResult<GetCommentsQuery, GetCommentsQueryVariables>;
export const AddFootprintDocument = gql`
    mutation AddFootprint($title: String!, $body: String!, $coordinates: [Float!]!, $media: String!, $locationName: String!) {
  addFootprint(title: $title, body: $body, coordinates: $coordinates, media: $media, locationName: $locationName) {
    id
  }
}
    `;
export type AddFootprintMutationFn = ApolloReactCommon.MutationFunction<AddFootprintMutation, AddFootprintMutationVariables>;

/**
 * __useAddFootprintMutation__
 *
 * To run a mutation, you first call `useAddFootprintMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFootprintMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFootprintMutation, { data, loading, error }] = useAddFootprintMutation({
 *   variables: {
 *      title: // value for 'title'
 *      body: // value for 'body'
 *      coordinates: // value for 'coordinates'
 *      media: // value for 'media'
 *      locationName: // value for 'locationName'
 *   },
 * });
 */
export function useAddFootprintMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddFootprintMutation, AddFootprintMutationVariables>) {
        return ApolloReactHooks.useMutation<AddFootprintMutation, AddFootprintMutationVariables>(AddFootprintDocument, baseOptions);
      }
export type AddFootprintMutationHookResult = ReturnType<typeof useAddFootprintMutation>;
export type AddFootprintMutationResult = ApolloReactCommon.MutationResult<AddFootprintMutation>;
export type AddFootprintMutationOptions = ApolloReactCommon.BaseMutationOptions<AddFootprintMutation, AddFootprintMutationVariables>;
export const MeDocument = gql`
    query Me {
  whoami {
    id
    username
    email
    authType
    profileImage
    followersCount
    followingCount
    footprintsCount
    location {
      coordinates
      locationName
    }
    followers(pagination: {limit: 10}) {
      id
      username
      profileImage
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const GetUserByIdDocument = gql`
    query getUserById($id: ID!, $isFollowedBy: ID) {
  getUserById(id: $id) {
    id
    username
    profileImage
    isFollowed(id: $isFollowedBy)
    followersCount
    followingCount
    footprintsCount
    location {
      coordinates
      locationName
    }
    followers(pagination: {limit: 10}) {
      id
      username
      profileImage
    }
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      isFollowedBy: // value for 'isFollowedBy'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
        return ApolloReactHooks.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, baseOptions);
      }
export function useGetUserByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, baseOptions);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdQueryResult = ApolloReactCommon.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($userId: ID!, $pagination: PaginationOptions) {
  getFollowers(userId: $userId, pagination: $pagination) {
    id
    username
    profileImage
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, baseOptions);
      }
export function useGetFollowersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, baseOptions);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersQueryResult = ApolloReactCommon.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowingDocument = gql`
    query GetFollowing($userId: ID!, $pagination: PaginationOptions) {
  getFollowing(userId: $userId, pagination: $pagination) {
    id
    username
    profileImage
  }
}
    `;

/**
 * __useGetFollowingQuery__
 *
 * To run a query within a React component, call `useGetFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetFollowingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, baseOptions);
      }
export function useGetFollowingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, baseOptions);
        }
export type GetFollowingQueryHookResult = ReturnType<typeof useGetFollowingQuery>;
export type GetFollowingLazyQueryHookResult = ReturnType<typeof useGetFollowingLazyQuery>;
export type GetFollowingQueryResult = ApolloReactCommon.QueryResult<GetFollowingQuery, GetFollowingQueryVariables>;
export const IsEmailAlreadyUsedDocument = gql`
    query IsEmailAlreadyUsed($email: String!) {
  isEmailAlreadyUsed(email: $email)
}
    `;

/**
 * __useIsEmailAlreadyUsedQuery__
 *
 * To run a query within a React component, call `useIsEmailAlreadyUsedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEmailAlreadyUsedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEmailAlreadyUsedQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useIsEmailAlreadyUsedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>) {
        return ApolloReactHooks.useQuery<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>(IsEmailAlreadyUsedDocument, baseOptions);
      }
export function useIsEmailAlreadyUsedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>(IsEmailAlreadyUsedDocument, baseOptions);
        }
export type IsEmailAlreadyUsedQueryHookResult = ReturnType<typeof useIsEmailAlreadyUsedQuery>;
export type IsEmailAlreadyUsedLazyQueryHookResult = ReturnType<typeof useIsEmailAlreadyUsedLazyQuery>;
export type IsEmailAlreadyUsedQueryResult = ApolloReactCommon.QueryResult<IsEmailAlreadyUsedQuery, IsEmailAlreadyUsedQueryVariables>;
export const SearchUserDocument = gql`
    query SearchUser($query: String!, $pagination: PaginationOptions) {
  searchUser(query: $query, pagination: $pagination) {
    id
    username
    profileImage
  }
}
    `;

/**
 * __useSearchUserQuery__
 *
 * To run a query within a React component, call `useSearchUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUserQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
        return ApolloReactHooks.useQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, baseOptions);
      }
export function useSearchUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, baseOptions);
        }
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>;
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>;
export type SearchUserQueryResult = ApolloReactCommon.QueryResult<SearchUserQuery, SearchUserQueryVariables>;
export const IsUsernameAlreadyUsedDocument = gql`
    query IsUsernameAlreadyUsed($username: String!) {
  isUsernameAlreadyUsed(username: $username)
}
    `;

/**
 * __useIsUsernameAlreadyUsedQuery__
 *
 * To run a query within a React component, call `useIsUsernameAlreadyUsedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsUsernameAlreadyUsedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsUsernameAlreadyUsedQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useIsUsernameAlreadyUsedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<IsUsernameAlreadyUsedQuery, IsUsernameAlreadyUsedQueryVariables>) {
        return ApolloReactHooks.useQuery<IsUsernameAlreadyUsedQuery, IsUsernameAlreadyUsedQueryVariables>(IsUsernameAlreadyUsedDocument, baseOptions);
      }
export function useIsUsernameAlreadyUsedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<IsUsernameAlreadyUsedQuery, IsUsernameAlreadyUsedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<IsUsernameAlreadyUsedQuery, IsUsernameAlreadyUsedQueryVariables>(IsUsernameAlreadyUsedDocument, baseOptions);
        }
export type IsUsernameAlreadyUsedQueryHookResult = ReturnType<typeof useIsUsernameAlreadyUsedQuery>;
export type IsUsernameAlreadyUsedLazyQueryHookResult = ReturnType<typeof useIsUsernameAlreadyUsedLazyQuery>;
export type IsUsernameAlreadyUsedQueryResult = ApolloReactCommon.QueryResult<IsUsernameAlreadyUsedQuery, IsUsernameAlreadyUsedQueryVariables>;
export const SendConfirmationEmailDocument = gql`
    mutation SendConfirmationEmail($email: String!) {
  sendConfirmationEmail(email: $email) {
    success
    recipient
  }
}
    `;
export type SendConfirmationEmailMutationFn = ApolloReactCommon.MutationFunction<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>;

/**
 * __useSendConfirmationEmailMutation__
 *
 * To run a mutation, you first call `useSendConfirmationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendConfirmationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendConfirmationEmailMutation, { data, loading, error }] = useSendConfirmationEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendConfirmationEmailMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>) {
        return ApolloReactHooks.useMutation<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>(SendConfirmationEmailDocument, baseOptions);
      }
export type SendConfirmationEmailMutationHookResult = ReturnType<typeof useSendConfirmationEmailMutation>;
export type SendConfirmationEmailMutationResult = ApolloReactCommon.MutationResult<SendConfirmationEmailMutation>;
export type SendConfirmationEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>;
export const VerfyUserDocument = gql`
    mutation VerfyUser($token: String!) {
  verfyUser(token: $token) {
    success
    tokens {
      accessToken
      refreshToken
      expiresIn
    }
  }
}
    `;
export type VerfyUserMutationFn = ApolloReactCommon.MutationFunction<VerfyUserMutation, VerfyUserMutationVariables>;

/**
 * __useVerfyUserMutation__
 *
 * To run a mutation, you first call `useVerfyUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerfyUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verfyUserMutation, { data, loading, error }] = useVerfyUserMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerfyUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<VerfyUserMutation, VerfyUserMutationVariables>) {
        return ApolloReactHooks.useMutation<VerfyUserMutation, VerfyUserMutationVariables>(VerfyUserDocument, baseOptions);
      }
export type VerfyUserMutationHookResult = ReturnType<typeof useVerfyUserMutation>;
export type VerfyUserMutationResult = ApolloReactCommon.MutationResult<VerfyUserMutation>;
export type VerfyUserMutationOptions = ApolloReactCommon.BaseMutationOptions<VerfyUserMutation, VerfyUserMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    recipient
    success
  }
}
    `;
export type ForgotPasswordMutationFn = ApolloReactCommon.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return ApolloReactHooks.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = ApolloReactCommon.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ChangePasswordWithTokenDocument = gql`
    mutation ChangePasswordWithToken($token: String!, $newPassword: String!) {
  changePasswordWithToken(token: $token, newPassword: $newPassword) {
    success
  }
}
    `;
export type ChangePasswordWithTokenMutationFn = ApolloReactCommon.MutationFunction<ChangePasswordWithTokenMutation, ChangePasswordWithTokenMutationVariables>;

/**
 * __useChangePasswordWithTokenMutation__
 *
 * To run a mutation, you first call `useChangePasswordWithTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordWithTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordWithTokenMutation, { data, loading, error }] = useChangePasswordWithTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordWithTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangePasswordWithTokenMutation, ChangePasswordWithTokenMutationVariables>) {
        return ApolloReactHooks.useMutation<ChangePasswordWithTokenMutation, ChangePasswordWithTokenMutationVariables>(ChangePasswordWithTokenDocument, baseOptions);
      }
export type ChangePasswordWithTokenMutationHookResult = ReturnType<typeof useChangePasswordWithTokenMutation>;
export type ChangePasswordWithTokenMutationResult = ApolloReactCommon.MutationResult<ChangePasswordWithTokenMutation>;
export type ChangePasswordWithTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangePasswordWithTokenMutation, ChangePasswordWithTokenMutationVariables>;
export const FollowUserDocument = gql`
    mutation FollowUser($target: ID!) {
  followUser(target: $target) {
    success
  }
}
    `;
export type FollowUserMutationFn = ApolloReactCommon.MutationFunction<FollowUserMutation, FollowUserMutationVariables>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      target: // value for 'target'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        return ApolloReactHooks.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, baseOptions);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = ApolloReactCommon.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = ApolloReactCommon.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
export const UnfollowUserDocument = gql`
    mutation UnfollowUser($target: ID!) {
  unfollowUser(target: $target) {
    success
  }
}
    `;
export type UnfollowUserMutationFn = ApolloReactCommon.MutationFunction<UnfollowUserMutation, UnfollowUserMutationVariables>;

/**
 * __useUnfollowUserMutation__
 *
 * To run a mutation, you first call `useUnfollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowUserMutation, { data, loading, error }] = useUnfollowUserMutation({
 *   variables: {
 *      target: // value for 'target'
 *   },
 * });
 */
export function useUnfollowUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnfollowUserMutation, UnfollowUserMutationVariables>) {
        return ApolloReactHooks.useMutation<UnfollowUserMutation, UnfollowUserMutationVariables>(UnfollowUserDocument, baseOptions);
      }
export type UnfollowUserMutationHookResult = ReturnType<typeof useUnfollowUserMutation>;
export type UnfollowUserMutationResult = ApolloReactCommon.MutationResult<UnfollowUserMutation>;
export type UnfollowUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($username: String, $email: String, $location: PointLocation, $profileImage: String) {
  editProfile(username: $username, email: $email, location: $location, profileImage: $profileImage) {
    success
    isEmailConfirmationRequired
  }
}
    `;
export type EditProfileMutationFn = ApolloReactCommon.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      location: // value for 'location'
 *      profileImage: // value for 'profileImage'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        return ApolloReactHooks.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, baseOptions);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = ApolloReactCommon.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const EditPasswordDocument = gql`
    mutation EditPassword($oldPassword: String!, $newPassword: String!) {
  editPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    success
  }
}
    `;
export type EditPasswordMutationFn = ApolloReactCommon.MutationFunction<EditPasswordMutation, EditPasswordMutationVariables>;

/**
 * __useEditPasswordMutation__
 *
 * To run a mutation, you first call `useEditPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editPasswordMutation, { data, loading, error }] = useEditPasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useEditPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditPasswordMutation, EditPasswordMutationVariables>) {
        return ApolloReactHooks.useMutation<EditPasswordMutation, EditPasswordMutationVariables>(EditPasswordDocument, baseOptions);
      }
export type EditPasswordMutationHookResult = ReturnType<typeof useEditPasswordMutation>;
export type EditPasswordMutationResult = ApolloReactCommon.MutationResult<EditPasswordMutation>;
export type EditPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<EditPasswordMutation, EditPasswordMutationVariables>;