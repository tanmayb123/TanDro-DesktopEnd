import pygame
import os
import sys

os.popen('./repairWAVHeader')

pygame.mixer.init()
pygame.mixer.music.load("outputnew.wav")
pygame.mixer.music.play()
while pygame.mixer.music.get_busy() == True:
    continue

os.popen('rm output.wav; rm outputnew.wav');
