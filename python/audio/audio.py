import sys
import librosa
import soundfile
import os

from tkinter import * 
from tkinter import filedialog

audio_file = ""

def pitch_shift(y, sr, n_steps):
    print("Pitch shifting by " + str(n_steps) + " half steps")
    return librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)

def open_file():
    file = filedialog.askopenfilename(initialdir = "./", title = "Select file", filetypes = (("wav files","*.wav"),("all files","*.*")))
    print(file)
    audio_file = file
    Label(frame, text=audio_file).pack(padx=5, pady=5)
    return file
 
root = Tk()
frame = Frame(root)
frame.pack()

Button(frame, text="Open file", command=lambda: open_file()).pack(padx=5, pady=5)
 
Label(frame, text="Pitch shift").pack(padx=5, pady=5)
Scala = Scale(frame, from_=-10, to=10).pack(padx=5, pady=5)
Button(frame, text="Set pitch", command=lambda: pitch_shift(Scala.get())).pack(padx=5, pady=5)
 
Scala2 = Scale(frame, from_=0, to=10, orient=HORIZONTAL).pack(padx=5, pady=5)
 
root.mainloop()



in_dir = "./in/"
out_dir = "./out/"

exit();

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