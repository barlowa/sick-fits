import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import Error from './ErrorMessage'
import Router from 'next/router'
import { responsePathAsArray } from "graphql";

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
    image: "",
    largeImage: "",
    price: 1220
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === "number" ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  };

   uploadFile = async event =>{
      event.preventDefault()
      console.log('uploading file')
      const files = event.target.files
      const data = new FormData()
      data.append('file', files[0])
      data.append('upload_preset','sickfits')
        //cloudinary api endpoint https://res.cloudinary.com/dgfltlbkm/image/upload/v1552752970/sample.jpg
      const res = await fetch ('https://api.cloudinary.com/v1_1/dgfltlbkm/image/upload', {
          method:'POST',
          body: data
      })
      const file =  await res.json()
      console.log(file)
      this.setState({
          image:file.secure_url,
          largeImage:file.eager[0].secure_url
      })
  }

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
            <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  onChange={this.uploadFile}
                  required
                />
                {this.state.image && <img width="200" src={this.state.image} alt='upload preview'/>}
              </label>
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
