import { baseUrl } from "./config";
import { getToken } from "./token";

export const getProblems = () => {
  const myHeaders = new Headers();
  const token = getToken();

  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${baseUrl}/problems/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

export const getProblemsDetails = (slug) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${getToken()}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${baseUrl}/problems/${slug}/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

export const getMasala = async (id, language) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${getToken()}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return fetch(
    `${baseUrl}/submissions/template/${id}/${language}/`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        console.error("API ERROR:", response.status);
        return null;
      }
      return response.json();
    })
    .then((result) => {
      // console.log("Template:", result);
      return result;
    })
    .catch((error) => console.error(error));
};

export const getTestCase = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(`${baseUrl}/testcases/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

export const getProfilMe = () => {
  const token = getToken();

  if (!token) return Promise.resolve(null);

  const myHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });

  return fetch(`${baseUrl}/users/me/`, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((response) => {
      if (response.status === 401) return null;
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

export const getLeaderBoard = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(`${baseUrl}/leaderboard/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};
