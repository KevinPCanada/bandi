import User from '../models/User.js';

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // This is a crucial step. Calling `deleteOne()` on the Mongoose document will trigger the `pre('deleteOne')` middleware created in the User model. This starts the cascading delete for all the user's decks and cards.
      await user.deleteOne();
      
      // Clear the JWT cookie to log the user out.
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });

      res.json({ message: 'User and all associated data deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { deleteUser };