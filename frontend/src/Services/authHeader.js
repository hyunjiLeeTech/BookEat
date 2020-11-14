export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.jwt) {
    return {
      Authorization: "Bearer " + user.jwt,
      "x-access-token": user.jwt,
    };
  } else {
    console.log(
      "DataService authHeader: err: local user does not exist or does not contain jwt",
    );
    return {};
  }
}
