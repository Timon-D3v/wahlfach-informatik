# This is a TigerJython File
# Chat App
from tcpcom import TCPClient

def handle_event(event, message):
    print(event, message)
    
def send_message():
    message = input("Deine Nachricht: ")
    client.sendMessage(message)
    
    send_message()
    
    
server_ip = "116.203.99.55"
port = 43223
client = TCPClient(server_ip, port, stateChanged=handle_event)
client.connect()

send_message()