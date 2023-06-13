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

class FileRequest(BaseModel):
    filePath: str
    class Config:
        frozen = True
class PitchRequest(BaseModel):
    filePath: str
    nSteps: int
    class Config:
        frozen = True
class SpeedRequest(BaseModel):
    filePath: str
    speed: float
    class Config:
        frozen = True
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
def pitch_shift(PitchRequest: PitchRequest):
    # listbox2.insert(END, "Pitch shift by " + str(n_steps) + " half steps")
    file_path = PitchRequest.filePath
    file_name = os.path.basename(PitchRequest.filePath).split(".")[0]
    file_ext = os.path.basename(PitchRequest.filePath).split(".")[1]

    if PitchRequest.filePath == "":
        print("No file selected")
        return

    y, sr = librosa.load(file_path)
    result = librosa.effects.pitch_shift(y, sr=sr, n_steps=PitchRequest.nSteps)
    # Make the output directory if it doesn't exist
    write_sound_file(result, sr, "pitch_shift" + str(PitchRequest.nSteps), file_name, file_ext)

def write_sound_file(data, sample_rate, operation_name, file_name, file_ext):
    # Make the output directory if it doesn't exist
    print("Saving...")
    output_dir = out_dir + file_name + "/" + operation_name + "/"
    print(output_dir)
    if not os.path.exists(output_dir):
        print("Making directory " + output_dir)
        os.makedirs(output_dir)
    
    # Write the file
    print("Writing file...")
    soundfile.write(output_dir + file_name + "." + file_ext, data, sample_rate)
    print("File written")
    return {"message": "Successfully saved " + file_name + "." + file_ext}

@app.post("/api/speed/")
def time_stretch(SpeedRequest: SpeedRequest):
    file_path = SpeedRequest.filePath
    file_name = os.path.basename(SpeedRequest.filePath).split(".")[0]
    file_ext = os.path.basename(SpeedRequest.filePath).split(".")[1]

    if SpeedRequest.filePath == "":
        print("No file selected")
        return
    
    y, sr = librosa.load(SpeedRequest.filePath)
    print("Time stretching by a factor of " + str(SpeedRequest.speed))
    result = librosa.effects.time_stretch(y, rate=SpeedRequest.speed)
    write_sound_file(result, sr, "time_stretch" + str(SpeedRequest.speed), file_name, file_ext)
    return {"message": "Successfully saved " + file_name + "." + file_ext}

class SeparationRequest(BaseModel):
    filePath: str
    mode: str
    class Config:
        frozen = True
separation_options = ["All", "Vocals", "Drums", "Bass", "Other"]
@app.post("/api/separate/")
def separate(SeparationRequest: SeparationRequest):
    file_path = SeparationRequest.filePath
    file_name = os.path.basename(SeparationRequest.filePath).split(".")[0]
    file_ext = os.path.basename(SeparationRequest.filePath).split(".")[1]
    # Construct the command
    command = ["python", "-m", "demucs", "-o=" + out_dir_now(), file_path]

    # Add the isolate track option if it is not set to "All"
    if SeparationRequest.mode != separation_options[0].lower():
        command.append("--two-stems=" + SeparationRequest.mode.lower())

    print(command)
    print("Separating tracks...")
    # Run the command
    subprocess.run(command, shell=True)
    return {"message": "Separation complete"}
    print("Separation complete")

@app.post("/api/open/")
def open_file(FileRequest: FileRequest):
    # Declare the global variables
    global audio_file_path
    global audio_file_name
    global audio_file_ext

    # Open the file dialog
 

    # Check if a file was opened
    # if FileRequest.filePath == "":
    #     return

    # Set the audio file path and name variables
    audio_file_path = FileRequest.filePath
    audio_file_name = os.path.basename(audio_file_path).split(".")[0]
    audio_file_ext = os.path.basename(audio_file_path).split(".")[1]

    print(audio_file_path)
    # Return a success response
    return {"message": "Successfully opened " + audio_file_name}


@app.post("/api/lyrics/")
def generate_lyrics(filePath: FileRequest):
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