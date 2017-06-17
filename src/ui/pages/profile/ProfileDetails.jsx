import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Tile from '../../components/Tile';

const H1 = glamorous.h1({
});

const RowAround = glamorous.div({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
});

// const RowBetween = glamorous.div({
//   display: 'flex',
//   justifyContent: 'space-between',
// });

const ProfileDetails = ({ profile }) => (
  <Tile>
    <H1 id="profile-header">Profile</H1>
    <RowAround>
      <img alt="Profile" src={profile.picture} />
      <p><strong>Name: </strong> {profile.name}</p>
    </RowAround>
  </Tile>
);

ProfileDetails.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileDetails;
