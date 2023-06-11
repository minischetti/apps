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
from fastapi import FastAPI, File, UploadFile
from typing import Union
from pydantic import BaseModel
app = FastAPI()

@app.get("/api/")
def read_root():
    return {"Hello": "World"}

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

@app.post("/api/pitch/")
def pitch_shift(n_steps):
    # listbox2.insert(END, "Pitch shift by " + str(n_steps) + " half steps")
    global audio_file_path
    global audio_file_name
    global audio_file_ext

    if audio_file_path == "":
        print("No file selected")
        return

    print("Pitch shifting by " + str(n_steps) + " half steps")
    print("Loading " + audio_file_name)
    y, sr = librosa.load(audio_file_path)
    print("Pitch shifting...")
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)
    # Make the output directory if it doesn't exist
    write_sound_file(result, sr, "pitch_shift" + str(n_steps))

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
@app.post("/api/separate/")
def separate(isolate_track=separation_options[0]):
    # Construct the command
    command = ["python", "-m", "demucs", "-o=" + out_dir_now(), audio_file_path]

    # Add the isolate track option if it is not set to "All"
    if isolate_track != separation_options[0]:
        command.append("--two-stems=" + isolate_track.lower())

    print(command)
    print("Separating tracks...")
    # Run the command
    subprocess.run(command, shell=True)
    print("Separation complete")

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
    print(audio_file_path)


class TranscribeRequest(BaseModel):
    filePath: str
    class Config:
        frozen = True

@app.post("/api/transcribe/")
def generate_lyrics(filePath: TranscribeRequest):
    print(filePath)

    # Check if file path is provided
    if filePath == None:
        return {"message": "No file path provided"}
    
    # Check if path is valid
    if not os.path.exists(filePath.filePath):
        return {"message": "File path is invalid"}
    
    result = model.transcribe(filePath.filePath)
    print(result)
    # print(result)
    # for word in result["segments"]:
    #     print(word)

    return result["segments"]

@app.post("/api/upload/")
def upload(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}

@app.post("/api/voice/")
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