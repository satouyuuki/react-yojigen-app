class User {
  get = () => !!localStorage.getItem('token');
  getUser = async () => {
    let token = localStorage.getItem('token');
    if (token === null) return;
    token += "Bearer " + token;
    return fetch('/user-name', {
      headers: {
        "Content-type": 'application/json',
        "Authorization": token,
      }
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  }
}

export default new User();