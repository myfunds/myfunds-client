import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loader from '../../components/loader/loader.jsx';
import UpdateProfileCategoryMax from '../../components/edit-category-max/edit-category-max.jsx';
import ProfileDetailsData from './ProfileDetails.jsx';
import AuthService from '../../../utils/AuthService.js';


export class UserProfile extends Component {
  constructor(props, context) {
    super(props, context);

    this.setUpProfile = this.setUpProfile.bind(this);
    this.addDefaultCategories = this.addDefaultCategories.bind(this);
    this.state = this.getStateFromProps(props);

    this.state.profile = this.getProfile();
    // listen to profile_updated events to update internal state
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.getStateFromProps(nextProps),
      profile: this.getProfile(),
    });
  }
  getProfile() {
    // Retrieves the profile data from local storage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }
  getStateFromProps(props) {
    const categories = props.user && props.user.categories ? props.user.categories : [];
    const isNew = !!props.user && !props.user.id;
    const hasCategories = categories.length > 0;
    if (hasCategories) {
      return { categories, isNew, hasCategories };
    }
    return {
      isNew,
      hasCategories: false,
      categories: [
        { name: 'auto', max: 200 },
        { name: 'entertainment', max: 200 },
        { name: 'food', max: 200 },
        { name: 'home', max: 200 },
        { name: 'income', max: 200 },
        { name: 'interest', max: 200 },
        { name: 'medical', max: 200 },
        { name: 'personal', max: 200 },
        { name: 'travel', max: 200 },
        { name: 'utilities', max: 200 },
      ],
    };
  }
  setUpProfile(event) {
    event.preventDefault();
    const idToken = this.props.auth.getToken();
    const name = this.name.value;
    const emailAddress = this.emailAddress.value;
    if (!idToken || !name || !emailAddress) {
      console.warn('Need to surface to user');
      return;
    }
    this.props.createUser({
      idToken,
      name,
      emailAddress,
      emailSubscription: true,
      emailNotification: true,
    }).then(() => this.props.refetch()
    ).catch((error) => {
      console.warn('there was an error sending the Mutation', error);
    });
  }
  addDefaultCategories() {
    if (!this.props.user || !this.props.user.id) {
      console.warn('Need to surface to user');
      return;
    }
    const userId = this.props.user.id;
    const categories = [
      { name: 'auto', max: 200 },
      { name: 'entertainment', max: 200 },
      { name: 'food', max: 200 },
      { name: 'home', max: 200 },
      { name: 'income', max: 200 },
      { name: 'interest', max: 200 },
      { name: 'medical', max: 200 },
      { name: 'personal', max: 200 },
      { name: 'travel', max: 200 },
      { name: 'utilities', max: 200 },
    ];

    categories.forEach(({ name, max }) => {
      this.props.createCategory({
        name,
        max,
        userId
      }).then(() => this.props.refetch()
      ).catch((error) => {
        console.warn('there was an error sending the Mutation', error);
      });
    });
  }
  renderCategories() {
    return this.state.categories.map((category) => (
      <UpdateProfileCategoryMax key={category.name} category={category} />
      ));
  }
  render() {
    return this.props.isLoading ? <Loader /> : (
      <div className="page">
        <div className="container UserProfile">
          <div>
            <h1 id="profile-header">Profile</h1>
          </div>
          <ProfileDetailsData profile={this.state.profile} />
          {!this.state.isNew ? null :
          <div>
            <input ref={name => { this.name = name; }} type="text" defaultValue={this.state.profile.given_name} />
            <br />
            <input ref={emailAddress => { this.emailAddress = emailAddress; }} type="text" />
            <br />
            <button type="button" onClick={this.setUpProfile}> Click me to verify this is you </button>
          </div>
          }
          <div>
            <h2 id="profile-header">Budget Categories</h2>
          </div>
          <div>
            {this.state.hasCategories ? null : <button type="button" onClick={this.addDefaultCategories}>Add all the default categories</button>}
            {this.state.isNew ? null : this.renderCategories()}
          </div>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      max: PropTypes.number,
    }))
  }).isRequired,
  auth: PropTypes.instanceOf(AuthService).isRequired,
  createUser: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  createCategory: PropTypes.func.isRequired,
};

const userQuery = gql`
  query getUser($auth0UserId:String){
    allUsers(filter:{
      auth0UserId:$auth0UserId
    }){
      id
      categories{
        id
        max
        name
      }
    }
  }
`;
const createUser = gql`
  mutation (
    $idToken: String!,
    $name: String!,
    $emailAddress: String!,
    $emailSubscription: Boolean!,
    $emailNotification: Boolean!
  ) {
    createUser(
      authProvider: {auth0: {idToken: $idToken}},
      name: $name,
      emailAddress: $emailAddress,
      emailSubscription: $emailSubscription,
      emailNotification: $emailNotification
    ) {
      id
    }
  }
`;
const createCategory = gql`
  mutation createCategory(
    $name:String!,
    $max:Float!,
    $userId:ID!
    ){
    createCategory(
      name: $name,
      max: $max,
      userId: $userId
    ){
      name
      max
      user{
        id
      }
    }
  }
`;

function getProfile() {
  // Retrieves the profile data from local storage
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(localStorage.profile) : {};
}


const ProfileWithData = graphql(createUser, {
  props: ({ mutate }) => ({
    createUser: ({
      idToken,
      name,
      emailAddress,
      emailSubscription,
      emailNotification,
    }) => mutate({ variables: {
      idToken,
      name,
      emailAddress,
      emailSubscription,
      emailNotification,
    } }),
  }),
})(
  graphql(createCategory, {
    props: ({ mutate }) => ({
      createCategory: ({
        name,
        max,
        userId,
      }) => mutate({ variables: {
        name,
        max,
        userId,
      } }),
    }),
  })(
    graphql(userQuery, {
      options() {
        return {
          forceFetch: true,
          variables: {
            auth0UserId: getProfile().user_id,
          },
        };
      },
      props: ({ ownProps, data: { loading, allUsers, refetch } }) => ({
        ownProps,
        isLoading: loading,
        user: allUsers && allUsers[0] || {},
        refetch: () => {
          refetch();
        },
      })
    })(UserProfile)
  )
);

export { ProfileWithData };
