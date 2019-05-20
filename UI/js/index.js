const baseUrl = "http://stack-o-lite.herokuapp.com/api/v1";

const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const authLogin = () => {
  window.location.href = "questionare.html";
};

const authSignup = () => {
  console.log("Signed up successfully!");
  if (window.localStorage.admin === "true") {
    window.location.replace("questionare.html");
  } else {
    window.location.replace("login.html");
  }
};

/**
 * Assigns an event-listener to signupForm if it exists in the window
 *
 * @param {object} e - The event parameter
 */
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#pwd").value;

    fetch("http://stack-o-lite.herokuapp.com/api/v1/auth/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 201) {
          console.log(data);
          window.localStorage.token = data.data.token;
          window.localStorage.user = data.data.user.id;
          const { user } = data.data;
          document.querySelector(
            "#signup-form"
          ).innerHTML = `<h2>Signup Successful!</h2>
                    <h3>Welcome</h3> <p>${user.firstName}</p> ${user.lastName}`;
          setTimeout(() => {
            authSignup();
          }, 15000);
        } else {
          console.log("can't go");
          let output = "<h3>Error<h3/>";
          Object.keys(data).forEach(key => {
            output += `<p>${data[key]}<p/>`;
          });
          document.querySelector("#signup-form").innerHTML = output;
          setTimeout(() => {
            window.location.replace("signup.html");
          }, 5000);
        }
      })
      .catch(error => {
        //  console.log(data)
        document.querySelector("#error").innerHTML = `<h2>server error</h2>
         
        <h3>${error}</h3>`;
        setTimeout(() => {
          window.location.replace("signup.html");
        }, 5000);
      });
  });
}

/**
 * Assigns an event-listener to loginForm if it exists in the window
 *
 * @param {object} e - The event parameter
 */
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.querySelector("email").value;
    const password = document.querySelector("pwd").value;
    fetch("http://stack-o-lite.herokuapp.com/api/v1/auth/login", {
      method: "POST",
        mode: 'cors',
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        window.location.href = "questionare.html";
        if (data.status === 200) {
          window.localStorage.clear();
          window.localStorage.token = data.data.token;
          window.localStorage.admin = data.data.user.isAdmin;
          window.localStorage.user = data.data.user.id;

          document.querySelector("#login-form").innerHTML = `
                  <h2>Login Successful!!</h2>
                  <h3 class=''>Welcome ${data.data.user.firstName}!</h3>`;
          authLogin();
        } else {
          document.querySelector("#login-form").innerHTML = `<h2>${
            data.error
          }</h2>
                <h3>Please check your login details</h3>`;
          setTimeout(() => {
            window.location.replace("signin.html");
          }, 10000);
        }
      })
      .catch(error => {
        document.querySelector(
          "#error"
        ).innerHTML = `<h2>Sorry, something went wrong with the server error</h2>
              <h3  class='welcome-success'>${error}</h3>`;
        setTimeout(() => {
          window.location.replace("signin.html");
        }, 100000);
      });
  });
}