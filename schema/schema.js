const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} = graphql
const axios = require('axios')

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(resp => resp.data)
          .catch(err => console.warn(err.response.status))
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(resp => resp.data)
          .catch(err => console.warn(err.response.status))
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data)
          .catch(err => console.warn(err.response.status))
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data)
          .catch(err => console.warn(err.response.status))
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
