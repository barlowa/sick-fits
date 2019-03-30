import {Query} from 'react-apollo'
import Error from './ErrorMessage'
import React from 'react'
import gql from 'graphql-tag'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
]

const  ALL_USERS_QUERY = gql`
    query{
        users{
            id
            name
            email
            permissions
        }
    }
`

const Permissions = () => (
  <Query
    query={ALL_USERS_QUERY}
  >
  {({data, loading, error}) => (
      <>
        <Error error={error} />
        <div>
            <h2>Manage Permissions</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        {possiblePermissions.map(permission => <th>{permission}</th>)}
                        <th></th>
                    </tr>
                </thead>
                <tbody>{data.users.map(user => <User user={user} />)}</tbody>
            </Table>

        </div>
      </>      
  )}
  </Query>
)

export default Permissions




class User extends React.Component {
  render() {
      const user = this.props.user
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission =>(
            <td><input htmlFor={`${user.id}-permission-${permission}`} type='checkbox'></input></td>
        ))}
        <td><SickButton>Update</SickButton></td>
      </tr>
    )
  }
}

