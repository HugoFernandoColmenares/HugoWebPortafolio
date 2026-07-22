import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

const BUCKET = 'portfolio-images';
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const WEBP_QUALITY = 0.82;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly supabase = inject(SupabaseService);

  async uploadOptimizedImage(file: File, folder = 'projects'): Promise<string> {
    this.validateImageFile(file);
    const optimized = await this.convertToWebp(file);
    const path = `${folder}/${crypto.randomUUID()}.webp`;

    const { error } = await this.supabase.client.storage
      .from(BUCKET)
      .upload(path, optimized, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = this.supabase.client.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  private validateImageFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      throw new Error('INVALID_IMAGE_TYPE');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('IMAGE_TOO_LARGE');
    }
  }

  private convertToWebp(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const { width, height } = this.getScaledDimensions(image.width, image.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('CANVAS_UNAVAILABLE'));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('IMAGE_OPTIMIZATION_FAILED'));
              return;
            }

            resolve(blob);
          },
          'image/webp',
          WEBP_QUALITY,
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('IMAGE_LOAD_FAILED'));
      };

      image.src = objectUrl;
    });
  }

  private getScaledDimensions(width: number, height: number): { width: number; height: number } {
    if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
      return { width, height };
    }

    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio),
    };
  }
}
