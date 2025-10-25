import { useEffect, useRef, useState } from 'react';
import style from './ChatRoom.module.css';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { jwtDecode } from 'jwt-decode';
import { formatDateTime } from '../../utils/format';
import ChatService from '../../services/User/ChatService';
const ChatRoom = ({api, projectId}) => {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const usernameRef = useRef(null);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return;
        }
        usernameRef.current = jwtDecode(accessToken)?.username || 'unknown';
        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_SERVER_URL}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            reconnectDelay: 5000,
            onConnect: async () => {
                setConnected(true);
                client.subscribe(`/topic/chat/${projectId}`, (message) => {
                    try {
                        const chatMessage = JSON.parse(message.body);
                        setMessages((prev) => [chatMessage, ...prev]);
                    } catch (e) {
                        console.error('Error parsing message:', e);
                    }
                }, {
                    Authorization: `Bearer ${accessToken}`
                });
                await loadChatHistory();
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                setConnected(false);
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                setConnected(false);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
                setConnected(false);
            }
        });
        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current.deactivate();
        };
    }, []);

    const loadChatHistory = async () => {
        let data = null;
        try {
            data = await ChatService.getChatHistory(api, projectId);
            if (data) {
                setMessages(data);
            }
        } catch (error) {
            setMessages([]);
        } 
    }

    const sendMessage = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return;
        }
        if (!userInput.trim() || !connected) return;

        const chatMessage = {
            sender: usernameRef.current,
            content: userInput
        };
        clientRef.current.publish({
            destination: `/app/chat/${projectId}/send`,
            body: JSON.stringify(chatMessage),
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        setUserInput("");
    }
    return (
        <>
            <div className={style.chatContainer}>
                <div className={style.messageContainer}>
                    {
                        messages?.map((msg, index) => (
                            <div key={index}>
                                <div className={msg.sender === usernameRef.current && msg.sender !== 'unknown' ? style.own : ''}>
                                    <div className={style.sender}>
                                        {msg.sender}
                                    </div>
                                    <div className={style.message}>
                                        {msg.content}
                                        <div className={style.sending_time}>
                                            {formatDateTime(new Date(msg.sentAt), 'vi-VN')}
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='d-flex'>
                    <div className={style.inputMessage}>
                        <input type="text"
                            value={userInput}
                            placeholder='Enter the message...'
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                    </div>
                    <button className={style.sendButton} onClick={sendMessage}>Send</button>
                </div>
            </div>
        </>
    );
}
export default ChatRoom;