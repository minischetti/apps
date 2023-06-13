import React, { useEffect } from 'react'

import '../assets/css/App.css'
import { FileArrowUp, Pause, Play, Stop, Spinner } from '@phosphor-icons/react'
import * as Tone from 'tone'
import { parseFile } from 'music-metadata';

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isStopped, setIsStopped] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState(null)
  const [lyrics, setLyrics] = React.useState(null)
  const [player, setPlayer] = React.useState(null)
  const [pitch, setPitch] = React.useState(0)
  const [speed, setSpeed] = React.useState(1)

  const select_file = () => {
    setIsLoading(true)
    console.log('select_file')
    return window.api.selectFile().then((res) => {
      setSelectedFile(res)
      setIsLoading(false)
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("C4", "8n");
      const player = new Tone.Player(res).toDestination();
      setPlayer(player)



    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
    // await window.api.getLyrics().then((res) => {
    //   console.log(res)
    //   setLyrics(res)
    // }).catch((err) => {
    //   console.log(err)
    // })
  }

  const changePitch = () => {
    console.log('changePitch')
    window.api.adjustPitch(selectedFile, pitch).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  const changeSpeed = () => {
    console.log('changeSpeed')
    window.api.changeSpeed(selectedFile, speed).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  const separate = (event) => {
    event.preventDefault()
    console.log('separate')
    const mode = event.target.mode.value
    window.api.separate(selectedFile, mode).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  const play = () => {
    console.log('play')
    player.start()
    setIsPlaying(true)
    setIsPaused(false)
  }

  const pause = () => {
    console.log('pause')
    player.stop()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const stop = () => {
    console.log('stop')
    setIsPlaying(false)
    setIsPaused(false)
  }

  // useEffect(() => {
  //   console.log('useEffect')
  //   window.api.getLyrics(selectedFile).then((res) => {
  //     console.log(res)
  //     setLyrics(res)
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // }, [selectedFile])

  const templates = {
    now_playing: () => {
      if (selectedFile) {
        return (
          <div className="now-playing">
            {selectedFile ? <img src="https://via.placeholder.com/100" alt="album art" onClick={select_file} /> : <FileArrowUp className="file_upload_button" onClick={select_file} />}
            <h2>{selectedFile}</h2>
          </div>
        )
      }
    },
    playback_controls: () => {
      const shouldShowPlayButton = (!isPlaying && !isPaused) || (isPlaying && isPaused) || (isPaused && !isPlaying);
      const shouldShowPauseButton = isPlaying && !isPaused;
      if (selectedFile) {
        return (
          <div className='playback-controls'>
            {shouldShowPlayButton ? <Play className="orb" onClick={play} /> : null}
            {shouldShowPauseButton ? <Pause className="orb" onClick={pause} /> : null}
          </div>
        )
      }
    },
    pitch_controls: () => {
      if (selectedFile) {
        return (
          <div className='pitch-controls controls-section'>
            <h2>Pitch</h2>
            <input type="range" min="-12" max="12" defaultValue="0" step="1" onChange={(e) => setPitch(e.target.value)} />
            <button onClick={changePitch}>Change</button>
          </div>
        )
      }
    },
    speed_controls: () => {
      if (selectedFile) {
        return (
          <div className='speed-controls controls-section'>
            <h2>Speed</h2>
            <input type="range" min="0.1" max="2" defaultValue="1" step="0.1" onChange={(e) => setSpeed(e.target.value)} />
            <button onClick={changeSpeed}>Change</button>
          </div>
        )
      }
    },
    separate_controls: () => {
      if (selectedFile) {
        return (
          <div className='separate-controls controls-section'>
            <h2>Separate</h2>
            <form onSubmit={separate}>
            <select name="mode">
              <option value="all">All</option>
              <option value="vocals">Vocals</option>
              <option value="drums">Drums</option>
              <option value="bass">Bass</option>
              <option value="other">Other</option>
            </select>
            <button>Change</button>
            </form>
          </div>
        )
      }
    },
    voice_changer_controls: () => {
      if (selectedFile) {
        return (
          <div className='voice-changer-controls controls-section'>
            <h2>Voice Changer</h2>
            <select>
              <option value="dave_mustaine">Dave Mustaine</option>
            </select>
            <button>Change</button>
          </div>
        )
      } 
    },
    lyrics: () => {
      if (lyrics) {
        console.log(lyrics)
        return (
          lyrics.map((line) => {
            <div>{line.text}</div>
          })
        )
      }
    }
  }


  return (
    <div className='app'>
      <div className='app-header'>
        <div className='header-section'>
          <h1>ArtiAudio</h1>
          <button onClick={select_file}>Open file</button>
          {isLoading ? <Spinner className="animation-spin" size={32} /> : null}
        </div>
        {templates.now_playing()}
      </div>


      {templates.lyrics()}
      <div className='controls'>
        {templates.pitch_controls()}
        {templates.speed_controls()}
        {templates.separate_controls()}
        {templates.voice_changer_controls()}
      </div>
      <div className='footer'>
        {templates.playback_controls()}
      </div>
    </div>
  )
}

export default App
