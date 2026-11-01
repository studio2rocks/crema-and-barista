export interface CarStampData {
  dateTime: string;
  carYear: number;
  carMake: string;
  carModel: string;
  mods?: string;
  coffeeCupsCount: number;
  primaryCoffeeName: string;
  meetOrShopName: string;
  city?: string;
  totalPoints: number;
  carRating: number;
}

export interface BaristaStampData {
  dateTime: string;
  coffeeName: string;
  shopName: string;
  baristaName?: string;
  city?: string;
  totalPoints: number;
  baristaRating: number;
}

/**
 * Loads an image from a URL or Base64 string and burns an authentic Cars & Coffee
 * build spec sheet and date-time stamp watermark onto it using HTML5 Canvas.
 */
export async function stampCarImage(
  imageSrc: string,
  data: CarStampData
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDimension = 1280;
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

        // Draw car image
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

        // Bottom gradient scrim
        const footerHeight = Math.max(105, Math.round(height * 0.19));
        const gradient = ctx.createLinearGradient(0, height - footerHeight * 1.4, 0, height);
        gradient.addColorStop(0, 'rgba(10, 10, 12, 0)');
        gradient.addColorStop(0.3, 'rgba(10, 10, 12, 0.75)');
        gradient.addColorStop(1, 'rgba(10, 10, 12, 0.96)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - footerHeight * 1.4, width, footerHeight * 1.4);

        // Hairline divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(28, height - footerHeight + 10);
        ctx.lineTo(width - 28, height - footerHeight + 10);
        ctx.stroke();

        // 1. Digital ISO Timestamp & Paddock Venue
        ctx.fillStyle = '#f59e0b'; // Amber Gold
        ctx.font = `700 ${Math.max(11, Math.round(width * 0.018))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(
          `CARS & COFFEE // ${dateString.toUpperCase()} ${timeString} · ${data.meetOrShopName.toUpperCase()}${
            data.city ? ` (${data.city.toUpperCase()})` : ''
          }`,
          30,
          height - footerHeight + 30
        );

        // 2. Car Year Make Model
        const carTitle = `${data.carYear} ${data.carMake} ${data.carModel}`.toUpperCase();
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${Math.max(16, Math.round(width * 0.03))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(carTitle, 30, height - footerHeight + 58);

        // 3. Mods & Fuel Line
        const modsText = data.mods ? `MODS: ${data.mods}` : 'STOCK / CONCOURS CLEAN';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = `500 ${Math.max(11, Math.round(width * 0.018))}px "Plus Jakarta Sans", sans-serif`;
        // Truncate mods if very long
        const maxModsChars = Math.floor(width / 16);
        const displayedMods =
          modsText.length > maxModsChars ? modsText.slice(0, maxModsChars - 3) + '...' : modsText;
        ctx.fillText(displayedMods, 30, height - footerHeight + 80);

        // 4. Coffee Stats
        ctx.fillStyle = '#fde68a';
        ctx.font = `600 ${Math.max(11, Math.round(width * 0.017))}px "JetBrains Mono", monospace`;
        ctx.fillText(
          `COFFEE FUEL: ${data.coffeeCupsCount} ${
            data.coffeeCupsCount === 1 ? 'CUP' : 'CUPS'
          } (${data.primaryCoffeeName.toUpperCase()})`,
          30,
          height - footerHeight + 100
        );

        // 5. Total Score Badge on Right
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fbbf24';
        ctx.font = `900 ${Math.max(24, Math.round(width * 0.046))}px "JetBrains Mono", monospace`;
        ctx.fillText(`${data.totalPoints} PTS`, width - 30, height - footerHeight + 62);

        ctx.fillStyle = '#94a3b8';
        ctx.font = `700 ${Math.max(10, Math.round(width * 0.016))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(`BUILD STANCE ${data.carRating.toFixed(1)}/10`, width - 30, height - footerHeight + 84);

        // Top-Left Paddock Seal
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        const tagWidth = Math.max(160, Math.round(width * 0.28));
        ctx.fillRect(20, 20, tagWidth, 34);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.strokeRect(20, 20, tagWidth, 34);

        ctx.fillStyle = '#fef08a';
        ctx.font = `700 ${Math.max(10, Math.round(width * 0.016))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(`CARS & COFFEE VERIFIED`, 28, 42);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        console.error('Failed to stamp car image:', err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}

/**
 * Stamps barista and latte art photos with barista craft score and venue specs
 */
export async function stampBaristaImage(
  imageSrc: string,
  data: BaristaStampData
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDimension = 1280;
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

        ctx.drawImage(img, 0, 0, width, height);

        const dateObj = new Date(data.dateTime);
        const dateString = isNaN(dateObj.getTime())
          ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const timeString = isNaN(dateObj.getTime())
          ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const footerHeight = Math.max(90, Math.round(height * 0.17));
        const gradient = ctx.createLinearGradient(0, height - footerHeight * 1.4, 0, height);
        gradient.addColorStop(0, 'rgba(15, 10, 5, 0)');
        gradient.addColorStop(0.3, 'rgba(15, 10, 5, 0.7)');
        gradient.addColorStop(1, 'rgba(15, 10, 5, 0.95)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - footerHeight * 1.4, width, footerHeight * 1.4);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(28, height - footerHeight + 12);
        ctx.lineTo(width - 28, height - footerHeight + 12);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = `600 ${Math.max(11, Math.round(width * 0.019))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(`BARISTA CRAFT // ${dateString.toUpperCase()} ${timeString}`, 30, height - footerHeight + 34);

        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${Math.max(16, Math.round(width * 0.03))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(data.coffeeName.toUpperCase(), 30, height - footerHeight + 62);

        const locationStr = data.baristaName
          ? `${data.shopName.toUpperCase()} · BARISTA ${data.baristaName.toUpperCase()}`
          : data.shopName.toUpperCase();
        ctx.fillStyle = '#d6d3d1';
        ctx.font = `500 ${Math.max(11, Math.round(width * 0.019))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(locationStr, 30, height - footerHeight + 84);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#fbbf24';
        ctx.font = `900 ${Math.max(22, Math.round(width * 0.044))}px "JetBrains Mono", monospace`;
        ctx.fillText(`${data.totalPoints} PTS`, width - 30, height - footerHeight + 62);

        ctx.fillStyle = '#a8a29e';
        ctx.font = `600 ${Math.max(10, Math.round(width * 0.017))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(`LATTE ART CRAFT ${data.baristaRating.toFixed(1)}/10`, width - 30, height - footerHeight + 84);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        console.error('Failed to stamp barista image:', err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
