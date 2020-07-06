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
};

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
  sendConfirmationEmail: EmailResponse;
  forgotPassword: EmailResponse;
  changePasswordWithToken: ProcessResult;
};


export type MutationSignupArgs = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupWithGoogleArgs = {
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerfyUserArgs = {
  token: Scalars['String'];
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

export type EmailResponse = {
  __typename?: 'EmailResponse';
  recipient?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ProcessResult = {
  __typename?: 'ProcessResult';
  success: Scalars['Boolean'];
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

export enum AuthType {
  Local = 'LOCAL',
  Google = 'GOOGLE'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  profileImage: Scalars['String'];
  username: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  authType?: Maybe<AuthType>;
  googleID?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  whoami: User;
  isEmailAlreadyUsed: Scalars['Boolean'];
  isUsernameAlreadyUsed: Scalars['Boolean'];
  getUserById: User;
};


export type QueryIsEmailAlreadyUsedArgs = {
  email: Scalars['String'];
};


export type QueryIsUsernameAlreadyUsedArgs = {
  username: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
};

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { whoami: (
    { __typename?: 'User' }
    & Pick<User, 'username' | 'email'>
  ) }
);

export type IsEmailAlreadyUsedQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type IsEmailAlreadyUsedQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isEmailAlreadyUsed'>
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


export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
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
    mutation SignupWithGoogle($username: String!) {
  signupWithGoogle(username: $username) {
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
export const MeDocument = gql`
    query Me {
  whoami {
    username
    email
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