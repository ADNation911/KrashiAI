// Browser image picker service to replace expo-image-picker

export interface ImagePickerResult {
  canceled: boolean;
  assets?: Array<{
    uri: string;
    width?: number;
    height?: number;
    type?: string;
    fileName?: string;
  }>;
}

export const requestCameraPermissionsAsync = async (): Promise<{ status: string }> => {
  // In browser, we can't directly request camera permissions
  // The browser will prompt when accessing camera
  return { status: 'granted' };
};

export const launchCameraAsync = async (options?: {
  quality?: number;
  allowsEditing?: boolean;
}): Promise<ImagePickerResult> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use back camera on mobile

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve({ canceled: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const uri = e.target?.result as string;
        resolve({
          canceled: false,
          assets: [
            {
              uri,
              fileName: file.name,
              type: file.type,
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    };

    input.oncancel = () => {
      resolve({ canceled: true });
    };

    input.click();
  });
};

export const launchImageLibraryAsync = async (options?: {
  quality?: number;
  allowsEditing?: boolean;
}): Promise<ImagePickerResult> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve({ canceled: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const uri = e.target?.result as string;
        resolve({
          canceled: false,
          assets: [
            {
              uri,
              fileName: file.name,
              type: file.type,
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    };

    input.oncancel = () => {
      resolve({ canceled: true });
    };

    input.click();
  });
};


