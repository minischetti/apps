import io
import sys
import librosa
import soundfile
import os
import demucs.separate
from tkinter import * 
from tkinter import filedialog
from tkinter.ttk import Combobox
import subprocess

from pygame import mixer
audio_file_path = ""
audio_file_name = ""
audio_file_original = ""
operations = []
settings = {}

settings["pitch_shift"] = 0
settings["time_stretch"] = 1
settings["stems"] = False
settings["stems_isolate"] = "vocals"
settings["stems_isolate_track"] = False
# y = ""
sr = ""
in_dir = "./in/"
out_dir = "./out/"
mixer.init()

def pitch_shift(n_steps):
    # listbox2.insert(END, "Pitch shift by " + str(n_steps) + " half steps")
    global audio_file
    print("Pitch shifting by " + str(n_steps) + " half steps")
    y, sr = librosa.load(audio_file.path)
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)
    
    soundfile.write(out_dir + audio_file.name, result, sr)

    # return result

# def time_stretch(y, sr, rate):
#     print("Time stretching by a factor of " + str(rate))
#     result = librosa.effects.time_stretch(y, rate=rate)
#     soundfile.write(out_dir + audio_file, result, sr)
#     return result

def separate(isolate_track=False, isolate_track_name="vocals"):
    command = ["python -m demucs", "-o=./out", audio_file]
    if isolate_track:
        command.append("--two-stems=" + isolate_track_name)
    subprocess.run("python3 -m demucs -o=./out " + audio_file, shell=True)
    # demucs.separate.main("--shifts 1 --model demucs --dl -n -d cpu " + audio_file)
def open_file():
    global audio_file_path
    global audio_file_name
    file = filedialog.askopenfilename(initialdir = "./in", title = "Select file")
    audio_file_path = file
    audio_file_name = os.path.basename(file)
    label_file_name.config(text=audio_file_name)
    print(audio_file_name)
    print(audio_file_path)

def play():
    mixer.music.load(audio_file_path)
    mixer.music.play()

def pause():
    mixer.music.pause()

def unpause():
    mixer.music.unpause()

def reset():
    mixer.music.stop()
    mixer.music.load(audio_file_original)
    pitch_scale.set(0)
 
root = Tk()
root.title("ArtiAudio")
frame = Frame(root)
frame.grid(row=0, column=0)

# Open file button
Button(frame, text="Open file", command=lambda: open_file()).grid(padx=5, pady=5)
label_file_name = Label(frame, text=audio_file_name)
label_file_name.grid(padx=5, pady=5)

# Playback buttons
buttons = Frame(frame)
buttons.grid(row=1, column=0)

# Play and pause button
Button(buttons, text="Play", command=lambda: play()).grid(row=0, column=0, padx=5, pady=5)
Button(buttons, text="Pause", command=lambda: pause()).grid(row=0, column=1, padx=5, pady=5)
Button(buttons, text="Unpause", command=lambda: unpause()).grid(row=0, column=2, padx=5, pady=5)
Button(buttons, text="Reset", command=lambda: reset()).grid(row=0, column=3, padx=5, pady=5)


# Pitch shift slider
Label(frame, text="Pitch shift").grid(padx=5, pady=5)
pitch_scale = Scale(frame, from_=-10, to=10, orient=HORIZONTAL)
pitch_scale.grid(padx=5, pady=5)
Button(frame, text="Pitch shift", command=lambda: pitch_shift(pitch_scale.get())).grid(padx=5, pady=5)

# Separate button
Label(frame, text="Stem/track separation", font="24px").grid(padx=5, pady=5)
Label(frame, text="Separate the tracks of a song.").grid(padx=5, pady=5)
Button(frame, text="Separate", command=lambda: separate()).grid(padx=5, pady=5)

# Isolate track options
isolate_track_options = Combobox(frame, values=["All", "Vocals", "Drums", "Bass", "Other"], state="readonly")
# Set the default value to the first option
isolate_track_options.current(0)
isolate_track_options.grid(padx=5, pady=5)


root.mainloop()