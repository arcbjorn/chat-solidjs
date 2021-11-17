import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
    type Todo {
        id: ID!
        done: Boolean!
        text: String!
    }

    type Query {
        getTodos: [Todo!]!
    }
    
    type Mutation {
        addTodo(text: String!): Todo
        setDone(id: ID!, done: Boolean!): Todo
    }
`;

const resolvers = {
  Query: {
    getTodos: () => {
      return todos;
    },
  },
  Mutation: {
    addTodo: (_: unknown, { text }: { text: string }) => {
      const newTodo = {
        id: String(todos.length + 1),
        text,
        done: false,
      };
      todos.push(newTodo);
      return newTodo;
    },
    setDone: (_: unknown, { id, done }: { id: string; done: boolean }) => {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      todo.done = done;
      return todo;
    },
  },
};

let todos = [
  {
    id: "1",
    text: "test",
    done: false,
  },
];

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log("Server is running on http://localhost:4000"));
