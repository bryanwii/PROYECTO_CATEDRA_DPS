import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
    clientId: "40b9a4490c9e42089719f993d97a79df"
});

export default function Dashboard({ code }) {
    const accessToken = useAuth(code);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [playingTrack, setPlayingTrack] = useState(null);
    const [lyrics, setLyrics] = useState("");

    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch("");  // Corrección aquí
        setLyrics("");
    }

    useEffect(() => {
        if (!playingTrack) return;
        setLoading(true);
        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist // Corrección del error tipográfico
            }
        }).then(res => {
            setLoading(false);
            setLyrics(res.data.lyrics);
        }).catch(err => {
            setLoading(false);
            setError("Error al obtener la letra");
        });
    }, [playingTrack]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return;
            setSearchResults(
                res.body.tracks.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => (image.height < smallest.height ? image : smallest),
                        track.album.images[0]
                    );
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url
                    };
                })
            );
        }).catch(err => {
            setError("Error en la búsqueda");
        });

        return () => cancel = true;
    }, [search, accessToken]);

    useEffect(() => {
        if (!accessToken) return;

        axios.get('http://localhost:3001/tracks', {
            headers: { Authorization: accessToken }
        }).then(res => {
            setTracks(res.data);
        }).catch(err => {
            setError("Error al obtener canciones guardadas.");
        });
    }, [accessToken]);

    return (
        <Container className="d-flex flex-column py-2" style={{ height: '100vh' }}>
            <Form.Control
                type="search"
                placeholder="Buscar música..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2" style={{ overflow: "auto" }}>
                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
                {tracks.length > 0 && (
                    <div>
                        <h3>Your Saved Tracks</h3>
                        {tracks.map(track => (
                            <div key={track.track.uri}>
                                <p>{track.track.name} by {track.track.artists[0].name}</p>
                            </div>
                        ))}
                    </div>
                )}
                {searchResults.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre" }}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </Container>
    );
}
