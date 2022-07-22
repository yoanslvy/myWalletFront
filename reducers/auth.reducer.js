export default function (authData = [], action) {
  switch (action.type) {
    case "LOGIN":
      return [...authData, action.userData];
    case "LOGOUT":
      return [];
    default:
      return authData;
  }
}
