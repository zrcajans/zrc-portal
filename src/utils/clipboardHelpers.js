export const copyTextToClipboard = async (text, successMessage = 'Kopyalandı.') => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      await window.zrcAlert(successMessage);
    } catch {
      await window.zrcAlert('Kopyalama başarısız oldu. Bilgileri manuel kopyalayabilirsin.');
    }
  };
