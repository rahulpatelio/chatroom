const UsernameField = ({ value, onSubmit, completed }) => {
  if (completed) {
    // if the user has already claimed a username, display it.
    return (
      <div>
        You're in Room <b>{value}</b>
      </div>
    );
  } else {
    // if the user hasn't yet claimed a username, let them do so.
    return (
      <div className="">
        <div className="">
          <form onSubmit={(e) => e.preventDefault() || onSubmit(value)}>
          </form>
        </div>
      </div>
    );
  }
};

export default UsernameField;