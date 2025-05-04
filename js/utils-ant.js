export async function hashString(str) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }
export async function shaHash(input, algorithm) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
export function copyToClipboard(elementId) {
      const codeBlock = document.getElementById(elementId);
      if (!codeBlock) return;
      const textToCopy = codeBlock.textContent;
      console.log("Attempting to copy:", textToCopy); // Debug log
      if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
              console.log("Clipboard API copy successful."); // Debug log
              showToast("Copied to clipboard!"); showCopiedMessage(elementId);
          }).catch(err => {
              console.error("Async clipboard copy failed:", err); fallbackCopyToClipboard(textToCopy, elementId);
          });
      } else {
          console.warn("Using fallback copy method."); // Debug log
          fallbackCopyToClipboard(textToCopy, elementId);
      }
    }
export function fallbackCopyToClipboard(text, elementId) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; textArea.style.top = "-9999px"; textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();
        try {
            const successful = document.execCommand("copy");
            if (successful) {
                console.log("Fallback copy successful."); // Debug log
                showToast("Copied to clipboard!"); showCopiedMessage(elementId);
            } else {
                console.error("Fallback copy command failed."); // Debug log
                showToast("Failed to copy (execCommand failed)", true);
            }
        } catch (err) {
            console.error("Fallback copy failed with error:", err);
            showToast("Failed to copy", true);
        }
        document.body.removeChild(textArea);
    }
export function showToast(message, isInfo = false) {
      const toast = document.getElementById("toast");
      if (!toast) return;
      console.log(`Showing toast: "${message}" (Info: ${isInfo})`); // Debug log
      toast.textContent = message;
      toast.className = 'toast'; // Reset class
      if (isInfo) {
          toast.classList.add('info');
      }
      toast.style.display = "block";
      toast.style.opacity = 1;
      if (toast.timer) clearTimeout(toast.timer);
      toast.timer = setTimeout(() => {
          toast.style.opacity = 0;
          setTimeout(() => { toast.style.display = 'none'; }, 500);
      }, 2500);
    }
export function showCopiedMessage(elementId) {
        const messageId = `copied-${elementId}`;
        const messageEl = document.getElementById(messageId);
        if (messageEl) {
            messageEl.style.display = "inline";
            setTimeout(() => { messageEl.style.display = "none"; }, 1500);
        }
    }
export function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
export function toggleDarkMode() {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark);
      if (darkModeToggleBtn) darkModeToggleBtn.textContent = isDark ? '☀️' : '🌗';
      console.log(`Dark mode toggled: ${isDark}`); // Debug log
      showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', true);
    }
