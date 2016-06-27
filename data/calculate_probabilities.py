# -*- coding: utf-8 -*-
#!/usr/bin/python
import re
import os
import csv
import sys
import pandas

BASE = os.path.dirname(os.path.abspath(__file__))

rootdir = os.path.join(BASE,'/Users/uuchey/Documents/d3-js-project/web-project/site/cleaned_data/')
newdir  = os.path.join(BASE,'/Users/uuchey/Documents/d3-js-project/web-project/site/cleaned_data/probabilities/')

def is_number(s):
    try:
        float(s)
        int(s)
        return True
    except ValueError:
        return False

#calculate probability based on odds
def calculate_percentage_probability(line):
  #print line
  odds = line.split(",")
  if((odds[1]) != "Back_all"):
    float_odds = float(odds[1])
    #print "odds: ", odds[1]
    if(is_number(float_odds)):
      probability = (1 / float(odds[1])) * 100
      #print "probability", probability
      return [odds[0],odds[1],odds[2],probability]
    else:
      print "is not number:", odds[1]
  return line


for subdir, dirs, files in os.walk(rootdir):
    #print files
    for file in files:
        if (file.endswith('Table1.csv')):
            print file #print filename
            f = open(rootdir + file,'r') #use the absolute URL of the file
            lines = f.readlines()

            f.close()

            with open(newdir + 'probability_' + file, 'a') as out_file:
                probablility_sum = []
                csv_out= csv.writer(out_file)
                csv_out.writerow(['Team','odds_in_favor','odds_against','probability'])
                del lines[0]
                for line in lines:
                    newline = calculate_percentage_probability(line)
                    #print newline[3]
                    probablility_sum.append(newline[3])
                    #print probablility_sum
                    csv_out.writerow(newline)

                # print "Probabilities sum:", sum(probablility_sum)
                # print "Vector size:", len(probablility_sum)
                out_file.close()
