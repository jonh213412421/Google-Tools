#sem a thread, ele encerra o processo antes
import asyncio
import threading
from torrentp import TorrentDownloader

# Define an asynchronous function to download the torrent
async def download_torrent():
    #cole o magnet
    magnet_link = "magnet:?xt=urn:btih:173AD72DA99EB9D220178B4C8560DEE60A2CED42&dn=Complete+Diablo+e-book+collection&tr=http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2F47.ip-51-68-199.eu%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2780%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2730%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce"
    #pode editar o diretório de destino
    destination_folder = "/content/drive/MyDrive/dw/test"
    
    torrent_file = TorrentDownloader(magnet_link, destination_folder)

    #printa "começando download"
    print("Começando download...")

    try:
        # espera fim de download
        await torrent_file.start_download()
        print("Download completed successfully.")
    except Exception as e:
        #exception
        print(f"Download failed with error: {str(e)}")

# Function to run async tasks in a thread - comentário original
def run_download_na_thread():
    def thread_function():
        # Get the current event loop and run the download coroutine
        loop = asyncio.new_event_loop()  # Create a new event loop for this thread
        asyncio.set_event_loop(loop)  # Set the new loop as the current one
        loop.run_until_complete(download_torrent())  # Run the async task

    #thread
    download_thread = threading.Thread(target=thread_function)
    download_thread.start()
    download_thread.join()  #espera a thread acabar - impede o fluxo de terminar

# roda a função
run_download_na_thread()
