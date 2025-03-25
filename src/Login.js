import React from 'react'
import { Container } from 'react-bootstrap';

//const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=ac8b70b1da2e44c5a60089e5e33d1666&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=40b9a4490c9e42089719f993d97a79df&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-library-read%20user-library-modify%20user-read-recently-played%20user-top-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-follow-modify"
//const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=ac8b70b1da2e44c5a60089e5e33d1666&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-library-read%20user-library-modify%20user-read-recently-played%20user-top-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20user-follow-read%20user-follow-modify";

export default function Login() {
  return (
      <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: "100vh" }}>
          <a className='btn btn-success btn-lg' href={AUTH_URL}>Login con Spotify</a>
      </Container>
  );
}