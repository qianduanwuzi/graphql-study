// -----------------------------------------demo1-----------------------------------
// var express = require('express');
// // graphqlHTTP是grapql的http服务，用于处理graphql的查询请求
// var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var root = { hello: () => 'Hello world!' };

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true, //浏览器中直接对graphQL进行调试
// }));
// app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));

// -----------------------------------------demo2-----------------------------------
// const express = require('express');
// const graphqlHTTP = require('express-graphql');
// // schema GraphQLSchema实例
// const schema = require('./schema');

// const app = express();

// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true
// }));

// const PORT = process.env.PORT || 4000;

// app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));

// -----------------------------------------demo3-----------------------------------
// Passing Arguments传参
// var express = require('express');
// var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     rollDice(numDice: Int!, numSides: Int): [Int] 
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   rollDice: ({numDice, numSides}) => {
//     var output = [];
//     for (var i = 0; i < numDice; i++) {
//       output.push(1 + Math.floor(Math.random() * (numSides || 6)));
//     }
//     return output;
//   }
// };

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');

// -----------------------------------------demo4-----------------------------------
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// Maps username to content
var fakeDatabase = {};

var root = {
  getMessage: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ({input}) => {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');
    console.log('123', id)
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});