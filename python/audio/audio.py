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
audio_file = ""
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
    print("Pitch shifting by " + str(n_steps) + " half steps")
    y, sr = librosa.load(audio_file)
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)
    soundfile.write("./out/tmp/tmp.wav", result, sr)


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
def set_audio_file(file):
    global audio_file
    audio_file = file
    label_file_name.config(text=audio_file)
def open_file():
    global audio_file
    global audio_file_original
    audio_file = filedialog.askopenfilename(initialdir = "./", title = "Select file")
    audio_file_original = audio_file
    label_file_name.config(text=audio_file)
    print(audio_file)
    return audio_file

def play():
    mixer.music.load(audio_file)
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
frame.pack()

buttons = Frame(frame)
buttons.grid(row=0, column=0)
buttons.pack()

# Play and pause button
Button(buttons, text="Play", command=lambda: play()).pack(padx=5, pady=5)
Button(buttons, text="Pause", command=lambda: pause()).pack(padx=5, pady=5)
Button(buttons, text="Unpause", command=lambda: unpause()).pack(padx=5, pady=5)
Button(buttons, text="Reset", command=lambda: reset()).pack(padx=5, pady=5)

# Open file button
Button(frame, text="Open file", command=lambda: open_file()).pack(padx=5, pady=5)
label_file_name = Label(frame, text=audio_file)
label_file_name.pack(padx=5, pady=5)

# Pitch shift slider
Label(frame, text="Pitch shift").pack(padx=5, pady=5)
pitch_scale = Scale(frame, from_=-10, to=10, orient=HORIZONTAL)
pitch_scale.pack(padx=5, pady=5)
Button(frame, text="Pitch shift", command=lambda: pitch_shift(pitch_scale.get())).pack(padx=5, pady=5)

# Separate button
Label(frame, text="Stem/track separation", font="24px").pack(padx=5, pady=5)
isolate_track_check = Checkbutton(frame, text="Isolate stem")
isolate_track_check.pack(padx=5, pady=5)
# Input
Label(frame, text="Isolation mode", font="16px").pack(padx=5, pady=5)
Label(frame, text="Isolate the desired track with the other stems mixed together.").pack(padx=5, pady=5)
combobox = Combobox(frame, values=["Vocals", "Drums", "Bass", "Other"], state="readonly")
combobox.current(0)
combobox.pack(padx=5, pady=5)
Button(frame, text="Separate", command=lambda: separate()).pack(padx=5, pady=5)

Label(frame, text="Files").pack(padx=5, pady=5)
listbox = Listbox(frame)
for item in os.listdir(in_dir):
    listbox.bind('<<ListboxSelect>>', lambda event: set_audio_file(in_dir + listbox.get(ANCHOR)))
    listbox.insert(END, item)
listbox.pack()


root.mainloop()