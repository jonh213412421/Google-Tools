import asyncio
import threading
from torrentp import TorrentDownloader

# Define an asynchronous function to download the torrent
async def download_torrent():
    # Magnet link and destination folder
    magnet_link = "magnet:?xt=urn:btih:9EB9A3304096188F74D7C02795A48F5642E71670&dn=Diablo+Hellfire-GOG&tr=http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2F47.ip-51-68-199.eu%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2780%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2730%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce"
    destination_folder = "/content/drive/MyDrive/dw/test"
    
    torrent_file = TorrentDownloader(magnet_link, destination_folder)

    print("Starting download...")

    try:
        await torrent_file.start_download()  # Await the download, since it's a coroutine
        print("Download completed successfully.")
    except Exception as e:
        print(f"Download failed with error: {str(e)}")

# Function to run async tasks in a thread
def run_download_in_thread():
    def thread_function():
        # Get the current event loop and run the download coroutine
        loop = asyncio.new_event_loop()  # Create a new event loop for this thread
        asyncio.set_event_loop(loop)  # Set the new loop as the current one
        loop.run_until_complete(download_torrent())  # Run the async task

    # Create a thread and run the download function
    download_thread = threading.Thread(target=thread_function)
    download_thread.start()
    download_thread.join()  # Wait for the thread to finish

# Run the function that executes the download in a thread
run_download_in_thread()
