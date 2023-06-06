import sys
import librosa
import soundfile

# Get the first arg
if len(sys.argv) > 1:
    audio_file = sys.argv[1]
else:
    print("Usage: python audio.py <audio_file>")
    sys.exit(1)

# audio_file = input("Enter an audio file location:")
# Load audio file
y, sr = librosa.load(audio_file)
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
print('Estimated tempo: {:.2f} beats per minute'.format(tempo))

# Pitch shift
# Saves pitch shifted song to the same directory as the original song
result = librosa.effects.pitch_shift(y, sr=sr, n_steps=4)
soundfile.write('audio_pitch_shifted.wav', result, sr)

# Time stretch
# Saves time stretched song to the same directory as the original song
stretch = librosa.effects.time_stretch(y, rate= 2.0)
soundfile.write('audio_time_stretched.wav', result, sr)

# get input from user

# # Click track
# # Saves click track to the same directory as the original song
# click = librosa.clicks(frames='audio_click_track.wav', sr=sr, length=len(y))
# soundfile.write('audio_click_track.wav', click, sr)