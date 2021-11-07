import { getUrlToken } from "./Utils";

export const fetchCurrentPlaying = () => {
  return fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUrlToken()}`,
    },
  }).then((response) => {
    const { status } = response;
    if (status === 200) return response.json();

    /* We know a 204 status is that no song is playing at this moment */
    if (status === 204) return { noServerInformation: true };

    throw new Error(`Invalid status from Spotify API: ${status}`);
  });
};
