import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import Error from './ErrorMessage'
import Router from 'next/router'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "tears",
    description: "tears",
    image: "tears.jpg",
    largeImage: "bigtears.jpg",
    price: 1220
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === "number" ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  };

  render() {
    return (
        <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async event => {
                //stop form from submitting
                event.preventDefault();
                //call the mutation
                const res = await createItem()
                //change them to the single item page
                console.log(res)
                Router.push({
                    pathname:'/item',
                    query:{ id:res.data.createItem.id },
                })
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title"
                  onChange={this.handleChange}
                  value={this.state.title}
                  required
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="price"
                  onChange={this.handleChange}
                  value={this.state.price}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a Description"
                  onChange={this.handleChange}
                  value={this.state.description}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };