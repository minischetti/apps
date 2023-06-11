import datetime
import io
import sys
import librosa
import soundfile
import os
import demucs.separate
from tkinter import * 
from tkinter import filedialog
from tkinter.ttk import Combobox, Progressbar
import subprocess
import webbrowser
import whisper
from pygame import mixer
from fastapi import FastAPI
app = FastAPI()


# Set up the whisper model
model = whisper.load_model("base")

audio_file_path = ""
audio_file_name = ""
audio_file_ext = ""
audio_file_original = ""
in_dir = "./in/"
out_dir = "./out/"
mixer.init()

# Get the current date and time
now = lambda: datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
out_dir_now = lambda: out_dir + audio_file_name + "/"

def pitch_shift(n_steps):
    # listbox2.insert(END, "Pitch shift by " + str(n_steps) + " half steps")
    global audio_file_path
    global audio_file_name
    global audio_file_ext
    global progress
    global progress_label

    if audio_file_path == "":
        progress_label.config(text="No file selected")
        print("No file selected")
        return

    progress.start()
    progress_label.config(text="Pitch shifting...")
    print("Pitch shifting by " + str(n_steps) + " half steps")
    print("Loading " + audio_file_name)
    progress_label.config(text="Loading " + audio_file_name)
    y, sr = librosa.load(audio_file_path)
    print("Pitch shifting...")
    progress_label.config(text="Pitch shifting...")
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)
    progress_label.config(text="Saving...")
    # Make the output directory if it doesn't exist
    write_sound_file(result, sr, "pitch_shift" + str(n_steps))
    progress_label.config(text="Done")
    progress.stop()
    progress_label.config(text="Standby...")

def write_sound_file(data, sample_rate, operation_name):
    # Make the output directory if it doesn't exist
    print("Saving...")
    output_dir = out_dir + audio_file_name + "/" + operation_name + "/"
    print(output_dir)
    if not os.path.exists(output_dir):
        print("Making directory " + output_dir)
        os.makedirs(output_dir)
    
    # Write the file
    print("Writing file...")
    soundfile.write(output_dir + audio_file_name + "." + audio_file_ext, data, sample_rate)
    print("File written")

# def time_stretch(y, sr, rate):
#     print("Time stretching by a factor of " + str(rate))
#     result = librosa.effects.time_stretch(y, rate=rate)
#     soundfile.write(out_dir + audio_file, result, sr)
#     return result

separation_options = ["All", "Vocals", "Drums", "Bass", "Other"]
def separate(isolate_track=separation_options[0]):
    # Declare the global variables
    global progress
    global progress_label
    # Construct the command
    command = ["python", "-m", "demucs", "-o=" + out_dir_now(), audio_file_path]

    # Add the isolate track option if it is not set to "All"
    if isolate_track != separation_options[0]:
        command.append("--two-stems=" + isolate_track.lower())

    print(command)
    print("Separating tracks...")
    progress_label.config(text="Separating tracks...")
    progress.start()
    # Run the command
    subprocess.run(command, shell=True)
    progress_label.config(text="Separation complete")
    print("Separation complete")
    progress_label.config(text="Standby...")
    progress.stop()

def open_file():
    # Declare the global variables
    global audio_file_path
    global audio_file_name
    global audio_file_ext

    # Open the file dialog
    file = filedialog.askopenfilename(initialdir = "./in", title = "Select file")

    # Check if a file was opened
    if file == "":
        return

    # Set the audio file path and name variables
    audio_file_path = file
    audio_file_name = os.path.basename(audio_file_path).split(".")[0]
    audio_file_ext = os.path.basename(audio_file_path).split(".")[1]


    # Update the label
    description.config(text=audio_file_name)
    print(audio_file_path)


# Playback functions
def play():
    mixer.music.load(audio_file_path)
    mixer.music.play()

def pause():
    mixer.music.pause()

def unpause():
    mixer.music.unpause()

def stop():
    mixer.music.stop()

def generate_lyrics():
    result = model.transcribe(audio_file_path)
    print(result)
    # lyrics.config(text=result["text"])
    lyrics.delete(1.0, END)
    # lyrics.insert(END, result["text"])
    for word in result["segments"]:
        # insert lyrics into the text box with a new line after each word
        lyrics.insert(END, word["text"] + "\n")

def change_voice(voice):
    model_config = ""
    model_data = ""
    for models in os.listdir("./models"):
        if voice in models:
            model_config = "./models/" + voice + "/config.json"
            # Find file with .pth extension
            for file in os.listdir("./models/" + models):
                if file.endswith(".pth"):
                    model_data = "./models/" + voice + "/" + file
                    break
            break
    if model_config == "" or model_data == "":
        print("Voice not found")
        return
    print("Changing voice to " + voice)
    print(model_config)
    print(model_data)
    command = ["svc", "infer", "-m", model_data, "-c", model_config, "-o", out_dir_now() + audio_file_name + "_" + voice + ".wav", audio_file_path]
    subprocess.run(command, shell=True)


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

title = Label(frame, text="ArtiAudio", font=("Roboto Mono", 32, "bold"))
title.grid(row=0, column=0, columnspan=4, padx=5, pady=5)

description = Label(frame, text="Load an audio file...", font=("Roboto Mono", 12))
description.bind("<Button-1>", lambda e: open_file())
description.grid(row=1, column=0, columnspan=4, padx=5, pady=5)

progress = Progressbar(frame, orient=HORIZONTAL, mode='indeterminate')
progress.grid(row=2, column=0, columnspan=4, padx=5, pady=5)
progress_label = Label(frame, text="Standby...", font=("Roboto Mono", 12))
progress_label.grid(row=3, column=0, columnspan=4, padx=5, pady=5)

# label_file_name = Label(frame, text=audio_file_name, font="24px")
# label_file_name.grid(row=0, column=1, padx=5, pady=5)
# label_file_path = Label(frame, text=audio_file_path, font="16px")
# label_file_path.grid(row=1, column=1, padx=5, pady=5)

# Playback buttons
buttons = Frame(frame)
buttons.grid(row=2, column=0, columnspan=4)

Button(buttons, text="Play", command=lambda: play()).grid(row=4, column=0, padx=5, pady=5)
Button(buttons, text="Pause", command=lambda: pause()).grid(row=4, column=1, padx=5, pady=5)
Button(buttons, text="Unpause", command=lambda: unpause()).grid(row=4, column=2, padx=5, pady=5)
Button(buttons, text="Stop", command=lambda: stop()).grid(row=4, column=3, padx=5, pady=5)

# play_button_image = PhotoImage(file="play.png")
# play_button = Button(buttons, image=play_button_image, command=lambda: play())


# Pitch shift slider
pitch_section = Frame(frame)
pitch_section.grid(row=4, column=0)
Label(pitch_section, text="Pitch shift", font="24px").grid(column=0, padx=5, pady=5)
pitch_scale = Scale(pitch_section, from_=-10, to=10, orient=HORIZONTAL)
pitch_scale.grid(column=0, padx=5, pady=5)
Button(pitch_section, text="Pitch shift", command=lambda: pitch_shift(pitch_scale.get())).grid(column=0, padx=5, pady=5)

# Stem/track separation
section_separator = Frame(frame)
section_separator.grid(row=4, column=1)
Label(section_separator, text="Stem/track separation", font="24px").grid(row=4, padx=5, pady=5)
# Isolate track options
isolate_track_options = Combobox(section_separator, values=separation_options, state="readonly")
# Set the default value to the first option
isolate_track_options.current(0)
isolate_track_options.grid(row=5, padx=5, pady=5)
Button(section_separator, text="Separate", command=lambda: separate(isolate_track_options.get())).grid(row=6, padx=5, pady=5)

# Voice changer
models_dir = os.path.abspath("models")
voice_options = []
for model in os.listdir(models_dir):
    voice_options.append(model)

section_voice_changer = Frame(frame)
section_voice_changer.grid(row=4, column=2)
Label(section_voice_changer, text="Voice changer", font="24px").grid(row=4, padx=5, pady=5)

voice_changer_options = Combobox(section_voice_changer, values=voice_options, state="readonly")
# Set the default value to the first option
voice_changer_options.current(0)
voice_changer_options.grid(row=5, padx=5, pady=5)
Button(section_voice_changer, text="Change voice", command=lambda: change_voice(voice_changer_options.get())).grid(row=6, padx=5, pady=5)
# for each model in the models folder, add it to the voice changer options


# Lyrics
section_lyrics = Frame(frame)
section_lyrics.grid(row=7, column=0, padx=5, pady=5)

Label(frame, text="Lyrics", font="24px").grid(column=0, padx=5, pady=5)
Button(frame, text="Generate lyrics", command=lambda: generate_lyrics()).grid(column=0, padx=5, pady=5)

lyrics = Text(frame)
lyrics.insert(INSERT, "Lyrics will appear here")
lyrics.grid(column=0, padx=5, pady=5)



root.mainloop()