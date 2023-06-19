import datetime
import io
import json
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
    # return io.BytesIO(result)
    output = write_sound_file(result, sr, "pitch_shift" + str(PitchRequest.nSteps), file_path, file_name, file_ext)
    return {"message": "Successfully saved " + file_name + "." + file_ext, "filePath": output}

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
separation_options = ["All", "Vocals", "Drums", "Bass", "Other"]
@app.post("/api/isolate/")
def isolate(IsolationRequest: IsolationRequest):
    file_path = IsolationRequest.filePath
    file_name = os.path.basename(IsolationRequest.filePath).split(".")[0]
    file_ext = os.path.basename(IsolationRequest.filePath).split(".")[1]
    # Construct the command
    command = ["python", "-m", "demucs", "-o=" + out_dir_now(), file_path]

    # Add the isolate track option if it is not set to "All"
    if IsolationRequest.mode != separation_options[0].lower():
        command.append("--two-stems=" + IsolationRequest.mode.lower())

    print(command)
    print("Separating tracks...")
    # Run the command
    subprocess.run(command, shell=True)
    return {"message": "Separation complete"}
    print("Separation complete")

@app.post("/api/open/")
def open_file(FileRequest: FileRequest):
    # Return the file name, file path, and bpm
    file_path = FileRequest.filePath
    file_name = os.path.basename(FileRequest.filePath).split(".")[0]
    file_ext = os.path.basename(FileRequest.filePath).split(".")[1]
    tempo,beats = librosa.beat.beat_track()

    # print(file_path)
    # print(file_name)
    # print(file_ext)
    # print("Opening file...")
    # print("File opened")
    return {"name": file_name, "path": file_path, "ext": file_ext}
@app.get("/api/voices/")
def get_voices():
    voices = []
    for models in os.listdir("./models"):
        voices.append(models)
    return {"voices": voices}

@app.get("/api/library/")
def get_library():
    # library is a json file
    with open("./gui/library.json") as f:
        library = json.load(f)
    return library

@app.post("/api/library/")
def add_to_library(File: FileClass):
    # Get the library
    with open("./gui/library.json") as file:
        library = json.load(file)
    
    # Check if the file is already in the library
    for file in library:
        if file["path"] == File.path:
            return {"message": "File is already in library"}

    # Add the file to the library
    library.append({
        "name": os.path.basename(File.path),
        "path": File.path
    })

    # Write the library to the json file
    with open("./gui/library.json", "w") as file:
        json.dump(library, file)
    
    return {"message": "Successfully added " + os.path.basename(File.path) + " to library"}

@app.post("/api/library/remove")
def remove_from_library(File: FilePath):
    print(File.path)
    # Check if file path is provided
    if File.path == "":
        return {"message": "No file path provided"}
    # Get the library
    with open("./gui/library.json") as file:
        library = json.load(file)

    # Check if the file is in the library
    for file in library:
        if file["path"] == File.path:
            library.remove(file)
            return {"message": "Successfully removed " + os.path.basename(File.path) + " from library"}
    
    return {"message": "File is not in library"}

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
    command = ["svc", "infer", "--no-auto-predict-f0", "-m", model_data, "-c", model_config, "-o", out_dir_now() + audio_file_name + "_" + VoiceRequest.voice + ".wav", VoiceRequest.filePath]
    subprocess.run(command, shell=True)
    return {"message": "Successfully changed voice to " + VoiceRequest.voice}