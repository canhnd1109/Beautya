import CloseIcon from "@mui/icons-material/Close";
import Face2Icon from "@mui/icons-material/Face2";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { showErrorToast } from "utils/showToasts";

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false); // Theo dõi trạng thái đang gửi
  const messagesEndRef = useRef(null);

  // Tải lịch sử trò chuyện từ localStorage khi component được mount
  useEffect(() => {
    const storedMessages =
      JSON.parse(localStorage.getItem("chatMessages")) || [];
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    } else {
      // Thiết lập tin nhắn mặc định hoặc trống nếu localStorage trống
      setMessages([
        {
          text: "Chào bạn! Chúng tôi rất vui được hỗ trợ bạn về mọi vấn đề liên quan đến làm đẹp. Hãy chia sẻ với chúng tôi, bạn đang quan tâm đến điều gì?",
          isUser: false,
        },
        // Thêm thêm tin nhắn mặc định nếu cần
      ]);
    }

    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    try {
      const userMessage = { text: input, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsSending(true); // Đặt trạng thái đang gửi thành true

      // Hiển thị một tin nhắn giữ chỗ trong khi chờ phản hồi thực tế
      const placeholderBotMessage = { text: ". . .", isUser: false };
      setMessages((prevMessages) => [...prevMessages, placeholderBotMessage]);

      // Chuẩn bị các tin nhắn cho API
      const apiMessages = messages.map((messageObject) => {
        const role = messageObject.isUser ? "user" : "assistant";
        return { role, content: messageObject.text };
      });

      // Thêm tin nhắn mới của người dùng
      apiMessages.push({ role: "user", content: input });

      // Gọi API đến ChatGPT
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Thay thế với khóa API thực sự của bạn
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: apiMessages,
          }),
        }
      );

      const responseData = await response.json();

      // Trích xuất phản hồi của trợ lý từ phản hồi của API
      const assistantReply = responseData.choices[0].message.content;

      const botMessage = {
        text: assistantReply,
        isUser: false,
      };
      // Thay thế tin nhắn giữ chỗ bằng phản hồi thực tế
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((message) =>
          message.text === ". . ." ? botMessage : message
        );
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setIsSending(false); // Đặt trạng thái đang gửi thành false sau khi nhận được phản hồi
    }

    // LOCAL
    // const userMessage = { text: input, isUser: true };
    // setMessages((prevMessages) => [...prevMessages, userMessage]);
    // setInput("");
    // setIsSending(true); // Đặt trạng thái đang gửi thành true

    // // Hiển thị một tin nhắn giữ chỗ trong khi chờ phản hồi thực tế
    // const placeholderBotMessage = { text: ". . .", isUser: false };
    // setMessages((prevMessages) => [...prevMessages, placeholderBotMessage]);

    // // Mô phỏng một phản hồi sau một khoảng thời gian ngắn (thay thế bằng cuộc gọi API của bạn)
    // setTimeout(() => {
    //   const botMessage = {
    //     text: "Tôi là một bot. Bạn nói: " + input,
    //     isUser: false,
    //   };
    //   // Thay thế tin nhắn giữ chỗ bằng phản hồi thực tế
    //   setMessages((prevMessages) => {
    //     const updatedMessages = prevMessages.map((message) =>
    //       message.text === ". . ." ? botMessage : message
    //     );
    //     localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    //     return updatedMessages;
    //   });
    //   setIsSending(false); // Đặt trạng thái đang gửi thành false sau khi nhận được phản hồi
    // }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Paper
      elevation={3}
      style={{
        position: "fixed",
        bottom: 32,
        right: 16,
        width: "calc(100% - 32px)", // Điều chỉnh chiều rộng cho màn hình nhỏ
        maxWidth: 500, // Giới hạn chiều rộng tối đa cho màn hình lớn hơn
        borderRadius: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column", // Điều chỉnh bố cục thành cột trên màn hình nhỏ
          backgroundColor: "#f5f5f5",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>
            Kết nối với Chatbot của chúng tôi
          </div>
          <IconButton color="primary" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
            backgroundColor: "#fff",
            paddingInline: "12px",
            borderRadius: 16,
          }}
        >
          {messages.map((message, index) => (
            <Grid
              container
              key={index}
              justifyContent={message.isUser ? "flex-end" : "flex-start"}
              alignItems="center"
            >
              <Grid item>
                {message.isUser ? null : (
                  <SupportAgentIcon color="primary" fontSize="large" />
                )}
              </Grid>
              <Grid item xs={8} marginBlock={0.5}>
                <div
                  style={{
                    textAlign: message.isUser ? "right" : "left",
                    paddingLeft: message.isUser ? 0 : 8,
                    fontSize: 16,
                    overflowWrap: "break-word",
                    color: message.isUser ? "white" : "black",
                    backgroundColor: message.isUser ? "#007bff" : "#e0e0e0",
                    padding: "8px",
                    borderRadius: message.isUser
                      ? "8px 8px 0 8px"
                      : "0 8px 8px 8px",
                  }}
                  className="Hello"
                >
                  {message.text}
                </div>
              </Grid>
              <Grid item ml={1}>
                {message.isUser ? (
                  <Face2Icon color="primary" fontSize="medium" />
                ) : null}
              </Grid>
            </Grid>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div
        style={{
          padding: 24,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: 16,
          borderTop: "1px solid #ccc", // Thêm đường biên để phân tách đầu vào tin nhắn
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{ marginRight: 16 }}
          disabled={isSending} // Vô hiệu hóa đầu vào trong khi gửi
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          style={{ borderRadius: 8 }}
          disabled={isSending} // Vô hiệu hóa nút trong khi gửi
        >
          {isSending ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </div>
    </Paper>
  );
};

export default Chat;
