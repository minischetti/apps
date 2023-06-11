import React, { useEffect } from 'react'

import '../assets/css/App.css'
import { FileArrowUp, Pause, Play, Stop, Spinner } from '@phosphor-icons/react'

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isStopped, setIsStopped] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState(null)

  const select_file = async () => {
    setIsLoading(true)
    console.log('select_file')
    await window.api.selectFile().then((res) => {
      console.log(res)
      setSelectedFile(res || "result")
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
  }

  const play = () => {
    console.log('play')
    setIsPlaying(true)
    setIsPaused(false)
  }

  const pause = () => {
    console.log('pause')
    setIsPaused(true)
    setIsPlaying(false)
  }

  const stop = () => {
    console.log('stop')
    setIsPlaying(false)
    setIsPaused(false)
  }


  return (
    <div className='app'>
      <div className='app-header'>
        <h1>ArtiAudio</h1>

        {isLoading ? <Spinner className="animation-spin" size={32} /> : null}
      </div>
      <div className="now-playing">
      
        {selectedFile ? <img src="https://via.placeholder.com/100" alt="album art" onClick={select_file} /> : <FileArrowUp className="file_upload_button" onClick={select_file} />}
        <h2>{selectedFile}</h2>
      </div>
      <div className='footer'>


        {selectedFile ? <div className='playback-controls'>
          {(!isPlaying && !isPaused) || (isPlaying && isPaused) || (isPaused && !isPlaying) ? <Play className="orb" onClick={play} /> : null}
          {isPlaying && !isPaused ? <Pause className="orb" onClick={pause} /> : null}
        </div>
          : null}
      </div>
    </div>
  )
}

export default App
