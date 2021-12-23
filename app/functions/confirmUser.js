exports = ({ token, tokenId, username }) => {
  context.functions.execute('sendConfirmationEmail', token, tokenId, username);
  return { status: 'pending' };
};
