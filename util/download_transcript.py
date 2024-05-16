import os
import re
import json
import csv
from youtube_transcript_api import YouTubeTranscriptApi

def get_video_id(url):
    # Extract the video ID from the YouTube URL
    video_id = re.search(r"v=([a-zA-Z0-9_-]+)", url)
    if video_id:
        return video_id.group(1)
    return None

def clean_text(text):
    # Remove newline characters and replace with spaces
    return text.replace('\n', ' ')

def calculate_end_time(start, duration):
    # Calculate end time from start time and duration
    return start + duration

def download_transcripts(video_urls, output_folder='output', podcaster='Andrew Huberman'):
    # Create the output folder if it does not exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    for url in video_urls:
        video_id = get_video_id(url)
        if video_id:
            try:
                # Fetch the transcript for the video
                transcript = YouTubeTranscriptApi.get_transcript(video_id)
                
                # Clean the transcript and calculate end times
                cleaned_transcript = []
                for entry in transcript:
                    cleaned_entry = {
                        'text': clean_text(entry['text']),
                        'start': entry['start'],
                        'end': calculate_end_time(entry['start'], entry['duration'])
                    }
                    cleaned_transcript.append(cleaned_entry)
                
                # Define the output CSV file path
                output_file = os.path.join(output_folder, f'{video_id}.csv')
                
                # Write the cleaned transcript to a CSV file
                with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['text', 'start', 'end', 'link', 'podcaster']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    
                    writer.writeheader()
                    for entry in cleaned_transcript:
                        entry['link'] = url
                        entry['podcaster'] = podcaster
                        writer.writerow(entry)
                
                print(f'Transcript for video {video_id} saved to {output_file}')
            except Exception as e:
                print(f'Could not download transcript for video {video_id}: {e}')
        else:
            print(f'Invalid YouTube URL: {url}')


if __name__ == "__main__":
    # Example list of YouTube video links
    video_links = [
        "https://www.youtube.com/watch?v=qJ3uV7coZbA",
        "https://www.youtube.com/watch?v=AtChcxeaukQ"
    ]
    download_transcripts(video_links)