const UsernameField = ({ value, onChange, onSubmit, completed }) => {
  if (completed) {
    // if the user has already claimed a username, display it.
    return (
      <div>
        Chatting as <b>{value}</b>
      </div>
    );
  } else {
    // if the user hasn't yet claimed a username, let them do so.
    return (
      <div className="popup">
        <div className="innerPopUp">
          <form onSubmit={(e) => e.preventDefault() || onSubmit(value)}>
            <label>
              Set your username:
              <input
                type="text"
                name="username"
                value={value}
                onChange={(e) => e.preventDefault() || onChange(e.target.value)}
              />
            </label>
            <input 
              className=''
              type="submit" 
              value="Set Username" />
          </form>
        </div>
      </div>
    );
  }
};

export default UsernameField;