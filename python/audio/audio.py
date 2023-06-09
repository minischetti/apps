import datetime
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
import webbrowser

from pygame import mixer
audio_file_path = ""
audio_file_name = ""
audio_file_ext = ""
audio_file_original = ""
in_dir = "./in/"
out_dir = "./out/"
mixer.init()

# Get the current date and time
now = lambda: datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
out_dir_now = lambda: out_dir + now() + "/" + audio_file_name + "/"

def pitch_shift(n_steps):
    # listbox2.insert(END, "Pitch shift by " + str(n_steps) + " half steps")
    global audio_file_path
    global audio_file_name
    global audio_file_ext
    print("Pitch shifting by " + str(n_steps) + " half steps")
    print("Loading " + audio_file_name)
    y, sr = librosa.load(audio_file_path)
    print("Pitch shifting...")
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)
    print("Saving...")
    # Make the output directory if it doesn't exist
    output_dir = out_dir_now() + "/" + "pitch" + "/" + str(n_steps) + "/"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    soundfile.write(output_dir + audio_file_name, result, sr)
    print("Pitch shift complete and file saved to output folder")

    # return result

# def time_stretch(y, sr, rate):
#     print("Time stretching by a factor of " + str(rate))
#     result = librosa.effects.time_stretch(y, rate=rate)
#     soundfile.write(out_dir + audio_file, result, sr)
#     return result

def separate(isolate_track="All"):
    # Set the command
    command = "python -m demucs -o=" + out_dir_now() + " " + audio_file_path

    # Add the isolate track option if it is not set to "All"
    if isolate_track != "All":
        command += " --two-stems=" + isolate_track.lower()

    # Run the command
    print(command)
    print("Separating tracks...")
    subprocess.run(command, shell=True)
    print("Separation complete")

def open_file():
    # Declare the global variables
    global audio_file_path
    global audio_file_name
    global audio_file_ext

    # Open the file dialog
    file = filedialog.askopenfilename(initialdir = "./in", title = "Select file")

    # Set the audio file path and name variables
    audio_file_path = file
    audio_file_name = os.path.basename(audio_file_path).split(".")[0]
    audio_file_ext = os.path.basename(audio_file_path).split(".")[1]


    # Update the label
    label_file_name.config(text=audio_file_name)
    label_file_path.config(text=audio_file_path)
    print(audio_file_path)


# Playback functions
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

# GUI
root = Tk()
root.title("ArtiAudio")
frame = Frame(root)
frame.grid(row=0, column=0)


# Menu
menu = Menu(root)
menu_file = Menu(menu, tearoff=0)
menu_file.add_command(label="Open file", command=lambda: open_file())
menu_file.add_separator()
menu_file.add_command(label="Open input folder", command=lambda: webbrowser.open(os.path.abspath(in_dir)))
menu_file.add_command(label="Open output folder", command=lambda: webbrowser.open(os.path.abspath(out_dir)))
menu_file.add_separator()
menu_file.add_command(label="Exit", command=lambda: root.quit())
menu.add_cascade(label="File", menu=menu_file)
root.config(menu=menu)

label_file_name = Label(frame, text=audio_file_name, font="24px")
label_file_name.grid(row=0, column=1, padx=5, pady=5)
label_file_path = Label(frame, text=audio_file_path, font="18px")
label_file_path.grid(row=1, column=1, padx=5, pady=5)

# Playback buttons
buttons = Frame(frame)
buttons.grid(row=2, column=0)

# Play and pause button
Label(frame, text="Playback", font="24px").grid(row=1, column=0, padx=5, pady=5)
Button(buttons, text="Play", command=lambda: play()).grid(row=2, column=0, padx=5, pady=5)
Button(buttons, text="Pause", command=lambda: pause()).grid(row=2, column=1, padx=5, pady=5)
Button(buttons, text="Unpause", command=lambda: unpause()).grid(row=2, column=2, padx=5, pady=5)
Button(buttons, text="Reset", command=lambda: reset()).grid(row=2, column=3, padx=5, pady=5)

# play_button_image = PhotoImage(file="play.png")
# play_button = Button(buttons, image=play_button_image, command=lambda: play())


# Pitch shift slider
Label(frame, text="Pitch shift", font="24px").grid(row=1, column=1, padx=5, pady=5)
pitch_scale = Scale(frame, from_=-10, to=10, orient=HORIZONTAL)
pitch_scale.grid(row=2, column=1, padx=5, pady=5)
Button(frame, text="Pitch shift", command=lambda: pitch_shift(pitch_scale.get())).grid(row=3, column=1, padx=5, pady=5)

# Stem/track separation
Label(frame, text="Stem/track separation", font="24px").grid(row=1, column=2, padx=5, pady=5)
# Isolate track options
isolate_track_options = Combobox(frame, values=["All", "Vocals", "Drums", "Bass", "Other"], state="readonly")
# Set the default value to the first option
isolate_track_options.current(0)
isolate_track_options.grid(row=2, column=2, padx=5, pady=5)
Button(frame, text="Separate", command=lambda: separate(isolate_track_options.get())).grid(row=3, column=2, padx=5, pady=5)

root.mainloop()