module.exports = (req, res, next) => {
  // Simulate an authenticated user for tests
  req.isAuthenticated = () => true;
  req.user = {
    id: '684e183d60efd51ae34f9310', // Use a real user ID from your DB
    githubId: '95935178',
    username: 'daniel3034',
    email: 'daniel3034@github.com',
    profilePicture: 'https://avatars.githubusercontent.com/u/95935178?v=4'
  };
  next();
};