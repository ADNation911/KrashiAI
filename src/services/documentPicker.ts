// Browser document picker service to replace expo-document-picker

export interface DocumentPickerResult {
  canceled: boolean;
  assets?: Array<{
    uri: string;
    name: string;
    size?: number;
    mimeType?: string;
  }>;
}

export const getDocumentAsync = async (options?: {
  type?: string;
}): Promise<DocumentPickerResult> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (options?.type) {
      input.accept = options.type;
    }

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
              name: file.name,
              size: file.size,
              mimeType: file.type,
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


