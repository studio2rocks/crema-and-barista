export interface StampData {
  dateTime: string;
  coffeeName: string;
  shopName: string;
  city?: string;
  totalPoints: number;
  baristaRating: number;
}

/**
 * Loads an image from a URL or Base64 string and burns an artisan date-time stamp
 * and coffee scorecard watermark onto it using HTML5 Canvas.
 */
export async function stampCoffeeImage(
  imageSrc: string,
  data: StampData
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0, width, height);

        // Format Date Time
        const dateObj = new Date(data.dateTime);
        const dateString = isNaN(dateObj.getTime())
          ? new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

        const timeString = isNaN(dateObj.getTime())
          ? new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

        const locationText = data.city
          ? `${data.shopName.toUpperCase()} · ${data.city.toUpperCase()}`
          : data.shopName.toUpperCase();

        // Overlay a refined modern editorial watermark scrim in the bottom portion
        const footerHeight = Math.max(90, Math.round(height * 0.16));
        const gradient = ctx.createLinearGradient(0, height - footerHeight * 1.5, 0, height);
        gradient.addColorStop(0, 'rgba(15, 10, 5, 0)');
        gradient.addColorStop(0.3, 'rgba(15, 10, 5, 0.65)');
        gradient.addColorStop(1, 'rgba(15, 10, 5, 0.94)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - footerHeight * 1.5, width, footerHeight * 1.5);

        // Subtle hairline rule above stamp
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, height - footerHeight + 15);
        ctx.lineTo(width - 30, height - footerHeight + 15);
        ctx.stroke();

        // 1. Digital ISO Timestamp & Camera Look (Top right or stamp line)
        ctx.fillStyle = '#f59e0b'; // Amber Gold
        ctx.font = `600 ${Math.max(12, Math.round(width * 0.022))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(`TIMESTAMP: ${dateString.toUpperCase()} ${timeString}`, 32, height - footerHeight + 38);

        // 2. Coffee Name & Shop
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${Math.max(16, Math.round(width * 0.03))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(data.coffeeName.toUpperCase(), 32, height - footerHeight + 68);

        ctx.fillStyle = '#d6d3d1'; // Stone 300
        ctx.font = `500 ${Math.max(12, Math.round(width * 0.02))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(locationText, 32, height - footerHeight + 92);

        // 3. Score badge on the right
        const scoreText = `${data.totalPoints} PTS`;
        ctx.textAlign = 'right';

        // Draw points highlight
        ctx.fillStyle = '#fbbf24'; // Warm gold
        ctx.font = `800 ${Math.max(22, Math.round(width * 0.042))}px "JetBrains Mono", monospace`;
        ctx.fillText(scoreText, width - 32, height - footerHeight + 66);

        ctx.fillStyle = '#a8a29e';
        ctx.font = `600 ${Math.max(11, Math.round(width * 0.018))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(`BARISTA CRAFT ${data.baristaRating}/10`, width - 32, height - footerHeight + 90);

        // Top Left corner subtle camera metadata stamp (like Leica / Hasselblad proof)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        const tagWidth = Math.max(140, Math.round(width * 0.25));
        ctx.fillRect(20, 20, tagWidth, 32);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(20, 20, tagWidth, 32);

        ctx.fillStyle = '#fde68a';
        ctx.font = `600 ${Math.max(10, Math.round(width * 0.016))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(`CREMA & CRAFT VERIFIED`, 28, 41);

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        console.error('Failed to stamp image:', err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
