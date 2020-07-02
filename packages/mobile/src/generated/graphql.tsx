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

export type Mutation = {
  __typename?: 'Mutation';
  signup: ProcessResult;
  signupWithGoogle: GoogleAuthResult;
  login: AuthPayload;
  loginWithGoogle: GoogleAuthResult;
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

export type ProcessResult = {
  __typename?: 'ProcessResult';
  success: Scalars['Boolean'];
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
  getUserById: User;
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
    { __typename?: 'ProcessResult' }
    & Pick<ProcessResult, 'success'>
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