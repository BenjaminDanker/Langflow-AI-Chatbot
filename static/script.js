// Function to toggle chatbot visibility with animations
function toggleChat() {
    const popup = document.getElementById('chatPopup');
    const isVisible = popup.classList.contains('show');

    if (isVisible) {
        // Start fade-out animation
        popup.classList.add('fade-out');

        // Listen for transition end to hide the popup once
        popup.addEventListener('transitionend', handleFadeOut, { once: true });
    } else {
        // Remove any existing fade-out class
        popup.classList.remove('fade-out');

        // Show popup and start fade-in animation
        popup.style.display = 'flex';
        // Force reflow to restart the transition
        void popup.offsetWidth;
        popup.classList.add('show');

        // Automatically focus on the input box after transition
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 300); // Match this timeout with the CSS transition duration
    }
}

// Handle fade-out transition end
function handleFadeOut(event) {
    const popup = document.getElementById('chatPopup');
    if (event.propertyName === 'opacity') {
        popup.style.display = 'none';
        popup.classList.remove('show', 'fade-out');
    }
}

// Toggle fullscreen mode and focus on input if entering fullscreen
function toggleFullscreen() {
    const popup = document.getElementById('chatPopup');
    const isFullscreen = popup.classList.toggle('fullscreen');

    if (isFullscreen) {
        // Automatically focus on the input box when entering fullscreen
        document.getElementById('chatInput').focus();
    } else {
        // Optionally, you can add actions when exiting fullscreen
    }
}

// Handle Enter Key Press
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send a message to the server
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    const chatBody = document.getElementById('chatBody');
    const thinkingDiv = document.getElementById('chatbot-thinking');
  
    if (!message) return;
  
    // Add user's message
    addMessage(message, 'user');
    // Clear input and show "Thinking..."
    input.value = '';
    thinkingDiv.classList.remove('hidden');
  
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage: message }),
        });
        const data = await response.json();
  
        // Hide "Thinking..."
        thinkingDiv.classList.add('hidden');
        if (data.response) {
            // Show response with typewriter effect
            typeWriterEffect(data.response, chatBody);
        } else {
            addMessage('Sorry, something went wrong.', 'bot');
        }
    } catch (err) {
        // Hide "Thinking..." and show error
        thinkingDiv.classList.add('hidden');
        addMessage('Error: ' + err.message, 'bot');
    }
}

// Function to simulate typing animation
function typeWriterEffect(text, chatBody) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot__message chatbot__message--bot';
  
    const labelDiv = document.createElement('div');
    labelDiv.className = 'chatbot__label';
    labelDiv.textContent = 'AI Assistant';                                                                                                                            
  
    const textDiv = document.createElement('div');
    textDiv.className = 'chatbot__text';
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(textDiv);
    chatBody.appendChild(messageDiv);
  
    let i = 0;
    function type() {
        if (i < text.length) {
            textDiv.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50); // Adjust typing speed here
        }
    }
    type();
}

//Scroll to Bottom Function
function scrollToBottom() {
    const chatBody = document.getElementById('chatBody');
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Add user's or bot's message to the chat
function addMessage(content, sender) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot__message chatbot__message--${sender}`;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'chatbot__label';
    labelDiv.textContent = sender === 'user' ? 'You' : 'AI Assistant';

    const textDiv = document.createElement('div');
    textDiv.className = 'chatbot__text';
    textDiv.textContent = content;

    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(textDiv);
    chatBody.appendChild(messageDiv);
    scrollToBottom();  // Automatically scroll to bottom
}

function typeWriterEffect(text, chatBody) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot__message chatbot__message--bot';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'chatbot__label';
    labelDiv.textContent = 'AI Assistant';

    const textDiv = document.createElement('div');
    textDiv.className = 'chatbot__text';
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(textDiv);
    chatBody.appendChild(messageDiv);

    let i = 0;
    function type() {
        if (i < text.length) {
            textDiv.textContent += text.charAt(i);
            i++;
            scrollToBottom();
            setTimeout(type, 15);
        } else {
            // Add formatted text and image AFTER typing completes
            textDiv.innerHTML = makeLinksClickable(text);
            
            // Add image container if URL exists
            if (imageUrl && isValidImageUrl(imageUrl)) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'chatbot-image-container';
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = "Staff member photo";
                img.className = 'chatbot-image';
                
                // Add error handling for broken images
                img.onerror = () => {
                    imageContainer.remove();
                };
                
                imageContainer.appendChild(img);
                messageDiv.appendChild(imageContainer);
            }
            
            scrollToBottom();
        }
    }
    type();
    chatBody.appendChild(messageDiv);
}

// Add URL validation helper
function isValidImageUrl(string) {
    try {
        new URL(string);
        return string.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
    } catch (_) {
        return false;
    }
}

// Update sendMessage to pass image URL
async function sendMessage() {
    // ... existing code ...

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage: message }),
        });
        const data = await response.json();

        thinkingDiv.classList.add('hidden');
        if (data.response) {
            typeWriterEffect(data.response, chatBody, data.image_url);
        } else {
            addMessage('Sorry, something went wrong.', 'bot');
        }
    } catch (err) {
        thinkingDiv.classList.add('hidden');
        addMessage('Error: ' + err.message, 'bot');
    }
}

function scrollToBottom() {
    const chatBody = document.getElementById('chatBody');
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Attach the click event listener once when the script loads
document.addEventListener('click', function(event) {
    const popup = document.getElementById('chatPopup');
    const chatbotButton = document.querySelector('.chatbot__button');

    // If popup is not visible, do nothing
    if (!popup.classList.contains('show')) return;

    // Check if the clicked element is inside the popup or the chatbot button
    if (!popup.contains(event.target) && !chatbotButton.contains(event.target)) {
        // Start fade-out animation
        popup.classList.add('fade-out');

        // Listen for transition end to hide the popup once
        popup.addEventListener('transitionend', handleFadeOut, { once: true });
    }
});