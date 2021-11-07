import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { SpotifyResponse } from "./models/Types";
import { getPlaylists, Playlist } from "./utils/Playlists";

const spotifyBodyResponse: SpotifyResponse = {
  progress_ms: 2100,
  is_playing: true,
  item: {
    album: {
      name: "Crash Boom Bang!",
      images: [
        {
          width: 640,
          height: 640,
          url: "https://i.scdn.co/image/ab67616d0000b273265ce164d376c6bbc0046364",
        },
      ],
    },
    artists: [{ name: "Roxette" }],
    name: "Sleeping in my car",
    duration_ms: 4762,
  },
};

const storageGetItemMock = jest.fn();
const storageSetItemMock = jest.fn();

let currentStoreKeyValue = "";
const localStorageMock = {
  getItem: () => {
    storageGetItemMock();
    return currentStoreKeyValue;
  },
  setItem: (aKey: string, aValue: string) => {
    currentStoreKeyValue = aValue;
    storageSetItemMock(aKey, aValue);
  },
};

beforeAll(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});

beforeEach(() => {
  /* Mocked localStorage will have always 1 playlist with a couple of songs*/
  currentStoreKeyValue = JSON.stringify([]);

  /* Simulate we have a hash from Spotify redirect */
  window.location.hash = "#access_token=BQDvVXpKhczdIJMdC1-";

  global.fetch = jest.fn().mockImplementation((url) => {
    if (url === "https://api.spotify.com/v1/me/player")
      return Promise.resolve({
        status: 200,
        json: () => spotifyBodyResponse,
      });

    throw new Error("Fetching a non-spotify url");
  });
});

test("renders login when no hash", () => {
  window.location.hash = "";
  render(<App />);
  const linkElement = screen.getByText(/Login to Spotify/i);
  expect(linkElement).toBeInTheDocument();
});

test("should fetch to spotify Api when url has access_token in the hash", async () => {
  render(<App />);

  await screen.findByText(/LEV/i);

  expect(global.fetch).toBeCalled();
});

test("should show 'No Song Information' when spotify returns 204 status", async () => {
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url === "https://api.spotify.com/v1/me/player")
      return Promise.resolve({
        status: 204,
        body: {},
      });

    throw new Error("Fetching a non-spotify url");
  });

  render(<App />);

  await screen.findByText("No song information from Spotify");
});

test("should show current song title and artist after fetching spotify", async () => {
  render(<App />);

  await screen.findByText(/Sleeping in my car/i);
  await screen.findByText(/Roxette/i);
});

test("Should show the album photo", async () => {
  const { container } = render(<App />);

  await screen.findByText(/Sleeping in my car/i);

  const albumImgTag = container.querySelector("div.album-photo img");
  expect(albumImgTag).toBeTruthy();
  expect(albumImgTag?.getAttribute("src")).toBe(
    "https://i.scdn.co/image/ab67616d0000b273265ce164d376c6bbc0046364"
  );
});

test("Add current song to a playlist should work", async () => {
  const { container } = render(<App />);

  const button = await screen.findByText(/Add to playlist/i);
  fireEvent.click(button);

  await screen.findByText(/Enter new playlist name/i);

  const input = container.querySelector(".new-playlist > input") as Element;
  fireEvent.change(input, { target: { value: "My new cool playlist" } });

  const addButton = container.querySelector(
    ".new-playlist > button"
  ) as Element;
  fireEvent.click(addButton);

  expect(storageSetItemMock).toBeCalled();

  const newPlaylist: any = getPlaylists().find(
    (aPlaylist) => aPlaylist.name === "My new cool playlist"
  );
  expect(newPlaylist).toBeTruthy();

  const song = newPlaylist.songs.find(
    (aSong: string) => aSong === "Sleeping in my car"
  );
  expect(song).toBeTruthy();
});
