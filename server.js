const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
const { auth } = require('google-auth-library');
require('dotenv').config();

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization;
            if (authToken) {
                currentUser = await findOrCreateUser(authToken);
            }
        } catch (err) {
            console.error("Unable to authenticate");
        }
        return { currentUser };
    }
});

server.listen({ port: process.env.PORT || 4000}).then(({url}) => {
    console.log(url);
});