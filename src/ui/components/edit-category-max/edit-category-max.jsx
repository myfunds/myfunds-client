import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Loader from '../loader/loader.jsx';
import Fieldset from '../Fieldset';
import Input from '../Input';

class UpdateProfileCategoryMax extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    const id = this.props.category.id;
    const max = this.max.value ? parseFloat(this.max.value) : 0;
    if (!id || !max) {
      console.warn('THIS FAILED, PLEASE SELECT VALUES');
      return;
    }
    this.props.categoryMaxUpdate({
      id,
      max,
    })
    .then(() => this.props.refetch())
    .catch((error) => {
      console.warn('there was an error sending the Mutation', error);
    });
  }
  render() {
    return this.props.isLoading ? <Loader /> : (
      <Fieldset key={this.props.category.name}>
        <label htmlFor="first-name">What is your budget for {this.props.category.name}?</label>
        <Input
          ref={max => { this.max = max; }}
          onBlur={this.handleSubmit}
          defaultValue={this.props.category.max}
          type="text"
          className="form-control"
          id={this.props.category.name}
          name={`categories.${this.props.category.name}`}
          placeholder={this.props.category.max}
        />
      </Fieldset>
    );
  }
}

UpdateProfileCategoryMax.propTypes = {
  category: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  categoryMaxUpdate: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

const updateCategory = gql`
  mutation updateCategory(
    $id: ID!,
    $max: Float!,
  ){
    updateCategory(
      id: $id,
      max: $max
    ){
      id
    }
  }
`;

const UpdateProfileCategaoryMaxWithData = graphql(updateCategory, {
  props: ({ mutate }) => ({
    categoryMaxUpdate: ({
      id,
      max,
    }) => mutate({ variables: {
      id,
      max,
    } }),
  }),
})(UpdateProfileCategoryMax);

export default UpdateProfileCategaoryMaxWithData;
