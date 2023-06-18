import React, { useState, useEffect, useRef } from 'react'

import '../assets/css/App.css'
import { FileArrowUp, Pause, Play, Stop, Spinner, ArrowsOutLineHorizontal, ArrowRight, MicrophoneStage, Gauge, MusicNote, Toolbox, Hamburger, Files, ArrowLeft, CaretLeft, CaretRight, Clock, SpeakerNone } from '@phosphor-icons/react'
import * as Tone from 'tone'
import { Howl, Howler } from 'howler';
import WaveSurfer from 'wavesurfer.js'
import { useFloating, offset, flip, shift, useHover, useClick, useDismiss, useRole } from '@floating-ui/react';

function Popover() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Reference element
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            Popover element
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

function App() {
  // Refs
  const wavesurfer = useRef(null);
  // Playback
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [isStopped, setIsStopped] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Files
  const [library, setLibrary] = React.useState([])
  const [selectedFile, setSelectedFile] = React.useState(null)
  const [metadata, setMetadata] = React.useState(null)

  // Lyrics
  const [lyrics, setLyrics] = React.useState(null)

  // Media Player
  const [player, setPlayer] = React.useState(null)
  // Synth
  const [synth, setSynth] = React.useState(new Tone.Synth().toDestination())

  // Effects
  const [pitch, setPitch] = React.useState(0)
  const [pitchBlend, setPitchBlend] = React.useState(1)
  const [pitchShift, setPitchShift] = React.useState(null)
  const [speed, setSpeed] = React.useState(1)
  const [beatsPerMinute, setBeatsPerMinute] = React.useState(120)

  const [voices, setVoices] = React.useState([])

  const [showLibrary, setShowLibrary] = React.useState(true)
  // Format
  const [outputFolder, setOutputFolder] = React.useState({
    folderPath: null,
    folderContent: []
  })

  useEffect(() => {
    console.log('useEffect')
    // player.toDestination()
    wavesurfer.current = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      barWidth: 3,
      barRadius: 3,
      responsive: true,
      cursorWidth: 1,
      cursorColor: '#fff',
      normalize: true,
      partialRender: true,
      width: 500,
    });
    const player = new Tone.Player();
    const pitchShift = new Tone.PitchShift().toDestination();
    // Transport
    player.connect(pitchShift);
    setPlayer(player)
    setPitchShift(pitchShift)
    const analyzer = new Tone.Analyser('waveform', 128);
    player.connect(analyzer);


    // Set up Tone.js PitchShift
    // Set up Tone.js Speed
    // const speedShift = new Tone.Speed().toDestination();
    // speedShift.wet.value = 0;
    // player.connect(speedShift);
    getVoices()
    // getLibrary()
  }, [])


  const getLibrary = () => {
    window.api.getLibrary().then((res) => {
      console.log("getLibrary", res)
      setLibrary(res)
    }
    ).catch((err) => {
      console.log(err)
    })
  }

  const set_output_folder = () => {
    console.log('get_output_folder')
    window.api.getOutputFolder().then((res) => {
      console.log(res)
      if (res) {
        setOutputFolder(res)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const getLyrics = () => {
    window.api.getLyrics(res.filePath).then((res) => {
      console.log(res)
      setLyrics(res)
    }).catch((err) => {
      console.log(err)
    })
  }


  const setLibraryPath = () => {
    setIsLoading(true)
    console.log('select_file')
    return window.api.setLibraryPath().then((res) => {
      console.log(res)
      // Get files from getLibrary
      // getLibrary()
      setLibrary(res)
      // Set the selected file
      setIsLoading(false)

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

  const openFile = (event) => {
    console.log('open_file')
    setIsLoading(true)
    // setSelectedFile(`file://${event.target.value}`)
    window.api.openFile(event.target.value).then((res) => {
      console.log(res)
      setSelectedFile(res)
      player.load(`file://${res.path}`)

      player.sync()

    }).catch((err) => {
      console.log(err)
    })
    // setPlayer(new Howl({
    //   src: [`${event.target.value}`],
    //   html5: true,
    // }))
    wavesurfer.current.load(`${event.target.value}`)

    synth.triggerAttackRelease("C3", "8n");
    setIsLoading(false)
  }


  const changePitch = (event) => {
    event.preventDefault()
    console.log('changePitch')
    synth.triggerAttackRelease("C3", "32n")
    const nSteps = event.target.value
    console.log("nSteps", nSteps)
    setPitch(nSteps)

    pitchShift.pitch = nSteps;
  }
  const changePitchBlend = (event) => {
    event.preventDefault()
    const nSteps = event.target.value
    console.log("nSteps", nSteps)
    setPitchBlend(nSteps)
  }
  const changeSpeed = (event) => {
    event.preventDefault()
    console.log('changeSpeed')
    const speed = event.target.value
    console.log("speed", speed)
    // computedPlaybackRate(t) = playbackRate(t) * pow(2, detune(t) / 1200)
    player.playbackRate = speed * Math.pow(2, pitch / 1200)
  }
  const changeBeatsPerMinute = (event) => {
    event.preventDefault()
    console.log('changeBeatsPerMinute')
    const bpm = event.target.value
    console.log("bpm", bpm)
    Tone.Transport.bpm.value = bpm
    setBeatsPerMinute(bpm)
  }

  const isolate = (event) => {
    event.preventDefault()
    console.log('separate')
    const mode = event.target.mode.value
    window.api.isolate(selectedFile, mode).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  const changeVoice = (event) => {
    event.preventDefault()
    console.log('changeVoice')
    const voice = event.target.voice.value
    console.log("voice", voice)
    window.api.changeVoice(selectedFile, voice).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  const play = () => {
    console.log('play')
    // wavesurfer.current.play()
    player.start()
    Tone.Transport.start()


    setIsPlaying(true)
    setIsPaused(false)
  }

  const pause = () => {
    console.log('pause')
    Tone.Transport.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const stop = () => {
    console.log('stop')
    // wavesurfer.current.stop()
    player.stop()
    setIsPlaying(false)
    setIsPaused(false)
  }

  const mute = () => {
    console.log('mute')
    player.volume.value = -100
  }

  const volume = (event) => {
    console.log('volume')
    player.volume.value = event.target.value
  }

  const getVoices = () => {
    console.log('getVoices')
    window.api.getVoices().then((res) => {
      console.log('voices', res.voices)
      setVoices(res.voices)
    }).catch((err) => {
      console.log(err)
    })
  }

  const open_context_menu = (event, filePath) => {
    event.preventDefault()
    return window.api.open_context_menu(filePath).then((res) => {
      console.log(res)
      // Get files from getLibrary
      // Set the selected file
      setIsLoading(false)

    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
  }

  const templates = {
    now_playing: () => {
      if (selectedFile && selectedFile.metadata) {
        return (
          <div className="now-playing">
            {selectedFile ? <img src="https://via.placeholder.com/100" alt="album art" className="album-art" onClick={setLibrary} /> : <FileArrowUp className="file_upload_button" onClick={setLibrary} />}
            <div className="now-playing-info">
              {selectedFile.metadata.common.title ? <h3>{selectedFile.metadata.common.title}</h3> : <h3>{selectedFile.name}</h3>}
              {selectedFile.metadata.common.album ? <p>{selectedFile.metadata.common.album}</p> : null}
              {selectedFile.metadata.common.artist ? <p>{selectedFile.metadata.common.artist}</p> : null}
            </div>
          </div>
        )
      }
    },
    playback_controls: () => {
      const shouldShowPlayButton = (!isPlaying && !isPaused) || (isPlaying && isPaused) || (isPaused && !isPlaying);
      const shouldShowPauseButton = isPlaying && !isPaused;
      if (selectedFile) {
        return (
          <div className='flex center'>
            <div>
              {shouldShowPlayButton ? <Play className="orb" onClick={play} /> : null}
              {shouldShowPauseButton ? <Pause className="orb" onClick={pause} /> : null}
              {/* <Stop className="orb" onClick={stop} /> */}
              {/* <SpeakerNone className="orb" onClick={mute} /> */}
            </div>
            <input name="volume" type="range" min="-50" max="0" step="1" defaultValue="0" onChange={volume} />
          </div>
        )
      }
    },
    pitch_controls: () => {
      return (
        <form className='pitch-controls control'>
          <div className="control-header">
            <MusicNote size={24} />
            <h4>Pitch</h4>
          </div>
          <input name="pitch" type="range" min="-12" max="12" step="1" defaultValue="0" onChange={changePitch} />
          <p>{pitch} semitone(s)</p>
          <input disabled name="blend" type="range" min="0" max="1" step="0.1" defaultValue="1" onChange={changePitchBlend} />
          <p>Blend: {pitchBlend}</p>
        </form>
      )
    },
    speed_controls: () => {
      return (
        <form className='speed-controls control' onChange={changeSpeed}>
          <div className="control-header">
            <Gauge size={24} />
            <h4>Speed</h4>
          </div>
          <input type="range" min="0.1" max="2" defaultValue="1" step="0.1" onChange={(e) => setSpeed(e.target.value)} />
          <p>{speed}x</p>
        </form>
      )
    },
    bpm_controls: () => {
      return (
        <form className='bpm-controls control' onChange={changeBeatsPerMinute}>
          <div className="control-header">
            <Clock size={24} />
            <h4>BPM</h4>
          </div>
          <input type="range" min="60" max="180" defaultValue="120" step="1" />
          <p>{beatsPerMinute} BPM</p>
        </form>
      )
    },
    separate_controls: () => {
      const modes = [
        {
          name: 'All',
          value: 'all'
        },
        {
          name: 'Vocals',
          value: 'vocals'
        },
        {
          name: 'Drums',
          value: 'drums'
        },
        {
          name: 'Bass',
          value: 'bass'
        },
        {
          name: 'Other',
          value: 'other'
        }
      ]
      return (
        <div className='separate-controls control'>
          <div className="control-header">
            <ArrowsOutLineHorizontal size={24} />
            <h4>Isolate</h4>
          </div>
          <form onSubmit={isolate} onChange={() => synth.triggerAttackRelease("C3", "32n")} className='flex column'>
            <div className="modes">
              {modes.map((mode, index) => {
                return (
                  <div className="tag mode" key={index} tabIndex={0}>
                    <input defaultChecked={index == 0} type="radio" id={mode.value} name="mode" value={mode.value} />
                    <label htmlFor={mode.value}>{mode.name}</label>
                  </div>
                )
              })}
            </div>
            <div className="control-footer">
              <button>Start<ArrowRight /></button>
            </div>
          </form>
        </div>
      )
    },
    voice_changer_controls: () => {
      return (
        <div className='voice-changer-controls control'>
          <div className="control-header">
            <MicrophoneStage size={24} />
            <h4>Voice Changer</h4>
          </div>
          <form onSubmit={changeVoice} onChange={() => synth.triggerAttackRelease("C3", "32n")} className='flex column'>
            <div className="voices">
              {voices.map((voice, index) => {
                return (
                  <div className="tag voice" key={index} tabIndex={0}>
                    <input defaultChecked={index == 0} type="radio" id={voice} name="voice" value={voice.value} />
                    <label htmlFor={voice}>{voice}</label>
                  </div>
                )
              })}
            </div>
            <div className="control-footer">
              <button>Change</button>
            </div>
          </form>
        </div>
      )
    },
    lyrics: () => {
      if (selectedFile && lyrics) {
        return (
          <div className='lyrics'>
            <h2>Lyrics</h2>
            <div className="lyrics-container">
              {lyrics.map((lyric, index) => {
                return (
                  <div className="lyric" key={index}>
                    <h3>{lyric}</h3>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }
    },
    body: () => {
      return (
        <div className="main">
          <h3>Workbench</h3>
          <div className="controls">
            <div className="control-section">
              <div className="control-section-header">
                <h3>Effects</h3>
                <div className="divider"></div>
              </div>
              <div className="flex">
                {templates.pitch_controls()}
                {templates.speed_controls()}
                {templates.bpm_controls()}
              </div>
            </div>
          </div>
          <div className="control-section">
            <div className="control-section-header">
              <h3>Workflows</h3>
              <div className="divider"></div>
            </div>
            <div className="flex">
              {templates.separate_controls()}
              {templates.voice_changer_controls()}
            </div>
          </div>
        </div>
      )
    },
    output_folder: () => {
      return (
        <div className="output">
          <div className="flex row">
            <h3>Output</h3>
            <button onClick={set_output_folder}>Set output folder</button>
            {/* Filter non-audio files */}
          </div>
          <form onChange={openFile} className='files'>
            {outputFolder.folderContent ? outputFolder.folderContent.map((file, index) => {
              return (
                <div className="tag" key={index}>
                  <input type="radio" id={file.name} name="file" value={file.path} />
                  <label htmlFor={file.name}>{file.name}</label>
                </div>
              )
            }) : null}
          </form>
        </div>
      )
    },
    library: () => {
      const classes = ['sidebar']
      if (showLibrary) {
        classes.push('show')
      }
      return (
        <div className={classes.join(' ')}>
          <div className="library">
            <div className="flex row center no-select">
              {showLibrary ? <CaretLeft size={32} onClick={() => setShowLibrary(false)} /> : <CaretRight size={32} onClick={() => setShowLibrary(true)} />}
              <h3>Library</h3>
              {showLibrary ? <button onClick={setLibraryPath}>Set library folder</button> : null}
            </div>
            {showLibrary ? <form onChange={openFile} className='library'>
              {library ? library.map((file, index) => {
                return (
                  <div className="tag" key={index} tabIndex={0} onContextMenu={(event) => open_context_menu(event, file.path)}>
                    <input type="radio" id={file.name} name="file" value={file.path} />
                    <label htmlFor={file.name}>{file.name}</label>
                  </div>
                )
              }) : null}
            </form> : null}
          </div>
          {templates.output_folder()}
          {/* <div className="resize"
            onMouseDown={() => window.addEventListener('mousemove', resize_width_of_sidebar)}>
          </div> */}
        </div>
      )
    },
  }

  const resize_width_of_sidebar = (event) => {
    event.preventDefault()
    const sidebar = document.querySelector('.sidebar')
    const new_width = window.innerWidth + event.clientX
    sidebar.style.width = `${new_width}px`
  }


  return (
    <div className='app-content'>
      <div className='app-header'>
        <div className='header-section'>
          <h1>ArtiAudio</h1>
          <div className="flex row">
            {isLoading ? <Spinner className="animation-spin" size={32} /> : null}
          </div>
        </div>
      </div>
      <div className="app-body">
        {templates.library()}
        <div className="test">

        {templates.body()}
        <div className="footer">

            <div className="flex row">
              {templates.now_playing()}
              <div id="waveform"></div>
            </div>
            {templates.playback_controls()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
