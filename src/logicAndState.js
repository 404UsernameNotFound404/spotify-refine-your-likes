import axios from "axios";
import { makeAutoObservable } from "mobx";
import toastr from "toastr";
import Cookies from "js-cookie";

const scope = [
  "user-follow-modify",
  "user-follow-read",

  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",

  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-collaborative",

  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",

  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-library-modify",

  "streaming",
  "app-remote-control",
];
const clientID = process.env.REACT_APP_CLIENT_ID;
const redirect_uri = "http://localhost:3000/callback";

class LogicAndState {
  constructor() {
    this.token = "";
    this.likedSongs = [];
    this.selectedSong = null;
    this.playlistToAddRemovedSongsTo = "";

    this.getPlaylistSongsTemp = [];
    makeAutoObservable(this);
  }

  initialize() {
    const accessTokenHash = getHash();
    if (accessTokenHash && accessTokenHash.access_token) {
      this.token = accessTokenHash.access_token;
      this.getLikes();
    }
  }

  async setToken(newToken) {
    try {
      this.token = newToken;
      this.getLikes();
    } catch (err) {
      console.log("ERROR: ");
      console.log(err);
    }
  }

  async login() {
    const redirectUri = getRedirectUrl(clientID, scope, redirect_uri, false);
    if (window.location !== window.parent.location) {
      window.open(redirectUri);
    } else {
      window.location = redirectUri;
    }
  }

  async getLikes() {
    try {
      const resForNumberOfLikes = await axios.get(
        `https://api.spotify.com/v1/me/tracks`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      let totalLikes = resForNumberOfLikes.data.total;

      const res = await axios.get(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${
          totalLikes - 50
        }`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.data && res.data.items) {
        this.likedSongs = res.data.items;
        this.goToNextSong();
      }
    } catch (err) {
      console.log("ERROR: ");
      console.log(err);
    }
  }

  async goToNextSong() {
    if (this.likedSongs.length <= 0) return;
    let songRaw = null;
    if (!this.selectedSong) {
      songRaw = this.likedSongs[this.likedSongs.length - 1];
    } else {
      this.likedSongs.forEach((ele, i) => {
        if (ele.track.uri === this.selectedSong.uri) {
          if (i === 0) {
            // TODO get more liked songs, if at end of liked songs then fuck me
          }
          songRaw = this.likedSongs[i - 1];
        }
      });
    }
    if (!songRaw) return;
    this.selectedSong = {
      name: songRaw.track.name,
      image: songRaw.track.album.images[0].url,
      artists: songRaw.track.artists.map((ele) => ele.name),
      uri: songRaw.track.uri,
    };
    this.playSelectedSong();
  }

  async playSelectedSong() {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [this.selectedSong.uri] },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log("ERROR: ");
      console.log(err);
    }
  }

  async removeSong() {
    try {
      await this.addSongToPlaylist();
      const songToDeleteId = this.selectedSong.uri.split(":")[this.selectedSong.uri.split(":").length - 1];
      await axios.delete(
        `https://api.spotify.com/v1/me/tracks`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          data: { ids: [songToDeleteId] },
        }
      );
      toastr.success("Removed song successfully.")
      this.goToNextSong();
    } catch (err) {

    }
  }

  // https://open.spotify.com/track/1jcSttQBrx05TkPgnB9vZl?si=f0a276e7a3374f6d
  async addSongToPlaylist() {
    try {
      if (!this.playlistToAddRemovedSongsTo) return;
      await this.getAllSongsFromPlaylistToAddRemovedSongsTo();
      if (
        !this.getPlaylistSongsTemp.find((ele) => ele === this.selectedSong.uri)
      ) {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${this.playlistToAddRemovedSongsTo}/tracks`,
          { uris: [this.selectedSong.uri] },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      this.getPlaylistSongsTemp = [];
    } catch (err) {
      console.log(err);
    }
  }

  async getAllSongsFromPlaylistToAddRemovedSongsTo() {
    try {
      const res = await axios.get(
        `https://api.spotify.com/v1/playlists/${this.playlistToAddRemovedSongsTo}/tracks?limit=1`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          data: { uris: ["spotify:track:1jcSttQBrx05TkPgnB9vZl"] },
        }
      );
      const total = res.data.total;
      let offset = 0;
      let promises = [];
      while (true) {
        if (total && offset >= total) break;
        promises.push(this.getItemsInPlaylist(offset));
        offset += 50;
      }
      await Promise.all(promises);
    } catch (err) {
      console.log(err);
    }
  }

  async getItemsInPlaylist(offset) {
    const res = await axios.get(
      `https://api.spotify.com/v1/playlists/${this.playlistToAddRemovedSongsTo}/tracks?limit=50&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        data: { uris: ["spotify:track:1jcSttQBrx05TkPgnB9vZl"] },
      }
    );
    res.data.items.forEach((ele) =>
      this.getPlaylistSongsTemp.push(ele.track.uri)
    );
  }

  setPlaylistToAddRemovedSongsTo(newValue) {
    this.playlistToAddRemovedSongsTo = newValue;
  }
}

export const logicAndState = new LogicAndState();

const getRedirectUrl = (clientID, scopes, redirectUri, showDialog) => {
  return (
    "https://accounts.spotify.com/authorize?response_type=token" +
    `&client_id=${clientID}` +
    `&scope=${scopes.join("%20")}` +
    `&redirect_uri=${redirectUri}` +
    "&show_dialog=" +
    Boolean(showDialog)
  );
}; // TODO thank the spotify auth guy

const getHash = () => {
  return window
    ? window.location.hash
        .substring(1)
        .split("&")
        .reduce((initial, item) => {
          if (item) {
            const parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {})
    : "";
};
