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
# y = ""
sr = ""
in_dir = "./in/"
out_dir = "./out/"
mixer.init()

def pitch_shift(n_steps):
    listbox2.insert(END, "Pitch shift by " + str(n_steps) + " half steps")
    print("Pitch shifting by " + str(n_steps) + " half steps")
    y, sr = librosa.load(audio_file)
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)


    # return result

# def time_stretch(y, sr, rate):
#     print("Time stretching by a factor of " + str(rate))
#     result = librosa.effects.time_stretch(y, rate=rate)
#     soundfile.write(out_dir + audio_file, result, sr)
#     return result

def separate():
    subprocess.run("python -m demucs --two-stems=vocals -o=./out " + audio_file)
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
    Scala.set(0)
 
root = Tk()
root.title("ArtiAudio")
frame = Frame(root)
frame.pack()

buttons = Frame(frame)
buttons.grid(row=0, column=0)
buttons.pack()

# Open file button
Button(frame, text="Open file", command=lambda: open_file()).pack(padx=5, pady=5)
label_file_name = Label(frame, text=audio_file)
label_file_name.pack(padx=5, pady=5)

# Pitch shift slider
Label(frame, text="Pitch shift").pack(padx=5, pady=5)
Scala = Scale(frame, from_=-10, to=10, orient=HORIZONTAL)
Scala.pack(padx=5, pady=5)
Button(frame, text="Pitch shift", command=lambda: pitch_shift(Scala.get())).pack(padx=5, pady=5)

# Separate button
Label(frame, text="Stem/track separation", font="24px").pack(padx=5, pady=5)
Button(frame, text="Separate", command=lambda: separate()).pack(padx=5, pady=5)
Checkbutton(frame, text="Two stems").pack(padx=5, pady=5)
# Input
Label(frame, text="Isolation mode", font="16px").pack(padx=5, pady=5)
# Label(frame, text="Isolate the desired track with the other stems mixed together.").pack(padx=5, pady=5)
combobox = Combobox(frame, values=["Vocals", "Drums", "Bass", "Other"])
combobox.current(0)
combobox.pack(padx=5, pady=5)

# Play and pause button
Button(buttons, text="Play", command=lambda: play()).pack(padx=5, pady=5)
Button(buttons, text="Pause", command=lambda: pause()).pack(padx=5, pady=5)
Button(buttons, text="Unpause", command=lambda: unpause()).pack(padx=5, pady=5)
Button(buttons, text="Reset", command=lambda: reset()).pack(padx=5, pady=5)

Label(frame, text="Files").pack(padx=5, pady=5)
listbox = Listbox(frame)
for item in os.listdir(in_dir):
    listbox.bind('<<ListboxSelect>>', lambda event: set_audio_file(in_dir + listbox.get(ANCHOR)))
    listbox.insert(END, item)
listbox.pack()

Label(frame, text="Operations").pack(padx=5, pady=5)
listbox2 = Listbox(frame)
for item in operations:
    listbox2.insert(END, item)
listbox2.pack()


root.mainloop()

exit()

# Get audio file from command line
audio_file_name = ""
audio_file_ext = ""
if len(sys.argv) > 1:
    audio_file = sys.argv[1]
    info = audio_file.split(".")
    audio_file_name = info[0]
    audio_file_ext = info[1]

else:
    print("Usage: python audio.py <audio_file>")
    audio_file = input("Enter an audio file location: ")

# What would you like to do with the audio file?
print("What would you like to do with the audio file?")
print("1. Get the tempo of the song")
print("2. Pitch shift the song")
print("3. Time stretch the song")
print("4. Create a click track")
print("5. Exit")
# Load the audio file

# Get the tempo
def functions():
    choice = input("Enter your choice: ")
    y, sr = librosa.load(in_dir + audio_file)
    if choice == "1":
        tempo = librosa.beat.beat_track(y=y, sr=sr)
        print('Estimated tempo: {:.2f} beats per minute'.format(tempo))
    # Pitch shift the song
    if choice == "2":
        pitch = librosa.effects.pitch_shift(y, sr=sr, n_steps=4)
        # create a directory
        soundfile.write(out_dir + audio_file, pitch, sr)
    # Time stretch the song
    if choice == "3":
        rate = input("Enter the rate: ")
        rate = float(rate)
        stretch = librosa.effects.time_stretch(y, rate=rate)
        out = out_dir + audio_file_name + "/";
        os.makedirs(out, exist_ok=True)

        soundfile.write(out + audio_file_name  + "-" + str(rate) + "." + audio_file_ext, stretch, sr)
    # Create a click track
    if choice == "4":
        click = librosa.clicks(frames='audio_click_track.wav', sr=sr, length=len(y))
        soundfile.write('audio_click_track.wav', click, sr)
    if choice == "5":
        exit()
    if choice == "":
        functions()

functions()