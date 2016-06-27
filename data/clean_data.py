# -*- coding: utf-8 -*-
#!/usr/bin/python
import re
import os
import csv

BASE = os.path.dirname(os.path.abspath(__file__))

rootdir = os.path.join(BASE,/Users/uuchey/Documents/d3-js-project/Data/)
newdir  = os.path.join(BASE,/Users/uuchey/Documents/d3-js-project/Data/cleanedData/)

def cleanFile(line):
    libra = False
    dolar = False
    #line.strip()
    if(line.startswith(£) or line.startswith($)):
        if(line.startswith(£)):
          libra = True
        if(line.startswith($)):
          dolar = True
        print line:, line
        if(libra == True):
          symbol = £
        if(dolar == True):
          symbol = $
        if(symbol):
          without_symbol = line.split(symbol)
          line2 = without_symbol[1].split(',')
          if(len(line2) > 1):
              print line2[1]
    else:
        print line
    return line
#let the function return, not only print, to get the value for use as below 

for subdir, dirs, files in os.walk(rootdir):
    for file in files:
        if file.endswith(.csv):
          print file #print filename
          #open the file, reads it and copy the values to an array
          f=open(rootdir+file,'r') #use the absolute URL of the file
          lines = f.readlines()
          f.close()
          
          #create a new file to write the cleaned data
          f = open(file,'w') #universal mode can only be used with 'r' mode

          #write lines on csv file
          for line in lines:
              newline = cleanFile(line)
              f.write(newline)
          f.close()