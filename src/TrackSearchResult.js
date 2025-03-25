import React from 'react'


export default function TrackSearchResult({Track, chooseTrack }){
function handlePlay(){
    chooseTrack(Track)
}

   return(
    <div className="d-flex m-2 m-2 align-items-center" 
    style={{cursor: "pointer"}}
    onClick={handlePlay}
    >
        <img src={Track.albumUrl} style={{height: "64px", width: "64px"}}/> 
        <div className="ml-3">
            <div>{Track.title}</div>
            <div className="text-muted">{Track.artist}</div>
        </div>
    </div>
   )
}
