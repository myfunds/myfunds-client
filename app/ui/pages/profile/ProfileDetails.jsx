import React, { PropTypes } from 'react';

const ProfileDetails = ({ profile }) => (
  <div className="row">
    <div className="col-xs-12">
      <img alt="Profile" src={profile.picture} />
    </div>
    <div className="col-xs-12">
      <h3>Profile</h3>
      <p><strong>Name: </strong> {profile.name}</p>
    </div>
  </div>
);

ProfileDetails.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileDetails;
