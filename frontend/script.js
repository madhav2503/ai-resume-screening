
let chatData = JSON.parse(localStorage.getItem("chats")) || {};
let currentChatID = localStorage.getItem("currentChatID") || "Chat 1"; // Default to first chat
// let currentChatID = null;

// Load chats in sidebar
// function loadChatHistory() {
//     let chatList = document.getElementById("chatHistory");
//     chatList.innerHTML = "";

//     for (let chatID in chatData) {
//         let li = document.createElement("li");
//         li.textContent = chatID;
//         li.classList.add("chat-item");

//         if (chatID === currentChatID) {
//             li.classList.add("active-chat");
//         }

//         li.onclick = () => loadChat(chatID);
//         chatList.appendChild(li);
//     }
// }

// Load chats in sidebar with delete button
function loadChatHistory() {
    let chatList = document.getElementById("chatHistory");
    chatList.innerHTML = "";

    for (let chatID in chatData) {
        let li = document.createElement("li");
        li.classList.add("chat-item");

        // Create a span for the chat title/text
        let chatTextSpan = document.createElement("span");
        chatTextSpan.textContent = chatID;
        li.appendChild(chatTextSpan);

        // Create delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = (event) => {
            event.stopPropagation(); // Prevent li's click event
            deleteChat(chatID);
        };
        li.appendChild(deleteBtn);

        // Clicking anywhere on the list item (except the delete button) loads the chat
        li.onclick = () => loadChat(chatID);
        
        if (chatID === currentChatID) {
            li.classList.add("active-chat");
        }
        chatList.appendChild(li);
    }
}

// Function to delete a chat
function deleteChat(chatID) {
    if (confirm(`Are you sure you want to delete ${chatID}?`)) {
        delete chatData[chatID];
        localStorage.setItem("chats", JSON.stringify(chatData));

        // If the deleted chat is the current chat, update the current chat
        if (chatID === currentChatID) {
            const remainingChats = Object.keys(chatData);
            if (remainingChats.length > 0) {
                currentChatID = remainingChats[0];
                document.getElementById("chat-heading").textContent = currentChatID;
                loadChat(currentChatID);
            } else {
                // No chats left; create a new default chat
                currentChatID = "Chat 1";
                chatData[currentChatID] = [];
                localStorage.setItem("chats", JSON.stringify(chatData));
                document.getElementById("chat-heading").textContent = currentChatID;
                document.getElementById("chat-box").innerHTML = `<div class="bot-message">👋 Welcome! Enter resume & job description.</div>`;
            }
            localStorage.setItem("currentChatID", currentChatID);
        }
        loadChatHistory();
    }
}



function updateChatBox() {
    const chatBox = document.getElementById("chat-box");
    if (!chatBox) {
        console.error("chat-box not found!");
        return;
    }

    chatBox.innerHTML = `<div class="bot-message">👋 Welcome! Enter resume & job description.</div>`;
    
    if (chatData[currentChat]) {
        chatData[currentChat].forEach((msg) => {
            chatBox.innerHTML += msg;
        });
    }
}


// Start a new chat session
function startNewChat() {
    currentChatID = `Chat ${Object.keys(chatData).length + 1}`;
    chatData[currentChatID] = [];  // Create an empty chat
    localStorage.setItem("chats", JSON.stringify(chatData));

    document.getElementById("chat-heading").textContent = currentChatID; // Update heading
    document.getElementById("chat-box").innerHTML = `<div class="bot-message">👋 Welcome! Enter resume & job description`;
    loadChatHistory();
}

// // Load a chat from history
function loadChat(chatID) {
    currentChatID = chatID;
    document.getElementById("chat-heading").textContent = chatID; // Update heading
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    chatData[chatID].forEach(msg => {
        chatBox.innerHTML += msg;
    });

    loadChatHistory();
}

// Send message function
function sendMessage() {
    let resumeText = document.getElementById("resumeInput").value.trim();
    let jobText = document.getElementById("jobInput").value.trim();
    let chatBox = document.getElementById("chat-box");

    if (!resumeText || !jobText) {
        alert("Please enter both Resume and Job Description.");
        return;
    }

    let userMsg = `<div class="user-message">📄 Resume: ${resumeText}</div>
                   <div class="user-message">💼 Job: ${jobText}</div>`;
    chatBox.innerHTML += userMsg;
    chatBox.scrollTop = chatBox.scrollHeight;

    document.getElementById("resumeInput").value = "";
    document.getElementById("jobInput").value = "";

    document.getElementById("loading").style.display = "block";

    setTimeout(async () => {
        document.getElementById("loading").style.display = "none";

        let response = await fetchAIResponse(resumeText, jobText);
        let botResponse = `<div class="bot-message">${response}</div>`;

        chatBox.innerHTML += botResponse;
        chatBox.scrollTop = chatBox.scrollHeight;

        chatData[currentChatID].push(userMsg, botResponse);
        localStorage.setItem("chats", JSON.stringify(chatData));
    }, 2000);
}

document.getElementById("clearChatBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear this chat?")) {
        chatData[currentChatID] = [];
        localStorage.setItem("chats", JSON.stringify(chatData));
        document.getElementById("chat-box").innerHTML = `<div class="bot-message">🗑 Chat cleared!</div>`;
    }
});

document.getElementById("resumeFile").addEventListener("change", async function () {
    let file = this.files[0];
    if (!file) return; // Exit if no file selected

    console.log("New file selected:", file.name);

    // Reset the input field to allow re-uploading the same file
    this.value = "";

    // Reset text area before extracting text
    document.getElementById("resumeInput").value = "Extracting text...";

    // Call the function to extract text
    let extractedText = await extractTextFromPDF(file);
    
    if (extractedText) {
        document.getElementById("resumeInput").value = extractedText;
        console.log("Extracted Text:", extractedText);
    } else {
        document.getElementById("resumeInput").value = "Failed to extract text.";
        console.log("Text extraction failed.");
    }
});

async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = async function () {
            try {
                let typedarray = new Uint8Array(reader.result);
                console.log("PDF loaded into memory");

                let pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                console.log("PDF loaded successfully with", pdf.numPages, "pages");

                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    let page = await pdf.getPage(i);
                    let textContent = await page.getTextContent();
                    text += textContent.items.map(item => item.str).join(" ") + " ";
                    console.log(`Extracted text from page ${i}`);
                }

                resolve(text.trim());
            } catch (error) {
                console.error("Error extracting text:", error);
                resolve(null);
            }
        };

        reader.onerror = function (error) {
            console.error("FileReader error:", error);
            resolve(null);
        };

        // Read file as ArrayBuffer for PDF.js
        reader.readAsArrayBuffer(file);
    });
}




// Simulated AI response (replace with real API)
async function fetchAIResponse(resumeText, jobText) {
    try {
        let response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                resume_text: resumeText,
                job_description: jobText
            })
        });

        let data = await response.json();

        if (response.ok) {
            return `✅ Match Score: ${(data.similarity_score * 100).toFixed(2)}%<br>
                    🎯 Selected: ${data.selected}<br>
                    🏆 Qualified: ${data.qualified}`;
        } else {
            return `⚠️ Error: ${data.error}`;
        }
    } catch (error) {
        return `❌ Failed to connect to the server. Please try again later.`;
    }
}

// Initialize
document.getElementById("newChatBtn").addEventListener("click", startNewChat);
document.addEventListener("DOMContentLoaded", loadChatHistory);

