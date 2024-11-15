const saveFaceDescriptor = async (userId, faceDescriptor) => {
    const user = await User.findById(userId);
    user.faceDescriptor = faceDescriptor;
    await user.save();
  };
  