from ast import List
import datetime
import io
import json
import shutil
import sys
import librosa
import soundfile
import os
import demucs.separate
import subprocess
import whisper
# from pygame import mixer
from fastapi import FastAPI, File, UploadFile
from typing import Union
from pydantic import BaseModel
import soundfile as soundfile
import io

from urllib.request import urlopen

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
class VoiceRequest(BaseModel):
    filePath: str
    voice: str
    class Config:
        frozen = True
class FileClass(BaseModel):
    name: str
    path: str
    class Config:
        frozen = True
class FilePath(BaseModel):
    path: str
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
# mixer.init()

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

    memory_file = io.BytesIO()
    memory_file.name = 'audio.wav'
    soundfile.write(memory_file, result, sr, format="wav")
    memory_file.seek(0)


    return memory_file


    
    # return io.BytesIO(result)

    # output = write_sound_file(result, sr, "pitch_shift" + str(PitchRequest.nSteps), file_path, file_name, file_ext)
    # return {"message": "Successfully saved " + file_name + "." + file_ext, "filePath": output}

def write_sound_file(data, sample_rate, operation_name, file_path, file_name, file_ext):
    # Make the output directory if it doesn't exist
    print("Saving...")
    output_path = file_name + ".aa." + file_ext

    # Check if the directory exists
    if not os.path.exists(out_dir_now()):
        print("Making directory " + out_dir_now())
        os.makedirs(out_dir_now())

    # Check if the file already exists
    if os.path.exists(out_dir_now() + output_path):
        count = 1
        print("File already exists")
        output_path = file_name + "." + str(count) + ".aa." + file_ext
        # Increment the count until the file doesn't exist
        while os.path.exists(out_dir_now() + output_path):
            count += 1
            output_path = file_name + "." + str(count) + ".aa." + file_ext
    print("Saving as " + output_path)
    # output_dir = out_dir + file_name + "/" + operation_name + "/"
    # print(output_dir)
    # if not os.path.exists(output_dir):
    #     print("Making directory " + output_dir)
    #     os.makedirs(output_dir)
    
    # Write the file
    print("Writing file...")
    soundfile.write(output_path, data, sample_rate)
    print("File written")
    return output_path
    # return {"message": "Successfully saved " + file_name + "." + file_ext}

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

class IsolationRequest(BaseModel):
    filePath: str
    mode: str
    class Config:
        frozen = True
isolation_options = ["All", "Vocals", "Drums", "Bass", "Other"]
@app.post("/api/isolate/")
def isolate(IsolationRequest: IsolationRequest):
    file_path = IsolationRequest.filePath
    file_name = os.path.basename(IsolationRequest.filePath).split(".")[0]
    file_ext = os.path.basename(IsolationRequest.filePath).split(".")[1]
    # Construct the command
    command = ["python", "-m", "demucs", "-o=" + out_dir_now(), file_path]

    # Add the isolate track option if it is not set to "All"
    if IsolationRequest.mode != isolation_options[0].lower():
        command.append("--two-stems=" + IsolationRequest.mode.lower())

    print(command)
    print("Separating tracks...")
    # Run the command
    subprocess.run(command, shell=True)
    return {"message": "Separation complete"}

@app.post("/api/open/")
def open_file(FileRequest: FileRequest):
    # Return the file name, file path, and bpm
    file_path = FileRequest.filePath
    file_name = os.path.basename(FileRequest.filePath).split(".")[0]
    file_ext = os.path.basename(FileRequest.filePath).split(".")[1]
    tempo,beats = librosa.beat.beat_track()

    return {"name": file_name, "path": file_path, "ext": file_ext}


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
    # print(result)
    words = []
    for word in result["segments"]:
        words.append(word["text"])

    return {"message": "Successfully generated lyrics", "words": words}
    # return result["segments"]

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
def change_voice(VoiceRequest: VoiceRequest):
    model_config = ""
    model_data = ""
    for models in os.listdir("./models"):
        if VoiceRequest.voice in models:
            model_config = "./models/" + VoiceRequest.voice + "/config.json"
            # Find file with .pth extension
            for file in os.listdir("./models/" + models):
                if file.endswith(".pth"):
                    model_data = "./models/" + VoiceRequest.voice + "/" + file
                    break
            break
    if model_config == "" or model_data == "":
        print("Voice not found")
        return
    print("Changing voice to " + VoiceRequest.voice)
    print(model_config)
    print(model_data)
    output_file_name = VoiceRequest.filePath.split(".")[0] + "_" + VoiceRequest.voice + ".wav"
    # add a check to see if the file already exists and iterate the name
    if os.path.exists(output_file_name):
        print("File already exists")
        output_file_name = VoiceRequest.filePath.split(".")[0] + "_" + VoiceRequest.voice + "_1.wav"

    command = ["svc", "infer", "--no-auto-predict-f0", "--f0-method", "crepe", "--db-thresh", "-50", "-m", model_data, "-c", model_config, "-o", + VoiceRequest.voice + ".wav", VoiceRequest.filePath]
    subprocess.run(command, shell=True)
    return {"message": "Successfully changed voice to " + VoiceRequest.voice}


class TrainRequest(BaseModel):
    voice: str
    samplesPath: str
    class Config:
        frozen = True
@app.post("/api/train/")
def train_voice(TrainRequest: TrainRequest):

    # Check if the model already exists
    for models in os.listdir("./models"):
        if TrainRequest.voice in models:
            print("Voice already exists")
            return {"message": "Voice already exists"}
        
    print("Training voice " + TrainRequest.voice)
    print(TrainRequest.files)

    # Create the dataset_raw folder
    os.mkdir("./dataset_raw")

    # Create a folder for the voice
    os.mkdir("./dataset_raw/" + TrainRequest.voice)

    # Move the files to the voice folder
    files = os.listdir(TrainRequest.samplesPath)
    for file in files:
        shutil.move(TrainRequest.samplesPath + "/" + file, "./dataset_raw/" + TrainRequest.voice + "/" + file)
    
    # Run svc pre-resample
    command = ["svc", "pre-resample"]
    subprocess.run(command, shell=True)

    # Run svc pre-config
    command = ["svc", "pre-config"]
    subprocess.run(command, shell=True)

    # Run svc pre-hubert
    command = ["svc", "pre-hubert"]
    subprocess.run(command, shell=True)

    # Run svc train -t
    command = ["svc", "train", "-t"]
    subprocess.run(command, shell=True)



