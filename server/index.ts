import { GraphQLServer } from "graphql-yoga";

const typeDefs =`
    type Todo {
        id: ID!
        done: Boolean!
        text: String!
    }

    type Query {
        getTodos: [Todo!]!
    }
`

const resolvers = {
    Query: {
        getTodos: () => {
            return todos;
        }
    }
};

let todos = [
    {
        id: "1",
        text: "test",
        done: false
    }
];

const server = new GraphQLServer({
    typeDefs, resolvers
})

server.start(() => console.log("Server is running on http://localhost:4000"))