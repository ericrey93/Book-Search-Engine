const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id})
                .select("-_v -password")
                .populate("books");
                return userData;
            };
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        login:  async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect info');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect info');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },


        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
    },

    saveBook: async (parent, { bookData }, context) => {
        if(context.user) {
            const savingBook = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$addToSet: {savedBooks: bookData}},
                {new: true}
            ).populate("books")
            return savingBook;
        };
        throw new AuthenticationError("You must have an account to save books!");
    },

    removeBook: async (parent, { bookId }, context) => {
        if(context.user) {
            const removingBook = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$pull: { savedBooks: {bookId}}},
                {new: true}
            );
            return removingBook;
        }
        throw new AuthenticationError("You must have an account to delete books!");
    }
  },
};

module.exports = resolvers;